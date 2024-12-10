package com.tvsmotor.entity;


import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Document(collection = "qc_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QualityCheck {
	    @Id
	    private int batchId;
	    
	    private String vehicleId;
	    
	    private String planId;

	    @Field("VehicleModel")
	    private String vehicleModel;

	    @NotBlank(message = "Qc passed units cannot be blank")
	    private int qcPassedUnits;

	    @NotBlank(message = "Qc failed units cannot be blank")
	    private int qcFailedUnits;

	    @NotBlank(message = "Qc failiure rate  cannot be blank")
	   
	    private double qcFailureRate;

	   
	    @Field("anomalyFlag")
	    private boolean anomalyFlag;
	    
	    @Field("anomalyType")
	    private String anomalyType;
	   
	    @Field("comments")
	    private String comments;
	    
	    @Field("shift")
	    private String shift;
	    
	    private int delay;
	    
	    private int amountLoss=0;
	    
	    @Transient
	    private Production production;

		public boolean getAnomalyFlag() {
			// TODO Auto-generated method stub
			return false;
			
		}
		
		 private LocalDateTime qualityStartTime;
		 private LocalDateTime  qualityEndTime;

		    @CreatedDate
		    private LocalDate createdAt=LocalDate.now();
		    
			

}
