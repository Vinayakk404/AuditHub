package com.tvsmotor.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

//src/main/java/com/example/vehiclemanufacturing/model/Plan.java
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "plans")
public class Plans {
	 @Id
	    private String id; // MongoDB's unique identifier

	    private String planId; // UUID or any unique plan identifier

	    private String startDate; // Format: YYYY-MM-DD

	    private String endDate;   // Format: YYYY-MM-DD

	    private List<String> vehicles; // List of vehicle model names

	    private Integer totalUnits;

	    private Double budget;

}
