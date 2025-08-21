package com.sharedGit.service;

import java.io.File;
import java.io.IOException;

public interface CompilerService {
    String compilecodeC(String code, String baseName) throws Exception;

    String compileCodeJava(String code, String basePath) throws Exception;

    String extractClassNameJava(String code);

    void cleanupFiles(String basePath);
}