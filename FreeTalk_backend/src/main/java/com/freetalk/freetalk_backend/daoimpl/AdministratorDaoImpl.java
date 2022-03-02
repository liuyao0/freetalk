package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.AdministratorDao;
import com.freetalk.freetalk_backend.entity.Administrator;
import com.freetalk.freetalk_backend.repository.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AdministratorDaoImpl implements AdministratorDao {
    @Autowired
    private AdministratorRepository administratorRepository;

    @Override
    public Administrator findAdministratorByAdministratorId(Integer administratorId){
        return administratorRepository.findAdministratorByAdministratorId(administratorId);
    }

    @Override
    public void save(Administrator administrator){
        administratorRepository.save(administrator);
    }

}
