package com.tvsmotor.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tvsmotor.entity.SalesEntity;

public interface SalesRepository extends MongoRepository<SalesEntity, String> {
}

