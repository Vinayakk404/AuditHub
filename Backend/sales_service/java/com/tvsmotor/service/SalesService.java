package com.tvsmotor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvsmotor.entity.SalesEntity;
import com.tvsmotor.repository.SalesRepository;

import java.util.List;
import java.util.Optional;

@Service
public class SalesService {

    @Autowired
    private SalesRepository salesRepository;

    // Get all sales
    public List<SalesEntity> getAllSales() {
        return salesRepository.findAll();
    }

    // Get a sale by ID
    public Optional<SalesEntity> getSaleById(String id) {
        return salesRepository.findById(id);
    }

    // Delete a sale by ID
    public boolean deleteSaleById(String id) {
        Optional<SalesEntity> sale = salesRepository.findById(id);
        if (sale.isPresent()) {
            salesRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Update a sale
    public Optional<SalesEntity> updateSale(String id, SalesEntity salesEntity) {
        Optional<SalesEntity> existingSale = salesRepository.findById(id);
        if (existingSale.isPresent()) {
            salesEntity.setId(id);  // Ensure the ID remains the same
            SalesEntity updatedSale = salesRepository.save(salesEntity);
            return Optional.of(updatedSale);
        } else {
            return Optional.empty();
        }
    }
}

