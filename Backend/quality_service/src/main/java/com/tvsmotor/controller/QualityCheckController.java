package com.tvsmotor.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tvsmotor.entity.Inventory;
import com.tvsmotor.entity.Production;
import com.tvsmotor.entity.QualityCheck;
import com.tvsmotor.service.QcService;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/qc")
public class QualityCheckController {

    @Autowired
    private QcService qcDataService;

    // Get all QC Data
    @GetMapping
    public List<QualityCheck> getAllQCData() {
        return qcDataService.getAllBatches();
    }
    
    @GetMapping("/productionData")
    public List<Production> getAllProductionData()
    {
    	return qcDataService.getProductionData();
    }

    // Get QC Data by ID
    @GetMapping("/{batchId}")
    public QualityCheck getQCDataById(@PathVariable int batchId) {
        return qcDataService.getBatchById(batchId);
    }

    // Add new QC Data
    @PostMapping
    public QualityCheck addQCData(@RequestBody QualityCheck qcData) {
    	return qcDataService.saveData(qcData);
       
    }

 // PUT mapping for updating QC data
//    @PutMapping("/{batchId}")
//    public ResponseEntity<QualityCheck> updateQcData(@PathVariable int batchId, @RequestBody QualityCheck updatedQcData) {
//        Optional<QualityCheck> existingQcData = qcDataService.findById(batchId);
//        if (existingQcData.isPresent()) {
//            QualityCheck qcData = existingQcData.get();
//            
//            // Update fields with new values from the request body
//            qcData.setVehicleModel(updatedQcData.getVehicleModel());
//            qcData.setPlannedProductionUnits(updatedQcData.getPlannedProductionUnits());
//            qcData.setProducedUnits(updatedQcData.getProducedUnits());
//            qcData.setQc_passed_units(updatedQcData.getQc_passed_units());
//            qcData.setQc_failed_units(updatedQcData.getQc_failed_units());
//            qcData.setQc_failure_rate(updatedQcData.getQc_failure_rate());
//            qcData.setShift(updatedQcData.getShift());
//            qcData.setAnomaly(updatedQcData.getAnomaly());
//            qcData.setAnomalyFlag(updatedQcData.getAnomalyFlag());
//            
//            // Save the updated data
//            qcDataService.save(qcData);
//            return ResponseEntity.ok(qcData);
//        } else {
//            return ResponseEntity.notFound().build();  // Handle case where data isn't found
//        }
//    }

    // Delete QC Data by ID
    @DeleteMapping("/{batchId}")
    public void deleteQCData(@PathVariable int batchId) {
        qcDataService.deleteBatch(batchId);
    }
}




