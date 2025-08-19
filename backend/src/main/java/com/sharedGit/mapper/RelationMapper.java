package com.sharedGit.mapper;

import com.sharedGit.pojo.User;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface RelationMapper {

    @Select("select count(*) from interest where userid=#{userid}")
    Integer getFanNum(Integer userid);  //count用户为userid的个数

    @Select("select count(*) from interest where interestid=#{userid}")
    Integer getInterestNum(Integer userid); //count关注用户为userid的个数

    @Insert("Insert into interest (userid,interestid) values (#{userid},#{targetid})")
    void addRelation(Integer userid, Integer targetid); //添加一条用户为userid，关注用户为targetid

    @Delete("delete from interest where userid=#{userid} and interestid=#{targetid}")
    void deleteRelation(Integer userid, Integer targetid);  //删除一条用户为userid，关注用户为targetid

    @Select("select interest.interestid userid,user.username from user inner join interest on user.userid=interest.interestid where interest.userid=#{userid}")
    List<User> getInterestList(Integer userid); //内联user表，select用户为userid的interstid和其username

    @Select("select interest.userid userid,user.username from user inner join interest on user.userid=interest.userid where interest.targetid=#{userid}")
    List<User> getFanList(Integer userid);  //内联user表，select关注的用户为userid的userid和其username
}
