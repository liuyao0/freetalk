package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.entity.QrCode;
import com.freetalk.freetalk_backend.service.QrCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class QrCodeController {
    @Autowired
    private QrCodeService qrCodeService;

    /**
     *
     * @FunctionName: computerRequestAQrCode
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第一步：电脑端准备扫码登陆，请求一个二维码
     */
    @CrossOrigin
    @RequestMapping(value = "/computerRequestAQrCode")
    public QrCode computerRequestAQrCode(){
        return qrCodeService.computerRequestAQrCode();
    }

    /**
     *
     * @FunctionName: mobileConfirmLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第二步：手机端扫描到二维码，确认登陆后写入数据库
     */
    @CrossOrigin
    @RequestMapping(value = "/mobileConfirmLogin")
    public void mobileConfirmLogin(@RequestParam(name = "userId") Integer userId,@RequestParam(name = "codeId") Integer codeId){
        qrCodeService.mobileConfirmLogin(userId,codeId);
    }

    /**
     *
     * @FunctionName: checkLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第三步：电脑端轮询手机端是否确认登录
     */
    @CrossOrigin
    @RequestMapping(value = "/checkLogin")
    public String checkLogin(@RequestParam(name = "codeId") Integer codeId){
        return qrCodeService.checkLogin(codeId);
    }

    /**
     *
     * @FunctionName: computerLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第四步：电脑端登录成功，数据库删除二维码条目
     */
    @CrossOrigin
    @RequestMapping(value = "/computerLogin")
    public void computerLogin(@RequestParam(name = "userId") Integer userId){
        qrCodeService.computerLogin(userId);
    }
}
