package com.freetalk.freetalk_backend.serviceimpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.freetalk.freetalk_backend.dao.QrCodeDao;
import com.freetalk.freetalk_backend.entity.BanTime;
import com.freetalk.freetalk_backend.entity.QrCode;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.service.QrCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class QrCodeServiceImpl implements QrCodeService {

    @Autowired
    private QrCodeDao qrCodeDao;

    /**
     *
     * @FunctionName: computerRequestAQrCode
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第一步：电脑端准备扫码登陆，请求一个二维码
     */
    @Override
    public QrCode computerRequestAQrCode(){
        QrCode qrCode=new QrCode();
        qrCode.setUserId(0);
        qrCode.setState(0);
        return qrCodeDao.save(qrCode);
    }

    /**
     *
     * @FunctionName: mobileConfirmLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第二步：手机端扫描到二维码，确认登陆后写入数据库
     */
    @Override
    public void mobileConfirmLogin(Integer userId,Integer codeId){
        QrCode qrCode=qrCodeDao.findQrCodeByCodeId(codeId);
        qrCode.setUserId(userId);
        qrCode.setState(1);
        qrCodeDao.save(qrCode);
    }

    /**
     *
     * @FunctionName: checkLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第三步：电脑端轮询手机端是否确认登录
     */
    @Override
    public String checkLogin(Integer codeId){
        QrCode qrCode=qrCodeDao.findQrCodeByCodeId(codeId);
        ArrayList<String> arrayList = new ArrayList<String>();
        Integer userid=qrCode.getUserId();

        if(userid==0){
            arrayList.add("0");
            arrayList.add("");
            arrayList.add("");
        }
        else {
            String str= userid +"和酮不让我下班";
            arrayList.add(userid.toString());
            arrayList.add("");
            arrayList.add(Base64.getEncoder().encodeToString(str.getBytes(StandardCharsets.UTF_8)));
        }
        return JSON.toJSONString(arrayList, SerializerFeature.BrowserCompatible);
    }

    /**
     *
     * @FunctionName: computerLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第四步：电脑端登录成功，数据库删除二维码条目
     */
    @Override
    public void computerLogin(Integer userId){
        qrCodeDao.delete(qrCodeDao.findQrCodesByUserId(userId).get(0));
    }
}
