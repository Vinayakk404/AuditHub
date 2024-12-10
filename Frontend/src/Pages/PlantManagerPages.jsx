// src/pages/PlantManagerPage.jsx

import React, { useState, useEffect } from "react";
import CalendarComponent from "../Components/CalendarComponent";
import ProductionPlansList from "../Components/ProductionPlansList";
import ProductionEntryForm from "../Components/ProductionEntryForm";
// import Charts from '../components/Charts';
import { fetchProductionData } from "../services/api";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";
import { isToday, format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import Header from "../Components/Header";
import { FaCalendar, FaCalendarCheck, FaRegCalendarAlt } from "react-icons/fa";
import Logout from "../Components/Logout";

const PlantManagerPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [productionPlans, setProductionPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId] = useState(null);

  const params = useParams();

  const plantId = params.plantId; // Assuming Plant Manager is for Plant-1

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (selectedDate) {
      fetchPlansForDate(selectedDate);
    }
  }, [selectedDate]);

  const todayDate = (formattedDates) => {
    const now = new Date();
    const offset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istNow = new Date(now.getTime() + offset);

    // Format current IST date as YYYY-MM-DD
    const todayIST = istNow.toISOString().slice(0, 10);
    // console.log(todayIST);
    // Compare the formatted dates
    return formattedDates.toISOString().slice(0, 10) === todayIST;
  };

  const fetchPlansForDate = async (date) => {
    setLoading(true);
    const formattedDate = format(new Date(date), "yyyy-MM-dd");
    try {
      const response = await fetchProductionData(plantId);
      // Filter plans for the selected date
      console.log(response.data);
      const filteredPlans = response.data.filter(
        (plan) => plan.date === formattedDate
      );

      setProductionPlans(filteredPlans);
      if (filteredPlans.length > 0) {
        setPlanId(filteredPlans[0].planId); // Assuming all plans for the day have the same planId
      } else {
        setPlanId(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching production data:", error);
      toast.warn("U are all up to date");
      setLoading(false);
    }
  };

  return (
    <div className="flex container w-screen  p-4">
      <aside className="w-96 bg-white shadow-md p-6 text-center h-[2200px]">
        <h1 className="text-3xl font-bold mb-6 flex justify-center ">
          <FaRegCalendarAlt className="mr-3" />
          Calendar
        </h1>

        <CalendarComponent onDateChange={handleDateChange} />
        <Logout />
      </aside>
      <div className="ml-14 w-screen">
        <Header
          title={`Welcome Plant Manager`}
          subText="Lets Complete our daily tasks"
        />
        {loading ? (
          <Loader />
        ) : (
          selectedDate && (
            <div className="mt-6">
              <ProductionPlansList plans={productionPlans} />

              {todayDate(new Date(selectedDate)) &&
                planId &&
                productionPlans[0].status == "Pending" && (
                  <ProductionEntryForm
                    planId={planId}
                    productionPlans={productionPlans}
                    fetchPlansForDate={fetchPlansForDate}
                  />
                )}
              {/* <Charts plans={productionPlans} selectedDate={format(new Date(selectedDate), 'yyyy-MM-dd')} /> */}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PlantManagerPage;
