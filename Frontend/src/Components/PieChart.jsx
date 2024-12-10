import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

export const PieCharts = ({ data }) => {
  // Group data by status
  const statusData = data.reduce((acc, item) => {
    const existing = acc.find((d) => d.status === item.Status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.Status, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} fill="#8884d8">
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
