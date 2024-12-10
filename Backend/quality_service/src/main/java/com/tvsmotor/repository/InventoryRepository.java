package com.tvsmotor.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tvsmotor.entity.Inventory;
import com.tvsmotor.entity.QualityCheck;

public interface InventoryRepository extends MongoRepository<Inventory, String> {
	 int findTopByOrderByInventoryIdDesc();
}
