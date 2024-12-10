// src/components/CalendarComponent.jsx

import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import PropTypes from "prop-types";

const CalendarComponent = ({ onDateChange }) => {
  const handleDateChange = (date) => {
    const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istDate = new Date(date.getTime() + offset);
    const formattedDate = istDate.toISOString().slice(0, 10);

    onDateChange(formattedDate);
  };

  return (
    <div className="calendar-container">
      <Calendar onChange={handleDateChange} />
    </div>
  );
};

CalendarComponent.propTypes = {
  onDateChange: PropTypes.func.isRequired,
};

export default CalendarComponent;
