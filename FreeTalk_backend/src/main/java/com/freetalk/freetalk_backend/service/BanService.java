package com.freetalk.freetalk_backend.service;

import com.freetalk.freetalk_backend.entity.BanTime;

import java.util.List;

public interface BanService {
    void ban(Integer userId);

    BanTime checkBan(Integer userId);

    List<BanTime> findByUserId(Integer userId);

    void unbanAUser(Integer userId);
}
