package com.sharedGit.pojo;

import lombok.Data;

@Data
public class FIleDTO {
    public Integer repoid;
    public String path;
    public Integer editor;
    public String filename;
    public String message;
}
