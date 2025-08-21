package com.sharedGit.service.Impl;

import com.sharedGit.mapper.FileMapper;
import com.sharedGit.pojo.File;
import com.sharedGit.service.FileService;
import com.sharedGit.utils.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    FileMapper fileMapper;

    @Override
    public List<File> getFileListByUserid(Integer userid) {
        List<File> fileList=fileMapper.getFileListByUserid(userid);
        return fileList;
    }

    @Override
    public List<File> getFileListByRepoid(Integer repoid) {
        List<File> fileList=fileMapper.getFileListByRepoid(repoid);
        return fileList;
    }

    @Override
    public void addFile(Integer repoid, String path, Integer editor, String filename, String message) {
        File file = new File();
        file.setRepoid(repoid);
        fileMapper.addFile(file); // 主键自动回填到 file.fileid

        Integer fileid = file.getFileid();
        Map<String, Object> claims = (Map<String, Object>) ThreadLocalUtil.get();
        Integer user = (editor != null) ? editor : (Integer) claims.get("userid");
        fileMapper.addVersion(fileid, path, user, 0, filename, message);
    }

    @Override
    public synchronized void updatecode(Integer fileid, String newcode,Integer editor,String message) throws IOException {
        File oldFile=fileMapper.findByFileid(fileid);
        String oldpath=oldFile.getPath();
        String newpath="./files/"+ UUID.randomUUID().toString() +oldpath.substring(oldpath.lastIndexOf("."));
        Path path= Paths.get(newpath);
        Files.writeString(path,newcode, StandardOpenOption.CREATE);
        Integer version=oldFile.getVersion();
        if(editor!=null){
            oldFile.setEditor(editor);
        }
        if(message!=null){
            oldFile.setMessage(message);
        }
        fileMapper.addVersion(fileid,newpath,oldFile.getEditor(),version+1,oldFile.getFilename(),message);
        fileMapper.updateFile(fileid,version+1);
    }

    @Override
    public synchronized void updateFile(Integer fileid, String newFilePath, Integer editor, String filename, String message) {
        File file=fileMapper.findByFileid(fileid);
        Integer version=file.getVersion();
        if(editor!=null){
            file.setEditor(editor);
        }
        if(message!=null){
            file.setMessage(message);
        }
        else{
            file.setMessage("");
        }
        fileMapper.addVersion(fileid,newFilePath,file.getEditor(),version+1,filename,message);
        fileMapper.updateFile(fileid,version+1);
    }

    @Override
    public void deleteFile(Integer fileid) {
        //将isrubbish置为true，然后将version置为-1
        fileMapper.goRubbishFile(fileid);
        fileMapper.updateFile(fileid,-1);
    }

    @Override
    public List<File> getHistoryVersionList(Integer fileid) {
        List<File> fileList=fileMapper.getFileListByFileid(fileid);
        return fileList;
    }

    @Override
    public void goback(Integer fileid, Integer version) {
        fileMapper.updateFile(fileid,version);
        fileMapper.gobackVersion(fileid,version);
    }

    @Override
    public void clearRubbish() {
        fileMapper.deleteVersion();
        fileMapper.deleteFile();
    }

    @Override
    public List<File> getRubbishList() {
        List<File> rubbishList=fileMapper.getRubbishList();
        return rubbishList;
    }

    @Override
    public void restoreVersion(Integer fileid, Integer version) {
        if(version==-1){
            fileMapper.restoreVersionAll(fileid);
        }
        else{
            fileMapper.restoreVersion(fileid,version);
        }
        Integer latestVersion=fileMapper.findLatestVersion(fileid);
        fileMapper.updateFile(fileid,latestVersion);
    }

}
