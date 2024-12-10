package com.tvsmotor.Service;


import java.util.List;

import java.util.Optional;

import com.tvsmotor.Entity.Production;



public interface ProductionDataServiceInterface {
    Production saveProductionData(Production productionData);
    List<Production> getAllProductionData();
    Production getProductionDataByBatchId(int batchId);
    List<Production> getProductionDataOperatorId(String operatorId);
    String deleteProductionData(int batchId);
    int getLastBatchId();
    Production updateProductionData(int batchId, Production productionData);
    Production updateBatch(int batchId, Production updateRequest);
	List<Production> getProductionDataPlantId(String plantId);
}
