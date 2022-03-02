package com.freetalk.freetalk_backend.daoimpl;

import com.freetalk.freetalk_backend.dao.QrCodeDao;
import com.freetalk.freetalk_backend.entity.QrCode;
import com.freetalk.freetalk_backend.repository.QrCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class QrCodeDaoImpl implements QrCodeDao {
    @Autowired
    private QrCodeRepository qrCodeRepository;

    @Override
    public List<QrCode> findQrCodesByUserId(Integer userId){
        return qrCodeRepository.findQrCodesByUserId(userId);
    }

    @Override
    public QrCode save(QrCode qrCode){
        return qrCodeRepository.save(qrCode);
    }

    @Override
    public void delete(QrCode qrCode){
        qrCodeRepository.delete(qrCode);
    }

    @Override
    public List<QrCode> findQrCodesByUserIdAndState(Integer userId, Integer state){
        return qrCodeRepository.findQrCodesByUserIdAndState(userId, state);
    }

    @Override
    public QrCode findQrCodeByCodeId(Integer codeId){
        return qrCodeRepository.findQrCodeByCodeId(codeId);
    }


}
