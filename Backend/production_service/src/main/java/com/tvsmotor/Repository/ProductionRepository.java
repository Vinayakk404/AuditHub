package com.tvsmotor.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.tvsmotor.Entity.Plans;
import com.tvsmotor.Entity.Production;

public interface ProductionRepository extends MongoRepository<Production, Integer> {
    Production findByBatchId(int batchId);
    public void deleteByBatchId(int batchId);
	boolean existsByBatchId(Production productionData);
	List<Production> findByOperatorId(String operatorId); 
	Production findTopByOrderByBatchIdDesc();
    List<Production> findByPlanId(String planId);
	List<Production> findByPlantId(String plantId);

}
