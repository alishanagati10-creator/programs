
package com.example.hospital_system.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.hospital_system.Service.DoctorService;
import com.example.hospital_system.model.Doctor;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorService service;

    // Get All Doctors
    @GetMapping("/all")
    public List<Doctor> getAll() {
        return service.getAllDoctors();
    }
}