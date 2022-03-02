package com.freetalk.freetalk_backend.service;

import java.util.Map;

public interface AdministratorService {
    boolean checkAdministrator(Map<String,Object> map);

    String changePassword(Map<String,Object> map);

    String getUsernameOfAdministrator(Integer userId);
}
