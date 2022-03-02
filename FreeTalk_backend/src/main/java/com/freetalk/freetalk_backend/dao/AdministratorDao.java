package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.Administrator;

public interface AdministratorDao {
    Administrator findAdministratorByAdministratorId(Integer administratorId);

    void save(Administrator administrator);
}
