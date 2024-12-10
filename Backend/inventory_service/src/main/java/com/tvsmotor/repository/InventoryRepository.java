package com.tvsmotor.repository;
import java.util.List;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.tvsmotor.entity.Inventory;

@Repository
public interface InventoryRepository extends MongoRepository<Inventory, String> {

	 Inventory findTopByOrderByInventoryIdDesc();


	public Inventory findByVehicleModelIgnoreCase(String vehicleModel);
	
	public Optional<Inventory> findByBatchId(int batchId);
	
	public List<Inventory> findByVehicleId(String vehicleId);
	
	List<Inventory> findByVehicleIdOrderByBatchIdAsc(String vehicleId);


	

	

	
}
