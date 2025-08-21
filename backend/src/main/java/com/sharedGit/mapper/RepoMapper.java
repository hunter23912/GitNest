package com.sharedGit.mapper;

import com.sharedGit.pojo.File;
import com.sharedGit.pojo.Repo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface RepoMapper {

    @Select("select * from repo where isprivate=false")
    List<Repo> getAllRepo();    //获取所有公开的仓库

    @Select("select * from repo where ownerid=#{userid}")
    List<Repo> getRepoById(Integer userid); //该用户的所有仓库

    @Insert("Insert into repo (reponame,description,isprivate,language,ownerid) values (#{reponame},#{description},#{isprivate},#{language},#{ownerid})")
    void addRepo(Repo repo);

    @Update("update repo set reponame=#{reponame},description=#{description},isprivate=#{isprivate},language=#{language}," +
            "ownerid=#{ownerid},update_time=now()")
    void updateRepo(Repo repo);

//    @Delete("delete from file where repoid=#{repoid};" +
//            "delete from version where repoid=#{repoid};" +
//            "delete from repo where repoid=#{repoid};")
    @Delete("delete from repo where repoid=#{repoid};")
    void deleteRepo(Integer repoid);

    @Select("select * from repo where repoid=#{repoid}")
    Repo findByRepoid(Integer repoid);

    @Update("update repo set stars=#{stars} where repoid=#{repoid}")
    void setStars(Integer repoid, Integer stars);

    @Select("select * from repo inner join user on ownerid=userid where (reponame like #{pattern} or description like #{pattern}) and isprivate=false")
    List<Repo> search(String pattern);
}
