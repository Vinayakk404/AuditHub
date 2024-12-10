package com.tvsmotor.config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.*;
import com.tvsmotor.entity.Production;
import com.tvsmotor.entity.QualityCheck;

@FeignClient(name = "productionService")
public interface QualityFeignInterface {
	
	@GetMapping("/api/productionData")
	public List<Production> getProductionData();
	

}
