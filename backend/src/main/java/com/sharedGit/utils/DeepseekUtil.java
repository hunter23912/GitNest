package com.sharedGit.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class DeepseekUtil {

    private static final String baseUrl="https://api.deepseek.com/chat/completions";
    private static final String API_KEY="";
    private static final ObjectMapper mapper=new ObjectMapper();


    private static String buildRequestBody(String userMessage) {
        userMessage.replace("\"", "\\\"");
        try {
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", "你是一个简洁的代码助手，请直接给出代码，不需要任何解释。使用中文回答，但代码部分保持原样。"));
            messages.add(Map.of("role", "user", "content", "给我写一段C++的冒泡排序代码"));

            Map<String, Object> request = new HashMap<>();
            request.put("model", "deepseek-chat");
            request.put("messages", messages);
            request.put("temperature",0.3);
            request.put("max_tokens",2000);
            String JSONbody=mapper.writeValueAsString(request);
            System.out.println("build: "+JSONbody);
            return JSONbody;

        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }

//        return java.lang.String.format("""
//        {
//            "model": "deepseek-chat",
//            "messages": [
//                {"role": "system", "content": "你是一个简洁的代码助手，请直接给出代码，不需要任何解释。使用中文回答，但代码部分保持原样。"},
//                {"role": "user", "content": "%s"}
//            ],
//            "temperature": 0.3,
//            "max_tokens": 2000
//        }
//        """, userMessage.replace("\"", "\\\""));
//    }

    private static String parseResponse(String jsonResponse) throws Exception{
        return mapper.readTree(jsonResponse).path("choices").get(0).path("message").path("content").asText();
    }

    public static String getResponse(String userMessage) throws Exception {
       try(CloseableHttpClient httpClient= HttpClients.createDefault()) {
            HttpPost httpPost=new HttpPost(baseUrl);
            httpPost.setHeader("Authorization", "Bearer " + API_KEY);
            httpPost.setHeader("Content-Type", "application/json");
            String jsonBody=buildRequestBody(userMessage);
            System.out.println("请求："+jsonBody);
            httpPost.setEntity(new StringEntity(jsonBody));

            try(CloseableHttpResponse response=httpClient.execute(httpPost)){
                HttpEntity entity=response.getEntity();
                String responseBody= EntityUtils.toString(entity);
                System.out.println("响应："+responseBody);
                return parseResponse(responseBody);
            }

        }
    }

}
