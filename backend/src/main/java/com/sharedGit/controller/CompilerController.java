package com.sharedGit.controller;


import com.sharedGit.service.CompilerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.UUID;


@RestController
@RequestMapping("/compiler")
public class CompilerController {

    private static final String TEMP_DIR_C = "temp_C/";
    private static final String TEMP_DIR_Java = "temp_java/";

    @Autowired
    CompilerService compilerService;

    @PostMapping("/c")
    public String complieC(@RequestBody String code) {
        String baseName = "/code_" + System.currentTimeMillis() + "_" + UUID.randomUUID();
        String basePath = TEMP_DIR_C + baseName;
        String res = "";
        try {
            res = compilerService.compilecodeC(code, baseName);
            return res;
//            Resource resource = new FileSystemResource(exefile);
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION,
//                            "attachment; filename=\"" + exefile.getName() + "\"")
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .contentLength(exefile.length())
//                    .body(resource);

        } catch (Exception e) {
            return ("服务器错误: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ByteArrayResource(("服务器错误: " + e.getMessage()).getBytes()));
        } finally {
            // 清理临时文件
            if (res != "") {
                try {
                    compilerService.cleanupFiles(basePath);
                } catch (Exception e) {
                    // 记录日志，但不影响主流程
                    System.err.println("清理文件失败: " + e.getMessage());
                }
            }
        }
    }

    @PostMapping("/java")
    public String compileJava(@RequestBody String code) {
        String basePath = TEMP_DIR_Java + "/code_" + System.currentTimeMillis() + "_" + UUID.randomUUID();
        String res = "";
        try {
            res = compilerService.compileCodeJava(code, basePath);
            return res;
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION,
//                            "attachment; filename=\"" + className + ".class\"")
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .contentLength(classFile.length())
//                    .body(new FileSystemResource(classFile));

        } catch (Exception e) {
            return ("服务器错误: " + e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ByteArrayResource(("服务器错误: " + e.getMessage()).getBytes()));
        } finally {
            if (res != "") {
                compilerService.cleanupFiles(basePath);
            }
        }
    }

}