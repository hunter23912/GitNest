package com.sharedGit.pojo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class File {
    private Integer id;
    private Integer fileid;
    private String filename;
    private Integer repoid;
    private Integer version;
    private String path;
    private Boolean isrubbish;
    private Double size;
    private String filetype;
    private String message;
    private Integer editor;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
