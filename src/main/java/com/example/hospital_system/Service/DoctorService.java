
package com.example.hospital_system.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hospital_system.repository.DoctorRepository; // ✅ correct
import com.example.hospital_system.model.Doctor;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository repo;

    public List<Doctor> getAllDoctors() {
        return repo.findAll();
    }
}