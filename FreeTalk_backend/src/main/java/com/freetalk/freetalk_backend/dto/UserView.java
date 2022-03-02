package com.freetalk.freetalk_backend.dto;

import com.freetalk.freetalk_backend.entity.User;
import com.freetalk.freetalk_backend.entity.UserInfo;
import lombok.Data;

@Data
public class UserView {
    private String username;
    private String description;
    private String image;
    private boolean followOrNot;
    private Integer userId;

    public UserView(UserInfo userInfo, User me){
        username=userInfo.getUsername();
        description=userInfo.getDescription();
        image=userInfo.getImage();
        userId=userInfo.getUserId();
        followOrNot=me.getTheUsersIFollowing().contains(userInfo);
    }

}
