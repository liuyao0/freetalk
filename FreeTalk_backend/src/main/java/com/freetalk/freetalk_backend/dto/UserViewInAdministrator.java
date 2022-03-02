package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.UserInfo;
import lombok.Data;

@Data
public class UserViewInAdministrator {
    private String username;
    private String description;
    private String image;
    private Integer userId;
    private String email;
    private Integer ban;

    public UserViewInAdministrator(UserInfo userInfo,Integer ban){

        this.username=userInfo.getUsername();
        this.description=userInfo.getDescription();
        this.image=userInfo.getImage();
        this.userId=userInfo.getUserId();
        this.email=userInfo.getEmail();
        this.ban=ban;
    }
}
