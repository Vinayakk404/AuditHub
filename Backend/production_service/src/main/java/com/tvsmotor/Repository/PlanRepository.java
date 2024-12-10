package com.tvsmotor.Repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tvsmotor.Entity.Plans;

public interface PlanRepository extends MongoRepository<Plans, String> {

	boolean existsByPlanId(Plans planData);
    Optional<Plans> findByPlanId(String planId);
	Plans findTopByOrderByPlanIdDesc();

}
