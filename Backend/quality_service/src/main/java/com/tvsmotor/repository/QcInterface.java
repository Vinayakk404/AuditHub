package com.tvsmotor.repository;

import org.springframework.data.mongodb.repository.MongoRepository;


import com.tvsmotor.entity.QualityCheck;

public interface QcInterface extends MongoRepository<QualityCheck, Integer>{
	QualityCheck findTopByOrderByBatchIdDesc();

}
