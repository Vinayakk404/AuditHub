package com.tvsmotor.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.tvsmotor.entity.UserCredential;

import java.util.Optional;

public interface UserCredentialRepository extends MongoRepository<UserCredential, String> {
	Optional<UserCredential> findByName(String username);
}
