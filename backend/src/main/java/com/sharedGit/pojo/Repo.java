package com.sharedGit.pojo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Repo {
    private Integer repoid;
    private String reponame;
    private String description;
    private Boolean isprivate;
    private String language;
    private Integer stars;
    private Integer ownerid;
    private String username;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
