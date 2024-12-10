package com.tvsmotor.repository;

import com.tvsmotor.entity.SalesEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalesRepository extends MongoRepository<SalesEntity, String> {
    List<SalesEntity> findBySaleDate(LocalDate saleDate);
    List<SalesEntity> findByVehicleModel(String model);
    List<SalesEntity> findByRegion(String region);
    List<SalesEntity> findByDealership(String dealership);
	List<SalesEntity> findByVehicleId(String vehicleId);
}
