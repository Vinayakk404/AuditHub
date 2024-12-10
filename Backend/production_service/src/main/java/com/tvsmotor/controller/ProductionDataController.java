package com.tvsmotor.controller;

import org.bson.types.ObjectId;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.tvsmotor.Entity.Plans;
import com.tvsmotor.Entity.Production;
import com.tvsmotor.Service.PlanDataService;
import com.tvsmotor.Service.ProductionDataService;
import com.tvsmotor.exception.InvalidDataException;
import com.tvsmotor.exception.ResourceNotFoundException;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/productionData")
public class ProductionDataController {

	@Autowired
	private ProductionDataService productionDataService;

	@Autowired
	private PlanDataService planService;

	// Get All Production Data
	@GetMapping
	public List<Production> getAllProductionData() {
		return productionDataService.getAllProductionData();
	}

	@PostMapping("/plans")
	public ResponseEntity<Plans> createPlan(@RequestBody Plans plan) {
		String lastPlanId = productionDataService.getLastPlanId();

		String nextPlanId = "" + ((lastPlanId != "") ? Integer.parseInt(lastPlanId) + 1 : 1);
		plan.setPlanId(nextPlanId);
		Plans savedPlan = planService.savePlan(plan);
		return ResponseEntity.ok(savedPlan);
	}

	@GetMapping("/{planId}")
	public ResponseEntity<Plans> getPlanByPlanId(@PathVariable String planId) {
		Optional<Plans> optionalPlan = planService.getPlanByPlanId(planId);
		return optionalPlan.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@GetMapping("/plans")
	public ResponseEntity<List<Plans>> getAllPlans() {
		List<Plans> plans = planService.getAllPlans();
		return ResponseEntity.ok(plans);
	}

	@GetMapping("/operator/{operatorId}")
	public List<Production> getProductionDataByOperatorId(@PathVariable String operatorId) {
		List<Production> productions = productionDataService.getProductionDataOperatorId(operatorId);

		if (productions.isEmpty()) {
			throw new ResourceNotFoundException("No production data found for operator ID: " + operatorId);
		}

		return productions;
	}

	@GetMapping("/plant/{plantId}")
	public List<Production> getProductionDataByPlantId(@PathVariable String plantId) {
		List<Production> productions = productionDataService.getProductionDataPlantId(plantId);

		if (productions.isEmpty()) {
			throw new ResourceNotFoundException("No production data found for operator ID: " + plantId);
		}

		return productions;
	}

	// Bulk Insert Production Data
	@PostMapping("/batch/bulkInsert")
	public List<Production> saveProductionData(@RequestBody List<Production> productions) {

		Integer lastBatchId = productionDataService.getLastBatchId();
		int nextBatchId = (lastBatchId != null) ? lastBatchId + 1 : 1050;
		String lastPlanId = productionDataService.getLastPlanId();

		String nextPlanId = "" + ((lastPlanId != "") ? Integer.parseInt(lastPlanId) + 1 : 1);

		for (Production production : productions) {

			production.setBatchId(nextBatchId);
			nextBatchId++;
			production.setPlanId(nextPlanId);

			productionDataService.saveProductionData(production);
		}
		return productions; // Return saved data
	}

	// Delete Production Data by Batch ID
	@DeleteMapping("/batch/{batchId}")
	public String deleteProductionData(@PathVariable int batchId) {
		Production productions = productionDataService.getProductionDataByBatchId(batchId);
		if (productions == null) {
			throw new ResourceNotFoundException("No production data found to delete for batch ID: " + batchId);
		}
		return productionDataService.deleteProductionData(batchId);
	}

	@PutMapping("/updateProductionData")
	public ResponseEntity<String> updateProductionData(@RequestBody List<Production> productionData) {
		// Ensure the batchId in the path matches the batchId in the body (if provided)
		for (Production production : productionData) {
			int batchId = production.getBatchId();
			// Validate batchId is positive
			if (batchId <= 0) {
				throw new InvalidDataException("Invalid Batch ID: " + batchId);
			}
			productionDataService.updateProductionData(batchId, production);
		}
		return ResponseEntity.ok("Production data updated successfully.");

	}

	@PutMapping("/{batchId}")
	public ResponseEntity<Production> updateBatch(@PathVariable int batchId, @RequestBody Production updateRequest) {

		Production updatedBatch = productionDataService.updateBatch(batchId, updateRequest);
		if (updatedBatch != null) {
			return ResponseEntity.ok(updatedBatch);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

}
