package com.tvsmotor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tvsmotor.config.SaleFeignInterface;
import com.tvsmotor.entity.Inventory;
import com.tvsmotor.entity.SalesEntity;
import com.tvsmotor.repository.SalesRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SalesService {
	private static final Logger logger = LoggerFactory.getLogger(SalesService.class);

	@Autowired
	private SalesRepository salesRepository;

	@Autowired
	private SaleFeignInterface salesClient;

	// Get all sales
	public List<SalesEntity> getAllSales() {
		return salesRepository.findAll();
	}

	public List<Inventory> getInventoryAllData() {
		return salesClient.getInventoryData();
	}

	public List<Inventory> getInventoryByVehicleId(String vehicleId) {
		return salesClient.getInventoryByVehcileId(vehicleId);
	}

	public Inventory getInventory(String model) {
		return salesClient.getInventoryByModel(model);
	}

	// Get a sale by ID
	public Optional<SalesEntity> getSaleById(String id) {
		return salesRepository.findById(id);
	}

	// add Sale
	public SalesEntity addSale(SalesEntity salesEntity) {
		return salesRepository.save(salesEntity);
	}

	// Get sales by vehicle ID
	public List<SalesEntity> getSalesByVehicleId(String vehicleId) {
		return salesRepository.findByVehicleId(vehicleId);
	}

	// Get sales by sale date
	public List<SalesEntity> getSalesBySaleDate(LocalDate saleDate) {
		return salesRepository.findBySaleDate(saleDate);
	}

	// Get sales by model
	public List<SalesEntity> getSalesByModel(String model) {
		return salesRepository.findByVehicleModel(model);
	}

	// Update a sale
	public Optional<SalesEntity> updateSale(String id, SalesEntity salesEntity) {
		Optional<SalesEntity> existingSale = salesRepository.findById(id);
		if (existingSale.isPresent()) {
			salesEntity.setId(id); // Ensure the ID remains the same
			SalesEntity updatedSale = salesRepository.save(salesEntity);
			return Optional.of(updatedSale);
		} else {
			return Optional.empty();
		}
	}

	public SalesEntity createSale(SalesEntity salesEntity) {
		// TODO Auto-generated method stub
		return null;
	}

	public void sellVehicles(SalesEntity salesEntity) {

		String vehicleId = salesEntity.getVehicleId();
		int quantityToSell = salesEntity.getQuantitySold();
		String batchIds = "";
		// Step 1: Retrieve all inventory batches for the model
		logger.info("Initiating sale: vehicleId={}, quantityToSell={}", vehicleId, quantityToSell);

		// Step 1: Retrieve all inventory batches for the vehicleId
		List<Inventory> batches = salesClient.getInventoryByVehcileId(vehicleId);
		logger.debug("Retrieved {} batches for vehicleId {}", batches.size(), vehicleId);

		int remainingQuantity = quantityToSell;

		// Step 2: Iterate through batches and decrement inventory
		for (Inventory batch : batches) {
			if (remainingQuantity <= 0) {

				salesEntity.setBatchIds(batchIds);

				salesRepository.save(salesEntity);
				break;
			}

			int availableQuantity = batch.getStock();

			logger.debug("Processing batchId={} with availableStock={}", batch.getBatchId(), availableQuantity);

			if (availableQuantity > 0) {
				// Determine the quantity to sell from this batch
				int quantityToSellFromBatch = Math.min(availableQuantity, remainingQuantity);

				logger.debug("Attempting to sell {} units from batchId={}", remainingQuantity, batch.getBatchId());

				try {
					// Step 3: Decrement inventory via Feign client
					salesClient.decrementInventoryQuantity(batch.getBatchId(), quantityToSellFromBatch);

					logger.info("Decremented {} units from batchId={}", quantityToSellFromBatch, batch.getBatchId());

					batchIds += " " + batch.getBatchId();
//                    
//                    salesRepository.save(transaction);
					logger.info("Recorded sales transaction: batchId={}, quantity={}", batch.getBatchId(),
							quantityToSellFromBatch);

					// Update remaining quantity
					remainingQuantity -= quantityToSellFromBatch;

				} catch (Exception e) {
					logger.error("Failed to process sale for batchId={}", batch.getBatchId(), e);

					// Handle exceptions (e.g., network issues, insufficient inventory)
					throw new RuntimeException("Failed to process sale for batch ID: " + batch.getBatchId(), e);
				}
			}
		}

		// Step 5: Check if the sale was fully processed
		if (remainingQuantity > 0) {
			logger.warn("Insufficient inventory for vehicleId={}: remainingQuantity={}", vehicleId, remainingQuantity);

			throw new RuntimeException("Insufficient inventory to sell the requested quantity of " + vehicleId);
		}
		logger.info("Successfully completed sale: vehicleId={}, quantitySold={}", vehicleId, quantityToSell);

	}
}
