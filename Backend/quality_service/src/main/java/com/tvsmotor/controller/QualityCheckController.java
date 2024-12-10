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
	public List<Production> getAllProductionData() {
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

	// Delete QC Data by ID
	@DeleteMapping("/{batchId}")
	public void deleteQCData(@PathVariable int batchId) {
		qcDataService.deleteBatch(batchId);
	}
}
