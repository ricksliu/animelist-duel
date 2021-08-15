package com.github.ricksliu.animelist_duel.controllers;

import com.github.ricksliu.animelist_duel.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
public class IndexApiController {
    @GetMapping("/getuser")
    public User profile(@RequestParam(name="username", required=true) String username) {
        User user = new User();
        user.setUsername(username);
        user.setData(111);
        return user;
    }
}