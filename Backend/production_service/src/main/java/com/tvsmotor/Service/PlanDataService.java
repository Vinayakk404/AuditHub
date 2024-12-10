package com.tvsmotor.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvsmotor.Entity.Plans;
import com.tvsmotor.Entity.Production;
import com.tvsmotor.Repository.PlanRepository;
import com.tvsmotor.Repository.ProductionRepository;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PlanDataService {
	@Autowired
	private PlanRepository planRepository;

	@Autowired
	private ProductionRepository productionDataRepository;


	@Transactional
	public Plans savePlan(Plans plan) {
		// Save Plan

		planRepository.save(plan);

		return plan;
	}

	public Optional<Plans> getPlanByPlanId(String planId) {
		return planRepository.findByPlanId(planId);
	}

	public List<Plans> getAllPlans() {
		return planRepository.findAll();
	}
	
	public Plans updatePlan(String planId, Plans updatedPlan) {
		Optional<Plans> optionalPlan = planRepository.findByPlanId(planId);
		if (optionalPlan.isPresent()) {
			Plans existingPlan = optionalPlan.get();
			existingPlan.setStartDate(updatedPlan.getStartDate());
			existingPlan.setEndDate(updatedPlan.getEndDate());
			existingPlan.setVehicles(updatedPlan.getVehicles());
			existingPlan.setTotalUnits(updatedPlan.getTotalUnits());
			existingPlan.setBudget(updatedPlan.getBudget());
			return planRepository.save(existingPlan);
		} else {
			return null;
		}
	}

	public void deletePlan(String planId) {
		Optional<Plans> optionalPlan = planRepository.findByPlanId(planId);
		optionalPlan.ifPresent(planRepository::delete);
	}
}
