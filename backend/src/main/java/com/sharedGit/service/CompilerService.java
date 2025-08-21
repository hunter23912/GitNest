package com.sharedGit.service;

import java.io.File;
import java.io.IOException;

public interface CompilerService {
    File compilecodeC(String code) throws Exception;

    void cleanupFileC(File exefile);

    File compileCodeJava(String code) throws Exception;

    String extractClassNameJava(String code);

    void cleanupFilesJava(File classFile);
}