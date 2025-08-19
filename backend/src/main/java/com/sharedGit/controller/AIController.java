package com.sharedGit.controller;


import com.sharedGit.pojo.Result;
import com.sharedGit.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    AIService aiService;

    @PostMapping()
    public Result<String> getResponse(@RequestBody String userMessage){
        String response=aiService.getResponse(userMessage);
        return Result.success(response);
    }

}
