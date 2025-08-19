package com.sharedGit.service.Impl;

import com.sharedGit.mapper.RelationMapper;
import com.sharedGit.pojo.User;
import com.sharedGit.service.RelationService;
import com.sharedGit.utils.ThreadLocalUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RelationServiceImpl implements RelationService {

    @Autowired
    RelationMapper relationMapper;

    @Override
    public Integer getFanNum(Integer userid) {
        Integer num=relationMapper.getFanNum(userid);
        return num;
    }

    @Override
    public Integer getInerestNum(Integer userid) {
        Integer num=relationMapper.getInterestNum(userid);
        return num;
    }

    @Override
    public Integer addRelation(Integer targetid) {
        Map<String,Object> claims= ThreadLocalUtil.get();
        Integer userid=(Integer) claims.get("userid");
        relationMapper.addRelation(userid,targetid);
        Integer num=relationMapper.getInterestNum(userid);
        return num;
    }

    @Override
    public Integer deleteRelation(Integer targetid) {
        Map<String,Object> claims= ThreadLocalUtil.get();
        Integer userid=(Integer) claims.get("userid");
        relationMapper.deleteRelation(userid,targetid);
        Integer num=relationMapper.getInterestNum(userid);
        return num;
    }

    @Override
    public List<User> getInterestList(Integer userid) {
        List<User> interestList=relationMapper.getInterestList(userid);
        return interestList;
    }

    @Override
    public List<User> getFanList(Integer userid) {
        List<User> fanList=relationMapper.getFanList(userid);
        return fanList;
    }
}
