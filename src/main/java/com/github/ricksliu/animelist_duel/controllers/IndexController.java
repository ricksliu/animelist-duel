package com.github.ricksliu.animelist_duel.controllers;

import com.github.ricksliu.animelist_duel.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Controller
public class IndexController {
    @GetMapping("/")
    public String index(Model model) {
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        model.addAttribute("baseUrl", baseUrl);
        return "index";
    }
}