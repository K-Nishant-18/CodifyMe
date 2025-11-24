package com.codifyme.controller;

import com.codifyme.model.Company;
import com.codifyme.payload.response.CompanyResponse;
import com.codifyme.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        List<CompanyResponse> response = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompanyById(@PathVariable Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return ResponseEntity.ok(convertToResponse(company));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CompanyResponse>> searchCompanies(@RequestParam String name) {
        List<Company> companies = companyRepository.findByNameContainingIgnoreCase(name);
        List<CompanyResponse> response = companies.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    private CompanyResponse convertToResponse(Company company) {
        return new CompanyResponse(
                company.getId(),
                company.getName(),
                company.getLogoUrl(),
                company.getDescription(),
                company.getDifficultyLevel().name());
    }
}
