// CombinedDataService.java
package com.tvsmotor.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tvsmotor.Repository.CombinedDataRepository;
import com.tvsmotor.model.CombinedData;

import java.util.*;

@Service
public class CombinedDataService {

	private final CombinedDataRepository repository;
	private final ObjectMapper objectMapper;

	// In-memory cache to store data temporarily
	private final Map<String, CombinedData> combinedDataMap = new HashMap<>();

	public CombinedDataService(CombinedDataRepository repository) {
		this.repository = repository;
		this.objectMapper = new ObjectMapper();
	}

	@KafkaListener(topics = "production_data", groupId = "combined-data-group")
	public void consumeProduction(String message) throws Exception {
		JsonNode node = objectMapper.readTree(message);
		String batchId = node.get("_id").asText();

		CombinedData data = combinedDataMap.getOrDefault(batchId, new CombinedData());
		data.setBatchId(batchId);
		data.setProduction_date(node.get("productionStartTime").asText());
		data.setQuantity(node.get("quantity").asInt());

		combinedDataMap.put(batchId, data);
		saveIfComplete(batchId);
	}

	@KafkaListener(topics = "qc_data", groupId = "combined-data-group")
	public void consumeQualityCheck(String message) throws Exception {
		JsonNode node = objectMapper.readTree(message);
		String batchId = node.get("_id").asText();

		CombinedData data = combinedDataMap.getOrDefault(batchId, new CombinedData());
		data.setBatchId(batchId);
		data.setStatus(node.get("status").asText());
//        data.setInspector(node.get("inspector").asText());

		combinedDataMap.put(batchId, data);
		saveIfComplete(batchId);
	}

	@KafkaListener(topics = "inventory_data", groupId = "combined-data-group")
	public void consumeInventory(String message) throws Exception {
		JsonNode node = objectMapper.readTree(message);
		String batchId = node.get("_id").asText();

		CombinedData data = combinedDataMap.getOrDefault(batchId, new CombinedData());
		CombinedData.Inventory item = new CombinedData.Inventory();
		item.setItem(node.get("item").asText());
		item.setStock(node.get("stock").asInt());

		List<CombinedData.Inventory> inventory = data.getInventory();
		if (inventory == null)
			inventory = new ArrayList<>();
		inventory.add(item);
		data.setInventory(inventory);

		combinedDataMap.put(batchId, data);
		saveIfComplete(batchId);
	}

	@KafkaListener(topics = "sales_data", groupId = "combined-data-group")
	public void consumeSalesData(String message) throws Exception {
		JsonNode node = objectMapper.readTree(message);
		String batchId = node.get("batchIds").asText();

		CombinedData data = combinedDataMap.getOrDefault(batchId, new CombinedData());
		CombinedData.Sales sale = new CombinedData.Sales();
		sale.setSaleId(node.get("salesID").asText());
		sale.setAmount(node.get("totalSaleValue").asDouble());

		List<CombinedData.Sales> sales = data.getSales_data();
		if (sales == null)
			sales = new ArrayList<>();
		sales.add(sale);
		data.setSales_data(sales);

		combinedDataMap.put(batchId, data);
		saveIfComplete(batchId);
	}

	private void saveIfComplete(String batchId) {
		CombinedData data = combinedDataMap.get(batchId);
		// Define what constitutes "complete". For simplicity, let's assume production
		// and quality_check are mandatory.
		if (data.getBatchId() != null)
			repository.save(data);
		combinedDataMap.remove(batchId);
		System.out.println("Saved combined data for batch_id: " + batchId);
	}

}
