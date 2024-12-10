package com.tvsmotor.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "inventory_data")
public class Inventory {

	@Id
	private int inventoryId;
	
	@NotBlank(message = "batch Id cannot be blank")
	private int batchId;
	
	@Field(name = "vehicle_id")
    private String vehicleId;
	
    @NotBlank(message = "model cannot be blank")
    private String vehicleModel;
   
   
       
    @NotBlank(message = "stock cannot be blank")
    private int stock;
    
    
    private int defectiveStock=0;
    
    private int damagedStock=0;
    
   
    @Transient
    Quality quality;
	
	
}
