package com.tvsmotor.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "production_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Production {

    
	@Id
    private int batchId; // Primary Key as an integer

	private int planId;
	
    public int getPlanId() {
		return planId;
	}

	public void setPlanId(int planId) {
		this.planId = planId;
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

    @Field("ActualProductionUnits")
    @NotNull(message = "ActualProductionUnits cannot be null")
    @Min(value = 0, message = "ActualProductionUnits cannot be negative")
    private Integer actualProductionUnits;

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

    @Field("VehicleID")
    @NotBlank(message = "VehicleID cannot be blank")
    private String vehicleId;

    @Field("Comments")
    private String comments; // Optional field

    @Field("AnomalyFlag")
    private boolean anomalyFlag = false; // Default value is false

    @Field("AnomalyType")
    private String anomalyType; // Optional field

	
	
	

    // Additional methods if necessary
}

