package com.example.studentmanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaWebController {

    /**
     * Forwards non-API client routes to index.html so React SPA handles them.
     */
    @GetMapping(value = {"/{path:[^\\.]*}"})
    public String forwardNonApiRoutes() {
        return "forward:/index.html";
    }
}
