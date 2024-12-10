package com.tvsmotor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tvsmotor.entity.Inventory;
import com.tvsmotor.entity.SalesEntity;
import com.tvsmotor.service.SalesService;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/sales")
public class SalesController {

	@Autowired
	private SalesService salesService;

	@GetMapping("/inventory/model/{vehicleModel}")
	public ResponseEntity<Inventory> getInventoryByModel(@PathVariable String vehicleModel) {

		Inventory inventoryResponse = salesService.getInventory(vehicleModel);

		if (inventoryResponse != null) {
			return ResponseEntity.ok(inventoryResponse);
		} else {
			return ResponseEntity.notFound().build(); // Return 404 if not found
		}
	}

	@GetMapping("/inventory/vehicle/{vehicleId}")
	public ResponseEntity<List<Inventory>> getInventoryByVehicleid(@PathVariable String vehicleId) {

		List<Inventory> inventoryResponse = salesService.getInventoryByVehicleId(vehicleId);

		if (inventoryResponse != null) {
			return ResponseEntity.ok(inventoryResponse);
		} else {
			return ResponseEntity.notFound().build(); // Return 404 if not found
		}
	}

	// GET: Fetch all sales data
	@GetMapping
	public ResponseEntity<List<SalesEntity>> getAllSales() {
		List<SalesEntity> sales = salesService.getAllSales();
		return ResponseEntity.ok(sales);
	}

	@GetMapping("/inventory")
	public List<Inventory> getInventoryData() {
		return salesService.getInventoryAllData();
	}

	// GET: Fetch a single sale by ID
	@GetMapping("/{id}")
	public ResponseEntity<SalesEntity> getSaleById(@PathVariable String id) {
		Optional<SalesEntity> sale = salesService.getSaleById(id);
		return sale.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
	}

	// GET: Fetch sales by vehicle ID
	@GetMapping("/vehicle/{vehicleId}")
	public ResponseEntity<List<SalesEntity>> getSalesByVehicleId(@PathVariable String vehicleId) {
		List<SalesEntity> sales = salesService.getSalesByVehicleId(vehicleId);
		return ResponseEntity.ok(sales);
	}

	// GET: Fetch sales by sale date
	@GetMapping("/date/{saleDate}")
	public ResponseEntity<List<SalesEntity>> getSalesBySaleDate(@PathVariable LocalDate saleDate) {
		List<SalesEntity> sales = salesService.getSalesBySaleDate(saleDate);
		return ResponseEntity.ok(sales);
	}

	// GET: Fetch sales by model
	@GetMapping("/model/{vehicleModel}")
	public ResponseEntity<List<SalesEntity>> getSalesByModel(@PathVariable String vehicleModel) {
		List<SalesEntity> sales = salesService.getSalesByModel(vehicleModel);
		return ResponseEntity.ok(sales);
	}

	@PostMapping
	public ResponseEntity<SalesEntity> createSale(@RequestBody SalesEntity salesEntity) {
		SalesEntity createdSale = salesService.addSale(salesEntity);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdSale);
	}

	// PUT: Update a sale
	@PutMapping("/{id}")
	public ResponseEntity<SalesEntity> updateSale(@PathVariable String id, @RequestBody SalesEntity salesEntity) {
		Optional<SalesEntity> updatedSale = salesService.updateSale(id, salesEntity);
		return updatedSale.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
	}

	@PutMapping("/sell")
	public ResponseEntity<String> sellVehicles(@RequestBody SalesEntity salesEntity) {
		try {
			salesService.sellVehicles(salesEntity);
			return ResponseEntity.ok("Successfully sold " + salesEntity.getQuantitySold() + " units of vehicleId "
					+ salesEntity.getVehicleId());
		} catch (RuntimeException e) {
			return ResponseEntity.status(400).body("Error: " + e.getMessage());
		}
	}

}
