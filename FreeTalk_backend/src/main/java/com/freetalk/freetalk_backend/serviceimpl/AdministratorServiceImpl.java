package com.freetalk.freetalk_backend.serviceimpl;

import com.freetalk.freetalk_backend.dao.AdministratorDao;
import com.freetalk.freetalk_backend.entity.Administrator;
import com.freetalk.freetalk_backend.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AdministratorServiceImpl implements AdministratorService {
    @Autowired
    private AdministratorDao administratorDao;

    @Override
    public boolean checkAdministrator(Map<String,Object> map){
        Integer administratorId=(Integer)map.get("administratorId");
        String password=(String) map.get("password");

        Administrator administrator= administratorDao.findAdministratorByAdministratorId(administratorId);
        if(administrator==null)
            return false;
        return password.equals(administrator.getPassword());
    }

    @Override
    public String changePassword(Map<String,Object> map){
        Integer adUserId=(Integer)map.get("userId");
        String oldPassword=(String)map.get("oldPassword");
        String newPassword=(String)map.get("newPassword");
        Administrator administrator=administratorDao.findAdministratorByAdministratorId(adUserId);
        if(!administrator.getPassword().equals(oldPassword))
            return "wrong old password";

        administrator.setPassword(newPassword);
        administratorDao.save(administrator);
        return "done";
    }

    @Override
    public String getUsernameOfAdministrator(Integer userId){
        return administratorDao.findAdministratorByAdministratorId(userId).getUsername();
    }

}
