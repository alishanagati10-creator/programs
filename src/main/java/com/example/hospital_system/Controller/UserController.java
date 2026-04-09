package com.example.hospital_system.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.hospital_system.Service.UserService;
import com.example.hospital_system.model.User;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService service;

    // Get All Users
    @GetMapping("/all")
    public List<User> getAll() {
        return service.getAllUsers();
    }
}
