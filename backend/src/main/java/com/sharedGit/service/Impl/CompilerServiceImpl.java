package com.sharedGit.service.Impl;

import com.sharedGit.service.CompilerService;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CompilerServiceImpl implements CompilerService {

    private static final String TEMP_DIR_C = "temp_C/";
    private static final String CPP_EXTENSION = ".cpp";
    private static final String EXE_EXTENSION = ".exe";
    private static final String JAVA_EXTENSION = ".java";
    private static final String CLASS_EXTENSION = ".class";

    @Override
    public String compilecodeC(String code, String baseName) throws Exception {
        // 创建临时目录（如果不存在）
        String basePath = TEMP_DIR_C + baseName;
        Path tempDir = Paths.get(basePath);
        if (!Files.exists(tempDir)) {
            Files.createDirectories(tempDir);
        }

        // 生成唯一文件名
        String cppFileName = baseName + CPP_EXTENSION;
        String exeFileName = baseName + EXE_EXTENSION;

        // 写入C++代码到文件
        Path cppFile = tempDir.resolve(cppFileName);
        Files.write(cppFile, code.getBytes(StandardCharsets.UTF_8));

        // 编译代码
        ProcessBuilder processBuilder = new ProcessBuilder(
                "g++",
                "-std=c++11",
                cppFile.toString(),
                "-o",
                tempDir.resolve(exeFileName).toString()
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // 等待编译完成，设置超时时间（30秒）
        boolean finished = process.waitFor(30, TimeUnit.SECONDS);

        if (!finished) {
            process.destroy();
            throw new Exception("编译超时");
        }

        int exitCode = process.exitValue();

        if (exitCode != 0) {
            // 读取错误信息
            String errorOutput = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            throw new Exception("编译失败: " + errorOutput);
        }

        // 返回生成的可执行文件
        File exeFile = tempDir.resolve(exeFileName).toFile();
        if (!exeFile.exists()) {
            throw new Exception("可执行文件未生成");
        }

        try {
            Process runProcess = new ProcessBuilder(exeFile.getAbsolutePath())
                    .directory(tempDir.toFile())
                    .start();

            // 设置超时（10秒）
            boolean finished2 = runProcess.waitFor(10, TimeUnit.SECONDS);

            if (!finished2) {
                runProcess.destroy();
                throw new Exception("执行超时");
            }

            // 获取执行结果
            String output = readProcessOutput(runProcess);
//            int exitCode = runProcess.exitValue();
            return output;
        } catch (Exception e) {
            return ("执行错误: " + e.getMessage());
        }
    }

    @Override
    public String compileCodeJava(String code, String basePath) throws Exception {
        Path tempDir = Paths.get(basePath);
        if (!Files.exists(tempDir)) {
            Files.createDirectories(tempDir);
        }

        // 提取类名（从public class声明中）
        String className = extractClassNameJava(code);
        if (className == null) {
            throw new Exception("代码中未找到public class声明");
        }

        String javaFileName = className + JAVA_EXTENSION;
        Path javaFile = tempDir.resolve(javaFileName);

        // 写入Java代码到文件
        Files.write(javaFile, code.getBytes(StandardCharsets.UTF_8));

        // 编译Java代码
        ProcessBuilder processBuilder = new ProcessBuilder(
                "javac",
                "-encoding", "UTF-8",
                javaFile.toString()
        );

        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // 等待编译完成，设置超时时间（30秒）
        boolean finished = process.waitFor(30, TimeUnit.SECONDS);

        if (!finished) {
            process.destroy();
            throw new Exception("Java编译超时");
        }

        int exitCode = process.exitValue();

        if (exitCode != 0) {
            String errorOutput = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            throw new Exception("Java编译失败: " + errorOutput);
        }

        // 检查生成的.class文件
        Path classFile = tempDir.resolve(className + CLASS_EXTENSION);
        if (!Files.exists(classFile)) {
            throw new Exception(".class文件未生成");
        }

        Process runProcess = new ProcessBuilder(
                "java",
                "-cp", tempDir.toString(),
                className
        ).start();

        // 设置超时（10秒）
        boolean finished2 = runProcess.waitFor(10, TimeUnit.SECONDS);

        if (!finished2) {
            runProcess.destroy();
            throw new Exception("执行超时");
        }

        // 获取执行结果
        String output = readProcessOutput(runProcess);
//        int exitCode = runProcess.exitValue();

        return output;
    }

    @Override
    public String extractClassNameJava(String code) {
        Pattern pattern = Pattern.compile("public\\s+class\\s+(\\w+)");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }

        // 如果没有public class，尝试找class
        pattern = Pattern.compile("class\\s+(\\w+)");
        matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }

        return null;
    }

    @Override
    public void cleanupFiles(String basePath) {
        if (basePath != null) {
            try {
                Path tempDir = Paths.get((basePath));
                // 删除所有临时文件
                Files.walk(tempDir)
                        .sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);

            } catch (IOException e) {
                System.err.println("清理文件失败: " + e.getMessage());
            }
        }
    }

    private String readProcessOutput(Process process) throws IOException {
        try (InputStream inputStream = process.getInputStream();
             InputStream errorStream = process.getErrorStream()) {

            String output = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            String error = new String(errorStream.readAllBytes(), StandardCharsets.UTF_8);

            if (!error.isEmpty()) {
                return output + "\n" + error;
            }
            return output;
        }
    }
}