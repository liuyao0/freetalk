package com.freetalk.freetalk_backend.controller;

import com.freetalk.freetalk_backend.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AdministratorController {
    @Autowired
    private AdministratorService administratorService;

    @CrossOrigin
    @RequestMapping("/administratorLogin")
    public boolean login(@RequestBody Map<String,Object> map){
        return administratorService.checkAdministrator(map);
    }

    @CrossOrigin
    @RequestMapping("/administratorChangePassword")
    public String changePassword(@RequestBody Map<String,Object> map){
        return administratorService.changePassword(map);
    }

    @CrossOrigin
    @RequestMapping("/getUsernameOfAdministrator")
    public String getUsernameOfAdministrator(@RequestParam(name = "userId") Integer userId){
        return administratorService.getUsernameOfAdministrator(userId);
    }
}
