package com.tvsmotor.Service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tvsmotor.Entity.Plans;
import com.tvsmotor.Entity.Production;
import com.tvsmotor.Repository.PlanRepository;
import com.tvsmotor.Repository.ProductionRepository;
import com.tvsmotor.exception.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;



	@Service
	public class ProductionDataService implements ProductionDataServiceInterface {

	    @Autowired
	    private ProductionRepository productionDataRepository;
	    
	    @Autowired
	    private PlanRepository planRepo;
	    
	    
	    public List<Plans> getAllPlanData() {
	        return planRepo.findAll();
	    }
	    @Override
	    public Production saveProductionData(Production productionData) {
	    
	    	 
	              // Ensure provided batchId is unique
	              if (productionDataRepository.existsByBatchId(productionData)) {
	                  throw new IllegalArgumentException("Batch ID " + productionData.getBatchId() + " already exists.");
	              
	          }
	          return productionDataRepository.save(productionData);
	    }
	    
	    
	    public Plans savePlanData(Plans planData) {
	    
	    	 
	              // Ensure provided batchId is unique
	              if (planRepo.existsByPlanId(planData)) {
	                  throw new IllegalArgumentException("Batch ID " + planData.getPlanId() + " already exists.");
	              
	          }
	          return planRepo.save(planData);
	    }

	    @Override
	    public List<Production> getAllProductionData() {
	        return productionDataRepository.findAll();
	    }

	    @Override
	    public Production getProductionDataByBatchId(int batchId) {
	        return productionDataRepository.findByBatchId(batchId);
	    }

	    public int getLastBatchId() {
	        Production lastProduction = productionDataRepository.findTopByOrderByBatchIdDesc();
	        if (lastProduction != null  ) {
	            try {
	                return lastProduction.getBatchId();
	            } catch (NumberFormatException e) {
	                System.out.println("Batch Id not found");
	            }
	        }
	        return 0; // This will make the next batch ID 1050
	    }
	    
	    public String getLastPlanId() {
	        Plans lastPlans = planRepo.findTopByOrderByPlanIdDesc();
	        if (lastPlans != null  ) {
	            try {
	                return lastPlans.getPlanId();
	            } catch (NumberFormatException e) {
	                System.out.println("Plan Id not found");
	            }
	        }
	        return ""; // This will make the next batch ID 1050
	    }
	    
	    @Override
	    public String deleteProductionData(int batchId) {
	        Production productions = getProductionDataByBatchId(batchId);
	        if (productions==null) {
	            throw new ResourceNotFoundException("Batch ID not found: " + batchId);
	        }
	        productionDataRepository.deleteByBatchId(batchId);
	        return "Item deleted";
	    }

	    @Override
	    public Production updateProductionData(int batchId, Production productionData) {
	        // Fetch existing Production data
	        // Fetch existing Production data by batchId
	        Production existingProduction = productionDataRepository.findByBatchId(batchId);
	                if(existingProduction==null) 
	                {throw  new ResourceNotFoundException("No production data found for batch ID: ");}

	        existingProduction.setActualProductionUnits(productionData.getActualProductionUnits());
	        existingProduction.setStatus("Completed");
	        existingProduction.setAnomalyType(productionData.getAnomalyType());
	        existingProduction.setAmountLoss(productionData.getAmountLoss());
	        // Save the updated Production data
	        return productionDataRepository.save(existingProduction);
	}
	    
	    @Override
	    public Production updateBatch(int batchId, Production updateRequest) {
	    	
	        Production existingProduction = productionDataRepository.findById(batchId)
	                .orElseThrow(() -> new ResourceNotFoundException("No production data found for batch ID: " + batchId));

	    	

	        existingProduction.setProductionEndTime(updateRequest.getProductionEndTime());
	        existingProduction.setAnomalyFlag(updateRequest.isAnomalyFlag());
	        existingProduction.setAnomalyType(updateRequest.getAnomalyType());
	        existingProduction.setActualProductionUnits(updateRequest.getActualProductionUnits());
	        existingProduction.setAmountLoss(updateRequest.getAmountLoss());
	        existingProduction.setStatus("Completed");
	            return productionDataRepository.save(existingProduction);
	       
	    }


		@Override
		public List<Production> getProductionDataOperatorId(String operatorId) {
			
			return productionDataRepository.findByOperatorId(operatorId)
					.stream().filter(batch->batch.getStatus().equals("Planned") ).toList();
		}
	
		@Override
		public List<Production> getProductionDataPlantId(String plantId) {
			
			return productionDataRepository.findByPlantId(plantId);
		}
	}

