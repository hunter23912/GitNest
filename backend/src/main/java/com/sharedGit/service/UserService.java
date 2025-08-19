package com.sharedGit.service;

import com.sharedGit.pojo.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public interface UserService {
    User findById(Integer userid);
    
    User findByEmail(@Email String email);

    User findByUsername(String username);

    User register(String username, String password, @Email String email);

    void updateInfo(User user);

    void updatePassword(@Pattern(regexp = "^\\S{2,16}$") String newpwd);
}
