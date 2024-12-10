import React, { useEffect, useState } from "react";
import axios from "../utils/axoisConfig";
import { BarCharts } from "../Components/BarChart";
import { PieCharts } from "../Components/PieChart";
import { LineCharts } from "../Components/LineChart";
import { StackedChart } from "../Components/StackedbarChart";
import { StackedBarChartComponent } from "../Components/StackedbarChart";
const ChartPages = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/productionData")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Production Data Visualizations</h1>
      <BarCharts data={data} />
      <PieCharts data={data} />
      <LineCharts data={data} />
      <StackedChart data={data} />
      {/* <ScatterPlot data={data} /> */}
    </div>
  );
};

export default ChartPages;
