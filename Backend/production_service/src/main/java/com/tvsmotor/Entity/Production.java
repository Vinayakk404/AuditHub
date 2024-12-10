package com.tvsmotor.Entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;


import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Document(collection = "production_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Production {

    
	@Id
    private int batchId; // Primary Key as an integer

	private String planId;
	
    public String getPlanId() {
		return planId;
	}

	public void setPlanId(String nextPlanId) {
		this.planId = nextPlanId;
	}

	@Field("VehicleModel")
    @NotBlank(message = "VehicleModel cannot be blank")
    private String vehicleModel;

    @Field("ProductionLine")
    @NotBlank(message = "ProductionLine cannot be blank")
    private String productionLine;

    @Field("Shift")
    @NotBlank(message = "Shift cannot be blank")
    private String shift;

    @Field("PlannedProductionUnits")
    @NotNull(message = "PlannedProductionUnits cannot be null")
    @Min(value = 1, message = "PlannedProductionUnits must be at least 1")
    private int plannedProductionUnits;

 
    private Integer actualProductionUnits=0;

    @Field("ProductionStartTime")
    @NotNull(message = "ProductionStartTime cannot be null")
    private LocalDateTime productionStartTime;

    @Field("ProductionEndTime")
    @NotNull(message = "ProductionEndTime cannot be null")
    private LocalDateTime productionEndTime = LocalDateTime.now().plusHours(4); // Default value is 4 hours ahead

    @Field("DelayInMinutes")
    @NotNull(message = "DelayInMinutes cannot be null")
    @Min(value = 0, message = "DelayInMinutes cannot be negative")
    private Integer delayInMinutes;

    @Field("Status")
    @NotBlank(message = "Status cannot be blank")
    private String status;

    @Field("OperatorID")
    @NotBlank(message = "OperatorID cannot be blank")
    private String operatorId;
    
    private String plantId;
    
    private String date;

    @Field("VehicleID")
    @NotBlank(message = "VehicleID cannot be blank")
    private String vehicleId;

    @Field("Comments")
    private String comments; // Optional field

    @Field("AnomalyFlag")
    private boolean anomalyFlag = false; // Default value is false

    @Field("AnomalyType")
    private String anomalyType; // Optional field

    @CreatedDate
    private LocalDate createdAt=LocalDate.now();
    
    private int amountLoss=0;
	
	
    // Additional methods if necessary
}

