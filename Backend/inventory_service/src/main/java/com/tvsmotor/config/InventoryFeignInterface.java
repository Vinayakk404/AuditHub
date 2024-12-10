package com.tvsmotor.config;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.tvsmotor.entity.QualityCheck;

@FeignClient(name = "qualityService")
public interface InventoryFeignInterface {
	@GetMapping("/api/qc")
	public List<QualityCheck> getQualityData();
}
