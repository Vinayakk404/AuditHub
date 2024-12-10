package com.tvsmotor.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.tvsmotor.config.InventoryFeignInterface;
import com.tvsmotor.entity.Inventory;
import com.tvsmotor.entity.QualityCheck;
import com.tvsmotor.repository.InventoryRepository;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class InventoryService {

	@Autowired
	private InventoryRepository inventoryRepository;

	@Autowired
	private InventoryFeignInterface inventoryClient;

	private static final Map<String, Integer> VEHICLE_PRICES = new HashMap<>();

	static {
		VEHICLE_PRICES.put("V101", 75000); // Apache RTR 160
		VEHICLE_PRICES.put("V102", 65000); // Apache RTR 200
		VEHICLE_PRICES.put("V103", 50000); // TVS Ntorq
		VEHICLE_PRICES.put("V104", 55000); // TVS Jupiter
		VEHICLE_PRICES.put("V105", 45000); // Star City
		VEHICLE_PRICES.put("V106", 41269); // TVS XL100
		VEHICLE_PRICES.put("V107", 108000); // Electric
		VEHICLE_PRICES.put("V108", 100000); // Raider

		// Add more vehicles as needed
	}

	public List<Inventory> getAllInventories() {
		return inventoryRepository.findAll();
	}

	public List<Inventory> getInventoryByVehicleId(String vehicleId) {
		return inventoryRepository.findByVehicleId(vehicleId);
	}

	public Inventory saveInventory(Inventory inventory) {
		return inventoryRepository.save(inventory);
	}

	public Inventory getInventoryByVehicleModel(String vehicleModel) {
		return inventoryRepository.findByVehicleModelIgnoreCase(vehicleModel);
	}

	public Optional<Inventory> findByBatchId(int batchId) {
		return inventoryRepository.findByBatchId(batchId);
	}

	public Inventory updateAnomalyByBatchId(int batchId, int newStock, int discaredStock, String category) {
		// Find the inventory item by batch ID
		Optional<Inventory> inventoryOpt = inventoryRepository.findByBatchId(batchId);

		if (inventoryOpt.isPresent()) {
			Inventory inventory = inventoryOpt.get();

			// Update the stock and anomaly category
			inventory.setStock(inventory.getStock() - newStock);

			String vehicleId = inventory.getVehicleId();

			// Get the vehicle production price based on vehicle ID
			Integer productionPrice = VEHICLE_PRICES.get(vehicleId);
			if (productionPrice == null) {
				// If production price is not found, handle accordingly
				throw new RuntimeException("Production price not found");
			}
			if ("defectiveStock".equals(category)) {
				inventory.setDefectiveStock(inventory.getDefectiveStock() + discaredStock);

				int lossAmount = discaredStock * productionPrice;
				inventory.setDefectiveLoss(inventory.getDefectiveLoss() + lossAmount);

			} else {
				inventory.setDamagedStock(inventory.getDamagedStock() + discaredStock);
				// Calculate loss and update the inventory loss amount
				int lossAmount = discaredStock * productionPrice;
				inventory.setDamagedLoss(inventory.getDamagedLoss() + lossAmount);

			}

			// Save the updated inventory
			return inventoryRepository.save(inventory);
		} else {
			// Return null if not found
			return null;
		}
	}

	// New method to decrement quantity
	public boolean decrementQuantity(int batchId, int stock) {
		Optional<Inventory> batchOpt = inventoryRepository.findByBatchId(batchId);
		if (batchOpt.isPresent()) {
			Inventory batch = batchOpt.get();
			if (batch.getStock() >= stock) {
				batch.setStock(batch.getStock() - stock);
				inventoryRepository.save(batch);
				return true;
			}
		}
		return false;
	}

}
