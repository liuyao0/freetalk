package com.freetalk.freetalk_backend.serviceimpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.freetalk.freetalk_backend.dao.BanTimeDao;
import com.freetalk.freetalk_backend.dao.UserDao;
import com.freetalk.freetalk_backend.dao.UserInfoDao;
import com.freetalk.freetalk_backend.dto.UserViewInAdministrator;
import com.freetalk.freetalk_backend.entity.BanTime;
import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserInfo;
import com.freetalk.freetalk_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;


@Service
public class UserServiceImpl implements UserService {
    @Autowired
    UserDao userDao;
    @Autowired
    BanTimeDao banTimeDao;
    @Autowired
    private UserInfoDao userInfoDao;


    @Override
    public User findUserByUserId(Integer UserId) {
        return userDao.findUserByUserId(UserId);
    }



    @Override
    public Integer register(Map<String,Object> map) {
        String username=(String)map.get("username");
        String password=(String)map.get("password");
        String email=(String)map.get("email");
        User user=new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        if(map.containsKey("avatar"))
        {
            String avatar=(String) map.get("avatar");
            user.setImage(avatar);
        }
        userDao.saveAUser(user);
        return user.getUserId();
    }

    @Override
    public String login(Map<String,Object> map) {
        ArrayList<String> arrayList = new ArrayList<String>();
        String userid=map.get("userid").toString();
        if(!userid.matches("^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$"))return "";
        String password=map.get("password").toString();
        User user= userDao.findUserByUserId(Integer.parseInt(userid));
        Boolean flag=false;
        String str=userid+"和酮不让我下班";
        if(user!=null) {
            if (password.equals(user.getPassword())) {
                Timestamp currentTime = new Timestamp(System.currentTimeMillis());
                List<BanTime> banTimes = banTimeDao.findBanTimesByUserId(Integer.parseInt(userid));
                arrayList.add(userid);
                for (BanTime banTime : banTimes) {
                    if (banTime.getBeginTime().getTime() <= currentTime.getTime() && banTime.getEndTime().getTime() >= currentTime.getTime()) {
                        arrayList.add(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(banTime.getEndTime()));
                        flag=!flag;
                        break;
                    }
                }
                if(!flag)arrayList.add("");
                arrayList.add(Base64.getEncoder().encodeToString(str.getBytes(StandardCharsets.UTF_8)));

            } else {
                arrayList.add("");
                arrayList.add("");
                arrayList.add("");
            }
        }
        else{
            arrayList.add("");
            arrayList.add("");
            arrayList.add("");
        }
        return JSON.toJSONString(arrayList, SerializerFeature.BrowserCompatible);
    }

    @Override
    public void updateImage(Map<String,Object> map){
        Integer userId=(Integer) map.get("userId");
        String imageBase64=(String) map.get("imageBase64");
        User user=userDao.findUserByUserId(userId);
        user.setImage(imageBase64);
        userDao.saveAUser(user);
    }

    @Override
    public void updateUserInfo(Map<String,Object> map){
        Integer userId=(Integer)map.get("userId");
        String email=(String) map.get("email");
        String description=(String) map.get("description");
        String image=(String) map.get("image");
        String username=(String) map.get("username") ;

        UserInfo userInfo=userInfoDao.findUserInfoByUserId(userId);
        userInfo.setUsername(username);
        userInfo.setEmail(email);
        userInfo.setDescription(description);
        userInfo.setImage(image);
        userInfoDao.save(userInfo);
    }

    @Override
    public UserInfo getUserInfo(Integer userId){
        return userInfoDao.findUserInfoByUserId(userId);
    }


    @Override
    public List<UserViewInAdministrator> findAll(){
        List<UserInfo> userInfos=userInfoDao.findAll();
        List<UserViewInAdministrator> userViewInAdministrators=new ArrayList<>();
        for (UserInfo userInfo:userInfos){
            Integer flag=0;
            Timestamp currentTime=new Timestamp(System.currentTimeMillis());
            List<BanTime> banTimes = banTimeDao.findBanTimesByUserId(userInfo.getUserId());
            for(BanTime banTime : banTimes){
                if (banTime.getBeginTime().getTime() <= currentTime.getTime() && banTime.getEndTime().getTime() >= currentTime.getTime()) {
                    flag = 1;
                    break;
                }
            }
            userViewInAdministrators.add(new UserViewInAdministrator(userInfo,flag));
        }
        return userViewInAdministrators;
    }

    @Override
    public List<UserInfo> findUserInfosByUsernameContains(String username){
        return userInfoDao.findUserInfosByUsernameContains(username);

    }

    @Override
    public String EditPassword(Map<String, Object> map) {
        Integer userId=(Integer) map.get("userId");
        String oldPassword=(String) map.get("oldPassword");
        String newPassword=(String) map.get("newPassword");
        UserInfo userInfo=userInfoDao.findUserInfoByUserId(userId);
        if(userInfo.getPassword().equals(oldPassword)) {
            userInfo.setPassword(newPassword);
            userInfoDao.save(userInfo);
            return newPassword;
        }
        else
            return "";
    }

}
