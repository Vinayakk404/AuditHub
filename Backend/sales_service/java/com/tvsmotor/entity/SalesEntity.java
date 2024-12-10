package com.tvsmotor.entity;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "sales_data")
public class SalesEntity {
    @Id
    private String id;  // Use MongoDB's ObjectId for uniqueness
    private String vehicle_id;
    private String saleDate;
    private int quantitySold;
    private double salePrice;
    private double totalSaleValue;
    private String customerID;
    private String paymentStatus;
    private String anomalyFlag;
    private String anomalyCategory;
    private String model;
    private String region;
    private String dealership;
	public SalesEntity() {
		super();
		// TODO Auto-generated constructor stub
	}
	public SalesEntity(String id, String vehicle_id, String saleDate, int quantitySold, double salePrice,
			double totalSaleValue, String customerID, String paymentStatus, String anomalyFlag, String anomalyCategory,
			String model, String region, String dealership) {
		super();
		this.id = id;
		this.vehicle_id = vehicle_id;
		this.saleDate = saleDate;
		this.quantitySold = quantitySold;
		this.salePrice = salePrice;
		this.totalSaleValue = totalSaleValue;
		this.customerID = customerID;
		this.paymentStatus = paymentStatus;
		this.anomalyFlag = anomalyFlag;
		this.anomalyCategory = anomalyCategory;
		this.model = model;
		this.region = region;
		this.dealership = dealership;
	}
	
	    // Getter and Setter for id
	    public String getId() {
	        return id;
	    }

	    public void setId(String id) {
	        this.id = id;
	    }

	    // Getter and Setter for vehicle_id
	    public String getVehicle_id() {
	        return vehicle_id;
	    }

	    public void setVehicle_id(String vehicle_id) {
	        this.vehicle_id = vehicle_id;
	    }

	    // Getter and Setter for saleDate
	    public String getSaleDate() {
	        return saleDate;
	    }

	    public void setSaleDate(String saleDate) {
	        this.saleDate = saleDate;
	    }

	    // Getter and Setter for quantitySold
	    public int getQuantitySold() {
	        return quantitySold;
	    }

	    public void setQuantitySold(int quantitySold) {
	        this.quantitySold = quantitySold;
	    }

	    // Getter and Setter for salePrice
	    public double getSalePrice() {
	        return salePrice;
	    }

	    public void setSalePrice(double salePrice) {
	        this.salePrice = salePrice;
	    }

	    // Getter and Setter for totalSaleValue
	    public double getTotalSaleValue() {
	        return totalSaleValue;
	    }

	    public void setTotalSaleValue(double totalSaleValue) {
	        this.totalSaleValue = totalSaleValue;
	    }

	    // Getter and Setter for customerID
	    public String getCustomerID() {
	        return customerID;
	    }

	    public void setCustomerID(String customerID) {
	        this.customerID = customerID;
	    }

	    // Getter and Setter for paymentStatus
	    public String getPaymentStatus() {
	        return paymentStatus;
	    }

	    public void setPaymentStatus(String paymentStatus) {
	        this.paymentStatus = paymentStatus;
	    }

	    // Getter and Setter for anomalyFlag
	    public String getAnomalyFlag() {
	        return anomalyFlag;
	    }

	    public void setAnomalyFlag(String anomalyFlag) {
	        this.anomalyFlag = anomalyFlag;
	    }

	    // Getter and Setter for anomalyCategory
	    public String getAnomalyCategory() {
	        return anomalyCategory;
	    }

	    public void setAnomalyCategory(String anomalyCategory) {
	        this.anomalyCategory = anomalyCategory;
	    }

	    // Getter and Setter for model
	    public String getModel() {
	        return model;
	    }

	    public void setModel(String model) {
	        this.model = model;
	    }

	    // Getter and Setter for region
	    public String getRegion() {
	        return region;
	    }

	    public void setRegion(String region) {
	        this.region = region;
	    }

	    // Getter and Setter for dealership
	    public String getDealership() {
	        return dealership;
	    }

	    public void setDealership(String dealership) {
	        this.dealership = dealership;
	    }

}

