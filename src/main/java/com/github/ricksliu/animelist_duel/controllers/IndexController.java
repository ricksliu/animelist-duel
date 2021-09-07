package com.github.ricksliu.animelist_duel.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import static com.github.ricksliu.animelist_duel.models.Constants.*;

@Controller
public class IndexController {
    @GetMapping("/")
    public String index(Model model) {
        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        model.addAttribute("baseUrl", baseUrl);
        model.addAttribute("initialUsers", initialUsers);
        model.addAttribute("maxScoreComparisons", maxScoreComparisons);
        model.addAttribute("maxUsers", maxUsers);
        return "index";
    }
}