import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ScatterPlotComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={400}>
    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="PlannedProductionUnits" name="Planned Units" />
      <YAxis dataKey="amountLoss" name="Amount Loss" />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Scatter name="Units vs. Loss" data={data} fill="#8884d8" />
    </ScatterChart>
  </ResponsiveContainer>
);
