// src/components/VehicleSelect.js
import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import VehicleSelect from '../components/VehicleSelect';
// Predefined list of vehicles
const vehicleOptions = [
  { value: 'Apache', label: 'Apache' },
  { value: 'Ntorq', label: 'Ntorq' },
  { value: 'Breeze', label: 'Breeze' },
  { value: 'Jupiter', label: 'Jupiter' },
  { value: 'Pulsar', label: 'Pulsar' },
  { value: 'HT Roadster', label: 'HT Roadster' },
  { value: 'Duke', label: 'Duke' },
  { value: 'R15', label: 'R15' },
  { value: 'Activa', label: 'Activa' },
  { value: 'Beep', label: 'Beep' },
  // Add more vehicles as needed
];

// Custom styles for React Select to match Tailwind CSS
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db', // Tailwind blue-500 or gray-300
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': {
      borderColor: '#3b82f6',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#bfdbfe', // Tailwind blue-200
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#1e3a8a', // Tailwind blue-900
    fontWeight: '500',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#1e3a8a',
    ':hover': {
      backgroundColor: '#1e40af', // Tailwind blue-800
      color: 'white',
    },
  }),
};

const VehicleSelection = ({ selectedVehicles, setSelectedVehicles, maxSelection }) => {
  // Handle selection change
  const handleChange = (selectedOptions) => {
    if (selectedOptions.length > maxSelection) {
      // Prevent adding more than maxSelection
      return;
    }
    setSelectedVehicles(selectedOptions);
  };

  // Custom message when max selection is reached
  const formatGroupLabel = (data) => (
    <div className="flex justify-between items-center">
      <span>{data.label}</span>
      <span className="text-xs text-gray-500">
        {data.options.length} options
      </span>
    </div>
  );

  return (
    <div>
      <Select
        isMulti
        name="vehicles"
        options={vehicleOptions}
        className="basic-multi-select"
        classNamePrefix="select"
        value={selectedVehicles}
        onChange={handleChange}
        styles={customStyles}
        placeholder="Select up to 6 vehicles..."
        noOptionsMessage={() => 'No vehicles found'}
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

export default VehicleSelection;
