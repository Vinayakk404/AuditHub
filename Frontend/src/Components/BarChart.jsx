import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const BarCharts = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="planId" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="plannedProductionUnits" fill="#8884d8" name="Planned Units" />
      <Bar dataKey="actualProductionUnits" fill="#82ca9d" name="Actual Units" />
    </BarChart>
  </ResponsiveContainer>
);
