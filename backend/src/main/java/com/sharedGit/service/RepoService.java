package com.sharedGit.service;

import com.sharedGit.pojo.File;
import com.sharedGit.pojo.Repo;



import java.util.List;

public interface RepoService {
    List<Repo> getRepoList(Integer userid);

    void addRepo(Repo repo);

    void updateRepo(Repo repo);

    void deleteRepo(Integer repoid);

    Integer updateStars(Integer repoid, Integer op);

    List<Repo> search(String keyword);
}
