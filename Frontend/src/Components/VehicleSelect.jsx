// src/components/VehicleSelect.jsx

import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { VEHICLE_MODELS } from "../constants/vehicleModels";

// Custom styles for React Select to align with Tailwind CSS
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#bfdbfe",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#1e3a8a",
    fontWeight: "500",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#1e3a8a",
    ":hover": {
      backgroundColor: "#1e40af",
      color: "white",
    },
  }),
};

// Custom Option component to display production price and plant
const CustomOption = (props) => {
  const { innerRef, innerProps, data } = props;
  return (
    <div ref={innerRef} {...innerProps} className="flex flex-col">
      <span className="font-semibold">{data.label}</span>
      <span className="text-sm text-gray-500">Price: ₹{data.productionPrice.toLocaleString()}</span>
      <span className="text-sm text-gray-500">Plant: {data.plant}</span>
    </div>
  );
};

const VehicleSelect = ({ selectedVehicles, setSelectedVehicles, maxSelection }) => {
  const isMaxSelected = selectedVehicles.length >= maxSelection;

  // Disable options when max selection is reached
  const modifiedOptions = VEHICLE_MODELS.map((option) => ({
    ...option,
    isDisabled:
      !selectedVehicles.find((selected) => selected.value === option.value) &&
      isMaxSelected,
  }));

  const handleChange = (selectedOptions) => {
    if (selectedOptions.length > maxSelection) {
      return;
    }
    setSelectedVehicles(selectedOptions);
  };

  return (
    <div>
      <Select
        isMulti
        name="vehicles"
        options={modifiedOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        value={selectedVehicles}
        onChange={handleChange}
        styles={customStyles}
        placeholder={`Select up to ${maxSelection} vehicles...`}
        noOptionsMessage={() => "No vehicles found"}
        components={{ Option: CustomOption }}
        isClearable
      />
      <p className="mt-2 text-sm text-gray-500">
        {selectedVehicles.length}/{maxSelection} vehicles selected.
      </p>
    </div>
  );
};

VehicleSelect.propTypes = {
  selectedVehicles: PropTypes.array.isRequired,
  setSelectedVehicles: PropTypes.func.isRequired,
  maxSelection: PropTypes.number,
};

VehicleSelect.defaultProps = {
  maxSelection: 6,
};

export default VehicleSelect;
