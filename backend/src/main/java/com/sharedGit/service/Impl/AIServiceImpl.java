package com.sharedGit.service.Impl;

import com.sharedGit.service.AIService;
import com.sharedGit.utils.DeepseekUtil;
import org.springframework.stereotype.Service;

@Service
public class AIServiceImpl implements AIService {

    @Override
    public String getResponse(String userMessage) {
        try{
            return DeepseekUtil.getResponse(userMessage);
        }catch (Exception e){
            return "请求失败："+e.getMessage();
        }

    }
}
