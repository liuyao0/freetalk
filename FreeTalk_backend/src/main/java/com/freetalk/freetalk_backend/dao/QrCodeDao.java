package com.freetalk.freetalk_backend.dao;

import com.freetalk.freetalk_backend.entity.QrCode;

import java.util.List;

public interface QrCodeDao {
    List<QrCode> findQrCodesByUserId(Integer userId);

    QrCode save(QrCode qrCode);

    void delete(QrCode qrCode);

    List<QrCode> findQrCodesByUserIdAndState(Integer userId, Integer state);

    QrCode findQrCodeByCodeId(Integer codeId);



}
