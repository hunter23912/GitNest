package com.sharedGit.controller;


import com.sharedGit.pojo.FIleDTO;
import com.sharedGit.pojo.File;
import com.sharedGit.pojo.Result;
import com.sharedGit.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/file")
public class FileController {

    @Autowired
    FileService fileService;

    private static final String FILE_PATH="/files/";

    @GetMapping("/user")
    public Result<List<File>> getFileListByUserid(Integer userid){
        List<File> fileList=fileService.getFileListByUserid(userid);
        return Result.success(fileList);
    }

    @GetMapping("/repo")
    public Result<List<File>> getFileListByRepoid(Integer repoid){
        List<File> fileList=fileService.getFileListByRepoid(repoid);
        return Result.success(fileList);
    }

    @PostMapping("/upload")
    public Result upload(MultipartFile file) throws IOException {
        String currentPath=System.getProperty("user.dir");
        String originalFilename=file.getOriginalFilename();
        Path fileDir= Paths.get(currentPath +FILE_PATH);
        if (!Files.exists(fileDir)) {
            Files.createDirectories(fileDir);
        }
        String localpath=fileDir+"/"+ UUID.randomUUID().toString() +originalFilename.substring(originalFilename.lastIndexOf("."));
        System.out.println("文件将被保存到"+localpath);
        file.transferTo(new java.io.File(localpath));
        return  Result.success(localpath);
    }

    @PostMapping()
    public Result addFile(@RequestBody FIleDTO file){
        System.out.println(file.repoid);
        fileService.addFile(file.repoid, file.path, file.editor, file.filename, file.message);
        return Result.success();
    }

    @GetMapping()
    public Result getFile(String path){
        StringBuilder filecontent=new StringBuilder();
        try(BufferedReader br=new BufferedReader(new FileReader(path))) {
            String currentline;
            while ((currentline= br.readLine())!=null){
                filecontent.append(currentline).append("\n");
            }
        }catch (IOException e){
            e.printStackTrace();
        }
        String content=filecontent.toString();
        return Result.success(content);
    }

    @PostMapping("/update")
    public Result updateCode(Integer fileid,String newcode, @RequestParam(required = false)Integer editor, @RequestParam(required = false)String message) throws IOException {
        fileService.updatecode(fileid,newcode,editor,message);
        return Result.success();
    }

    @PutMapping()
    public Result updateFile(Integer fileid, String newFilePath, @RequestParam(required = false)Integer editor, String filename, String message){
        fileService.updateFile(fileid,newFilePath,editor,filename,message);
        return Result.success();
    }

    @DeleteMapping()
    public Result deleteFile(Integer fileid){
        fileService.deleteFile(fileid);
        return Result.success();
    }

    @GetMapping("/history")
    public Result getHistoryVersionList(Integer fileid){
        List<File> fileList=fileService.getHistoryVersionList(fileid);
        return Result.success(fileList);
    }

    @GetMapping("/back")
    public Result goback(Integer fileid,Integer version){
        fileService.goback(fileid,version);
        return Result.success();
    }

    @GetMapping("/rubbish")
    public Result<List<File>> getRubbishList(){
        List<File> rubbishList=fileService.getRubbishList();
        return Result.success(rubbishList);
    }

    @DeleteMapping("/clear")
    public Result clearRubbish(){
        fileService.clearRubbish();
        return Result.success();
    }

    @GetMapping("/restore")
    public Result restoreVersion(Integer fileid, Integer version){     //移出回收站
        fileService.restoreVersion(fileid,version);
        return Result.success();
    }

}