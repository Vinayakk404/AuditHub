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
 private  PlanRepository planRepository;


@Autowired
 private  ProductionRepository productionDataRepository;

 /**
  * Saves a new plan to the database.
  *
  * @param plan The plan to save.
  * @return The saved plan.
  */
 @Transactional
 public Plans savePlan(Plans plan) {
     // Save Plan
     
     planRepository.save(plan);

     return plan;
 }

 
// public Optional<PlanWithProductionData> getPlanWithProductionData(String planId) {
//     Optional<Plans> optionalPlan = planRepository.findByPlanId(planId);
//     if (optionalPlan.isPresent()) {
//         Plans plan = optionalPlan.get();
//         List<Production> productionDataList = productionDataRepository.findByPlanId(planId);
//         return Optional.of(new PlanWithProductionData(plan, productionDataList));
//     } else {
//         return Optional.empty();
//     }
// }
// public List<PlanWithProductionData> getAllPlansWithProductionData() {
//     List<Plans> plans = planRepository.findAll();
//     return plans.stream()
//             .map(plan -> new PlanWithProductionData(plan, productionDataRepository.findByPlanId(plan.getPlanId())))
//             .toList();
// }
// 
// public static class PlanWithProductionData {
//     private Plans plan;
//     private List<Production> productionDataList;
//
//     public PlanWithProductionData(Plans plan, List<Production> productionDataList) {
//         this.plan = plan;
//         this.productionDataList = productionDataList;
//     }
//
//     // Getters and Setters
//
//     public Plans getPlan() {
//         return plan;
//     }
//
//     public void setPlan(Plans plan) {
//         this.plan = plan;
//     }
//
//     public List<Production> getProductionDataList() {
//         return productionDataList;
//     }
//
//     public void setProductionDataList(List<Production> productionDataList) {
//         this.productionDataList = productionDataList;
//     }
// }
 /**
  * Retrieves a plan by its unique planId.
  *
  * @param planId The unique identifier of the plan.
  * @return An Optional containing the plan if found, else empty.
  */
 public Optional<Plans> getPlanByPlanId(String planId) {
     return planRepository.findByPlanId(planId);
 }

 /**
  * Retrieves all plans from the database.
  *
  * @return A list of all plans.
  */
 public List<Plans> getAllPlans() {
     return planRepository.findAll();
 }

 /**
  * Updates an existing plan.
  *
  * @param planId The unique identifier of the plan to update.
  * @param updatedPlan The updated plan details.
  * @return The updated plan if found, else null.
  */
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

 /**
  * Deletes a plan by its unique planId.
  *
  * @param planId The unique identifier of the plan to delete.
  */
 public void deletePlan(String planId) {
     Optional<Plans> optionalPlan = planRepository.findByPlanId(planId);
     optionalPlan.ifPresent(planRepository::delete);
 }
}
