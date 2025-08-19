package com.sharedGit.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;

@Data
@Validated
public class User {
    private Integer userid;
    private String username;
    @JsonIgnore
    private String password;
    private String role;
    private String email;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;

}
