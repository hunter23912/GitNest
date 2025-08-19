package com.sharedGit.service;

import com.sharedGit.pojo.User;

import java.util.List;

public interface RelationService {
    Integer getFanNum(Integer userid);

    Integer getInerestNum(Integer userid);

    Integer addRelation(Integer userid);

    Integer deleteRelation(Integer userid);

    List<User> getInterestList(Integer userid);

    List<User> getFanList(Integer userid);
}
