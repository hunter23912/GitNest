package com.sharedGit.mapper;

import com.sharedGit.pojo.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface UserMapper {

    @Select("select * from user where userid=#{userid} ")
    User findById(Integer userid);

    @Select("select * from user where email=#{email}")
    User findByEmail(String email);

    @Select("select * from user where username=#{username}")
    User findByUsername(String username);

    @Insert("insert into user (username,password,email) values (#{username},#{password},#{email})")
    void register(String username, String password, String email);

    @Update("update user set username=#{username},email=#{email},age=#{age},sex=#{sex},telephone=#{telephone},nation=#{nation} where userid={userid}")
    void updateInfo(User user);

    @Update("update user set password=#{newpassword} where userid=#{userid}")
    void updatePassword(Integer userid,String newpassword);
}