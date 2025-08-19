package com.sharedGit.controller;


import com.sharedGit.pojo.File;
import com.sharedGit.pojo.Repo;
import com.sharedGit.pojo.Result;
import com.sharedGit.pojo.User;
import com.sharedGit.service.RepoService;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/repo")
@Validated
public class RepoController {

    @Autowired
    RepoService repoService;

    @GetMapping()
    public Result<List<Repo>> getRepoList(Integer userid){
        List<Repo> repoList=repoService.getRepoList(userid);
        return Result.success(repoList);
    }

    @PostMapping()
    public Result addRepo(@RequestBody Repo repo){
        repoService.addRepo(repo);
        return Result.success();
    }

    @PutMapping
    public Result updateRepo(@RequestBody Repo repo){
        repoService.updateRepo(repo);
        return Result.success();
    }

    @DeleteMapping()
    public Result deleteRepo(Integer repoid){
        repoService.deleteRepo(repoid);
        return Result.success();
    }

    @GetMapping("/star")
    public Result updateStars(Integer repoid,Integer op){
        Integer stars=repoService.updateStars(repoid,op);
        return Result.success(stars);
    }

    @GetMapping("/search")
    public Result<List<File>> search(String keyword){
        List<File> fileList=repoService.search(keyword);
        return Result.success(fileList);
    }


}
