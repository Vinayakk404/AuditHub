package com.tvsmotor.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import com.tvsmotor.audit.Audit;
import com.tvsmotor.config.QualityFeignInterface;
import com.tvsmotor.entity.Inventory;
import com.tvsmotor.entity.Production;
import com.tvsmotor.entity.QualityCheck;
import com.tvsmotor.exception.BatchIdNotFoundException;
import com.tvsmotor.exception.MissingDataException;
import com.tvsmotor.repository.InventoryRepository;
import com.tvsmotor.repository.QcInterface;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class QcService {

	@Autowired
	private QcInterface qcinterface;

	@Autowired
	private Audit audit; // Inject the Audit class

	@Autowired
	private QualityFeignInterface qualityClient;

	@Autowired
	private InventoryRepository inventoryRepository;

	public QualityCheck createBatch(QualityCheck batch) {

		return qcinterface.save(batch);

	}

	public List<QualityCheck> getAllBatches() {
		return qcinterface.findAll();
	}

	public List<Production> getProductionData() {

		List<Production> allProduction = qualityClient.getProductionData();

		// Fetch all existing QC batch IDs
		List<QualityCheck> existingQCData = qcinterface.findAll();
		List<Integer> existingBatchIds = existingQCData.stream().map(QualityCheck::getBatchId)
				.collect(Collectors.toList());

		// Filter production data with status "Completed" and not in existing QC data
		List<Production> eligibleProduction = allProduction.stream()
				.filter(production -> "Completed".equalsIgnoreCase(production.getStatus()))
				.filter(production -> !existingBatchIds.contains(production.getBatchId()))
				.sorted(Comparator.comparingInt(Production::getBatchId)) // Correctly sorts by batchId
				.collect(Collectors.toList());

		return eligibleProduction;

	}

	public QualityCheck getBatchById(int id) {
		try {
			return qcinterface.findById(id).orElseThrow(() -> new BatchIdNotFoundException(id));
		} catch (BatchIdNotFoundException e) {
			audit.logException(id, e); // Log the exception
			throw e; // Rethrow if you want to propagate the exception
		}
	}

	public void deleteBatch(int id) {
		try {
			if (!qcinterface.existsById(id)) {
				throw new BatchIdNotFoundException(id);
			}
			qcinterface.deleteById(id);
		} catch (BatchIdNotFoundException e) {
			audit.logException(id, e); // Log the exception
			throw e; // Rethrow if you want to propagate the exception
		}
	}

	// Method to save QC data
	public QualityCheck saveData(QualityCheck qcData) {

		Inventory inventory = new Inventory();
		inventory.setBatchId(qcData.getBatchId());
		String Model = qcData.getVehicleModel();
		String vehicleId = "";
		if (Model.equals("Apache RTR 160")) {
			vehicleId = "V101";
		} else if (Model.equals("Apache RTR 200")) {
			vehicleId = "V102";
		} else if (Model.equals("TVS Ntorq")) {
			vehicleId = "V103";
		} else if (Model.equals("TVS Jupiter")) {
			vehicleId = "V104";
		} else if (Model.equals("Star City")) {
			vehicleId = "V105";
		}
		else if (Model.equals("TVS XL100")) {
			vehicleId = "V106";
		}
		else if (Model.equals("TVS iQube Electric")) {
			vehicleId = "V107";
		}
		else {vehicleId = "V108";}

		inventory.setStock(qcData.getQcPassedUnits());
		inventory.setVehicleModel(Model);
		inventory.setVehicleId(vehicleId);
		inventory.setPlanId(qcData.getPlanId());
		qcData.setVehicleId(vehicleId);
		inventoryRepository.save(inventory);
		return qcinterface.save(qcData); // Uses MongoRepository's save() method
	}

	// Method to find QC data by id
	public Optional<QualityCheck> findById(int batchId) {
		return qcinterface.findById(batchId); // Uses MongoRepository's findById() method
	}

}
