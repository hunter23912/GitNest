package com.sharedGit.service;

import com.sharedGit.pojo.File;

import java.io.IOException;
import java.util.List;

public interface FileService {
    List<File> getFileListByUserid(Integer userid);

    List<File> getFileListByRepoid(Integer repoid);

    void addFile(Integer repoid, String path, Integer editor, String filename, String message);

    void updateFile(Integer fileid, String newFilePath, Integer editor, String filename, String message);

    void deleteFile(Integer fileid);

    List<File> getHistoryVersionList(Integer fileid);

    void goback(Integer fileid, Integer version);

    void clearRubbish();

    List<File> getRubbishList();

    void restoreVerion(Integer fileid, Integer version);

    void updatecode(Integer fileid, String newcode,Integer editor,String message) throws IOException;
}
