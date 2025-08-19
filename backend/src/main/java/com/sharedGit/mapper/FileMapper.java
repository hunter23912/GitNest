package com.sharedGit.mapper;

import com.sharedGit.pojo.File;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface FileMapper {

    @Select("select * from file inner join version on file.fileid=version.fileid and file.version=version.version where fileid=#{fileid}")
    File findByFileid(Integer fileid);  //根据file表获取该fileid获取信息

    @Select("select * from file inner join version on file.fileid=version.fileid and file.version=version.version where userid=#{userid}")
    List<File> getFileListByUserid(Integer userid);

    @Select("select * from file inner join version on file.fileid=version.fileid and file.version=version.version where repoid=#{repoid}")
    List<File> getFileListByRepoid(Integer repoid);

    @Insert("insert into version (fileid,repoid,path,ediotr,version,filename,message) values (#{fileid},#{repoid},#{path},#{editor},#{verion},{filename},#{message})")
    void addVersion(Integer fileid,Integer repoid, String path, Integer editor, Integer version, String filename, String message);

    @Insert("insert into file (repoid) values (#{repoid})")
    @Options(useGeneratedKeys = true, keyProperty = "fileid")
    Integer addFile(Integer repoid);

    @Update("update verion set isrubbish= true where fileid=#{fileid}")
    void goRubbishFile(Integer fileid);

    @Delete("delete from file where version=-1")
    void deleteFile();

    @Update("update file set version=#{version} where fileid=#{fileid}")
    void updateFile(Integer fileid,Integer version);

    @Select("select * from version where fileid=#{fileid}")
    List<File> getFileListByFileid(Integer fileid); //获取该fileid的所有版本

    @Update("update file set isrubbish= true where fileid=#{fileid} and version>#{version}")
    void gobackVersion(Integer fileid, Integer version);

    @Delete("delete from version where isrubbish=true")
    void deleteVersion();

    @Select("select * from version where isrubbish=true;")
    List<File> getRubbishList();

    @Update("update version set isrubbish=false where fileid=#{fileid};")
    void restoreVersionAll(Integer fileid);

    @Update("update version set isrubbish=false where fileid=#{fileid}")
    void restoreVersion(Integer fileid, Integer version);

    @Select("select max(version) from version where fileid=#{fileid} and isrubbish=false")
    Integer findLatestVersion(Integer fileid);  //返回该fileid回收站外的最新version
}
