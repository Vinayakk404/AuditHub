package com.tvsmotor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tvsmotor.entity.Inventory;
import com.tvsmotor.entity.QualityCheck;
import com.tvsmotor.service.InventoryService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

	@Autowired
	private InventoryService inventoryService;

	@GetMapping("/inv")
	public List<Inventory> getAllInventories() {
		return inventoryService.getAllInventories();
	}

	@GetMapping("/{vehicleId}")
	public ResponseEntity<List<Inventory>> getInventoryByVehicleId(@PathVariable String vehicleId) {
		List<Inventory> inventory = inventoryService.getInventoryByVehicleId(vehicleId);
		return inventory != null ? ResponseEntity.ok(inventory) : ResponseEntity.notFound().build();
	}

	@GetMapping("/batch/{batchId}")
	public ResponseEntity<Inventory> getInventoryByBatchId(@PathVariable int batchId) {
		Optional<Inventory> inventory = inventoryService.findByBatchId(batchId);
		return inventory.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PutMapping("/inv/{batchId}")
	public ResponseEntity<Inventory> updateAnomaly(@PathVariable int batchId, @RequestBody Inventory payload) {

		Integer discaredStock = payload.getStock();
		// Validate input
		if (discaredStock == null || discaredStock < 0) {
			return ResponseEntity.badRequest().body(null); // Return 400 Bad Request if stock is not valid
		}

		int damagedStock = payload.getDamagedStock();
		Inventory updatedInventory;
		if (damagedStock != 0) {
			updatedInventory = inventoryService.updateAnomalyByBatchId(batchId, discaredStock, damagedStock,
					"damagedStock");

		} else {
			updatedInventory = inventoryService.updateAnomalyByBatchId(batchId, discaredStock,
					payload.getDefectiveStock(), "defectiveStock");

		}

		// Call the service to update the inventory based on batch ID, stock, and
		// anomaly category

		if (updatedInventory != null) {
			return ResponseEntity.ok(updatedInventory);
		} else {
			return ResponseEntity.notFound().build(); // Return 404 if the batch ID doesn't exist
		}
	}

	@PutMapping("/batch/{batchId}/decrement")
	public ResponseEntity<Void> decrementInventoryQuantity(@PathVariable int batchId, @RequestParam int stock) {
		boolean success = inventoryService.decrementQuantity(batchId, stock);
		if (success) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}
}
