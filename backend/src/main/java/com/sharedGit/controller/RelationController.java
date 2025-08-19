package com.sharedGit.controller;


import com.sharedGit.pojo.Result;
import com.sharedGit.pojo.User;
import com.sharedGit.service.RelationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/relation")
public class RelationController {

    @Autowired
    RelationService relationService;

    @GetMapping("/fan")
    public Result getFanNum(Integer userid){
        Integer num=relationService.getFanNum(userid);
        return Result.success(num);
    }

    @GetMapping("/interest")
    public Result getInterestNum(Integer userid){
        Integer num=relationService.getInerestNum(userid);
        return Result.success(num);
    }

    @GetMapping("/update")
    public Result updateInterestNum(Integer userid,Integer op){
        Integer num=0;
        if(op==1){
            num=relationService.addRelation(userid);
        }
        else{
            num=relationService.deleteRelation(userid);
        }
        return Result.success(num);
    }

    @GetMapping("/ilist")
    public Result<List<User>> getInterestList(Integer userid){
        List<User> ilist=relationService.getInterestList(userid);
        return Result.success(ilist);
    }

    @GetMapping("/flist")
    public Result<List<User>> getFanList(Integer userid){
        List<User> flist=relationService.getFanList(userid);
        return Result.success(flist);
    }
}
