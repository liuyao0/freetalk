package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;


public interface AdministratorRepository extends JpaRepository<Administrator,Integer> {
    Administrator findAdministratorByAdministratorId(Integer administratorId);
}
