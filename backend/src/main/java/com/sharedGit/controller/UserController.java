package com.sharedGit.controller;


import com.sharedGit.pojo.Result;
import com.sharedGit.pojo.User;
import com.sharedGit.service.UserService;
import com.sharedGit.utils.JwtUtil;
import com.sharedGit.utils.Md5Util;
import com.sharedGit.utils.ThreadLocalUtil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/user")
@Validated
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public Result register(@Pattern(regexp = "^\\S{2,16}$") String username, @Pattern(regexp = "^\\S{2,16}$") String password, @Email String email) {
        User userServiceByEmail = userService.findByEmail(email);
        if (userServiceByEmail != null) return Result.error("该邮箱已经被占用");
        User userServiceByUsername = userService.findByUsername(username);
        if (userServiceByUsername != null) return Result.error("该用户名已经被占用");
        User registeruser = userService.register(username, password, email);
        Map<String, Object> claims = new HashMap<>();
        claims.put("userid", registeruser.getUserid());
        claims.put("username", registeruser.getUsername());
        String token = JwtUtil.genToken(claims);
        return Result.success(token);
    }

    @PostMapping("/login")
    public Result login(String username, String password) {
        User loginuser = userService.findByUsername(username);
        if (loginuser == null) loginuser = userService.findByEmail(username);
        if (loginuser == null) return Result.error("该用户名不存在");
        if (Md5Util.checkPassword(password, loginuser.getPassword())) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("userid", loginuser.getUserid());
            claims.put("username", loginuser.getUsername());
            String token = JwtUtil.genToken(claims);
            return Result.success(token);
        } else {
            return Result.error("密码错误！");
        }
    }

    @PutMapping()
    public Result updateInfo(@RequestBody User user) {
        userService.updateInfo(user);
        return Result.success();
    }

    @PatchMapping()
    public Result updatePassword(@Pattern(regexp = "^\\S{2,16}$") String oldpwd, @Pattern(regexp = "^\\S{2,16}$") String newpwd, @Pattern(regexp = "^\\S{2,16}$") String renewpwd) {
        if (!newpwd.equals(renewpwd)) return Result.error("两次输入的新密码不同");
        Map<String, Object> claims = ThreadLocalUtil.get();
        Integer userid = (Integer) claims.get("userid");
        User user = userService.findById(userid);
        if (!Md5Util.checkPassword(oldpwd, user.getPassword())) return Result.error("旧密码输入错误！");
        userService.updatePassword(newpwd);
        return Result.success();
    }

}
