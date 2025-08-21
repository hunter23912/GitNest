package com.sharedGit.controller;


import com.sharedGit.service.CompilerService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.http.HttpEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;


@RestController
@RequestMapping("/compiler")
public class CompilerController {

    @Autowired
    CompilerService compilerService;

    @PostMapping("/c")
    public ResponseEntity<Resource> complieC(@RequestBody String code){
        File exefile=null;
        try{
            exefile=compilerService.compilecodeC(code);
            System.out.println("编译完成");
            Resource resource = new FileSystemResource(exefile);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + exefile.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(exefile.length())
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource(("服务器错误: " + e.getMessage()).getBytes()));
        } finally {
            // 清理临时文件
//            if (exefile != null) {
//                try {
//                    compilerService.cleanupFileC(exefile);
//                } catch (Exception e) {
//                    // 记录日志，但不影响主流程
//                    System.err.println("清理文件失败: " + e.getMessage());
//                }
//            }
        }
    }

    @PostMapping("/java")
    public ResponseEntity<Resource> compileJava(@RequestBody String code){
        File classFile = null;
        try {
            classFile = compilerService.compileCodeJava(code);
            System.out.println("编译完成");
            String className = compilerService.extractClassNameJava(code);
            System.out.println("准备返回文件");
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + className + ".class\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(classFile.length())
                    .body(new FileSystemResource(classFile));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource(("服务器错误: " + e.getMessage()).getBytes()));
        } finally {
//            if (classFile != null) {
//                compilerService.cleanupFilesJava(classFile);
//            }
        }
    }


}