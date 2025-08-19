package com.sharedGit.service.Impl;

import com.sharedGit.mapper.RepoMapper;
import com.sharedGit.pojo.File;
import com.sharedGit.pojo.Repo;
import com.sharedGit.service.RepoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepoServiceImpl implements RepoService {

    @Autowired
    RepoMapper repoMapper;

    @Override
    public List<Repo> getRepoList(Integer userid) {
        List<Repo> repoList;
        if(userid==-1) repoList=repoMapper.getAllRepo();
        else repoList=repoMapper.getRepoById(userid);
        return repoList;
    }

    @Override
    public void addRepo(Repo repo) {
        repoMapper.addRepo(repo);
    }

    @Override
    public void updateRepo(Repo repo) {
        repoMapper.updateRepo(repo);
    }

    @Override
    public void deleteRepo(Integer repoid) {
        repoMapper.deleteRepo(repoid);
    }

    @Override
    public Integer updateStars(Integer repoid, Integer op) {
        Repo repo=repoMapper.findByRepoid(repoid);
        Integer stars;
        if(op==0){
            stars=repo.getStars()-1;
            repoMapper.setStars(repoid,stars);
        }
        else{
            stars=repo.getStars()+1;
            repoMapper.setStars(repoid,stars);
        }
        return stars;
    }

    @Override
    public List<File> search(String keyword) {
        String pattern="%"+keyword+"%";
        return repoMapper.search(pattern);
    }
}
