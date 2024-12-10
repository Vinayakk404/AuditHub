package com.tvsmotor.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "combined_data")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CombinedData {
	@Id
	private String id;
	private String batchId;
	private String production_date;
	private int quantity;
	private String status;
	private String inspector;
	private List<Inventory> inventory;
	private List<Sales> sales_data;

	// Inner classes
	public static class Inventory {
		private String item;
		private int stock;

		// Getters and Setters
		public void setItem(String asText) {
			// TODO Auto-generated method stub

		}

		public void setStock(int asInt) {
			// TODO Auto-generated method stub

		}
	}

	public static class Sales {
		private String sale_id;
		private double amount;

		// Getters and Setters
		public void setSaleId(String asText) {
			// TODO Auto-generated method stub

		}

		public void setAmount(double asDouble) {
			// TODO Auto-generated method stub

		}
	}
}
