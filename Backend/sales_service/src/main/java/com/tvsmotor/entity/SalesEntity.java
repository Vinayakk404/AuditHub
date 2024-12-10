package com.tvsmotor.entity;
import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "sales_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesEntity {
    @Id
    private String id; 
    
    private String planId;
    
    ArrayList<Integer> batchId = new ArrayList<Integer>();
    private String salesID;
    private String vehicleId;
    private LocalDate saleDate;
    private int quantitySold;
    private double salePrice;
    private double totalSaleValue;
    private String customerID;
    private String paymentStatus;
    private String anomalyFlag;
    private String anomalyCategory;
    private String vehicleModel;
    private String region;
    private String dealership;
    private String batchIds;
	
    @Transient
    private Inventory inventory;

	@CreatedDate
	private LocalDate createdAt = LocalDate.now();
    

}

