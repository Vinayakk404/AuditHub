package com.tvsmotor.Entity;

import org.springframework.data.mongodb.core.mapping.Document;

//src/main/java/com/example/vehiclemanufacturing/model/ProductionDetail.java


import lombok.Data;

@Data
@Document(collection="production_detail")
public class ProductionDetail {

 private String vehicleModel;

 private Integer productionUnits;

 private Double productionPrice;

 private String plant;

 private String date;  // Format: YYYY-MM-DD

 private String shift;

}
