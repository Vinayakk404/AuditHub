package com.tvsmotor.Repository;


import org.springframework.data.mongodb.repository.MongoRepository;

import com.tvsmotor.model.CombinedData;

public interface CombinedDataRepository extends MongoRepository<CombinedData, String> {
 CombinedData findByBatchId(String batchId);
}
