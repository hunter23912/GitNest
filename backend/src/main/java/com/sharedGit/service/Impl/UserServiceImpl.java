package com.sharedGit.service.Impl;

import com.sharedGit.mapper.UserMapper;
import com.sharedGit.pojo.User;
import com.sharedGit.service.UserService;
import com.sharedGit.utils.Md5Util;
import com.sharedGit.utils.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserMapper userMapper;

    @Override
    public User findById(Integer userid) {
        User user=userMapper.findById(userid);
        return user;
    }

    @Override
    public User findByEmail(String email) {
        User user=userMapper.findByEmail(email);
        return user;
    }

    @Override
    public User findByUsername(String username) {
        User user=userMapper.findByUsername(username);
        return user;
    }

    @Override
    public User register(String username, String password, String email) {
        String md5_pwd=Md5Util.getMD5String(password);
        userMapper.register(username,md5_pwd,email);
        User user=findByUsername(username);
        return user;
    }

    @Override
    public void updateInfo(User user) {
        userMapper.updateInfo(user);
    }

    @Override
    public void updatePassword(String newpassword) {
        Map<String,Object> claims= ThreadLocalUtil.get();
        Integer userid=(Integer)claims.get("userid");
        userMapper.updatePassword(userid,newpassword);
    }
}
