package com.freetalk.freetalk_backend.repository;

import com.freetalk.freetalk_backend.entity.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QrCodeRepository extends JpaRepository<QrCode,Integer> {
    List<QrCode> findQrCodesByUserId(Integer userId);

    List<QrCode> findQrCodesByUserIdAndState(Integer userId, Integer state);

    QrCode findQrCodeByCodeId(Integer codeId);

}
