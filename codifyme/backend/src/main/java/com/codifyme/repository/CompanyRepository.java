package com.codifyme.repository;

import com.codifyme.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    List<Company> findByNameContainingIgnoreCase(String name);

    List<Company> findByDifficultyLevel(Company.DifficultyLevel difficultyLevel);
}
