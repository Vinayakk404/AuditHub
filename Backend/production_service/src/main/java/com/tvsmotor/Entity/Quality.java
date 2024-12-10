package com.tvsmotor.Entity;

import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Document(collection = "qc_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quality {
    @Id
    private int qualityId; // Unique identifier for quality records

   int batchId;
   
	
private String planId;

	public int getBatchId() {
	return batchId;
}

public void setBatchId(int batchId) {
	this.batchId = batchId;
}

	@Transient
    private Production production;

	public int getQualityId() {
		return qualityId;
	}

	public void setQualityId(int qualityId) {
		this.qualityId = qualityId;
	}

	public Production getProduction() {
		return production;
	}

	public void setProduction(Production production) {
		this.production = production;
	}

	public Quality(int qualityId, Production production) {
		super();
		this.qualityId = qualityId;
		this.production = production;
	}

	
    
    
}