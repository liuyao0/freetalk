package com.freetalk.freetalk_backend.service;

import com.freetalk.freetalk_backend.entity.QrCode;


public interface QrCodeService {
    /**
     *
     * @FunctionName: computerRequestAQrCode
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第一步：电脑端准备扫码登陆，请求一个二维码
     */
    QrCode computerRequestAQrCode();

    /**
     *
     * @FunctionName: mobileConfirmLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第二步：手机端扫描到二维码，确认登陆后写入数据库
     */
    void mobileConfirmLogin(Integer userId,Integer codeId);

    /**
     *
     * @FunctionName: checkLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第三步：电脑端轮询手机端是否确认登录
     */
    String checkLogin(Integer codeId);

    /**
     *
     * @FunctionName: computerLogin
     * @author: He Jingkai
     * @date: 2021.8.13
     * @Description: 第四步：电脑端登录成功，数据库删除二维码条目
     */
    void computerLogin(Integer userId);


}
