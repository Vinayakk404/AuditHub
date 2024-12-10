package com.tvsmotor.config;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.tvsmotor.entity.Inventory;

@FeignClient(name = "inventoryService")
public interface SaleFeignInterface {
	@GetMapping("/api/inventory/inv")
	public List<Inventory> getInventoryData();

	@GetMapping("/api/inventory/model/{vehicleModel}")
	Inventory getInventoryByModel(@PathVariable("vehicleModel") String vehicleModel);

	@GetMapping("/api/inventory/{vehicleId}")
	List<Inventory> getInventoryByVehcileId(@PathVariable("vehicleId") String vehicleId);

	@PutMapping("/api/inventory/batch/{batchId}/decrement")
	void decrementInventoryQuantity(@PathVariable("batchId") int batchId, @RequestParam("stock") int stock);
}
