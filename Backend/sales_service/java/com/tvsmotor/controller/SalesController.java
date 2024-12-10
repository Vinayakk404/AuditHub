package com.tvsmotor.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tvsmotor.entity.SalesEntity;
import com.tvsmotor.service.SalesService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sales")
public class SalesController {

    @Autowired
    private SalesService salesService;

    // GET: Fetch all sales data
    @GetMapping
    public ResponseEntity<List<SalesEntity>> getAllSales() {
        List<SalesEntity> sales = salesService.getAllSales();
        return ResponseEntity.ok(sales);
    }

    // GET: Fetch a single sale by ID
    @GetMapping("/{id}")
    public ResponseEntity<SalesEntity> getSaleById(@PathVariable String id) {
        Optional<SalesEntity> sale = salesService.getSaleById(id);
        return sale.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // DELETE: Delete a sale by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSaleById(@PathVariable String id) {
        boolean deleted = salesService.deleteSaleById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // PUT: Update a sale
    @PutMapping("/{id}")
    public ResponseEntity<SalesEntity> updateSale(@PathVariable String id, @RequestBody SalesEntity salesEntity) {
        Optional<SalesEntity> updatedSale = salesService.updateSale(id, salesEntity);
        return updatedSale.map(ResponseEntity::ok)
                          .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }
}

