import React from 'react';
import { Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  email: string;
  registeredAt: string;
}

interface EventRegistrations {
  eventTitle: string;
  count: number;
}

const Registrations = () => {
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);
  const [chartData, setChartData] = React.useState<EventRegistrations[]>([]);

  React.useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations');
      const data = await response.json();
      setRegistrations(data);

      // Process data for chart
      const eventCounts = data.reduce((acc: { [key: string]: number }, reg: Registration) => {
        acc[reg.eventTitle] = (acc[reg.eventTitle] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(eventCounts).map(([eventTitle, count]) => ({
        eventTitle,
        count,
      }));

      setChartData(chartData);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  };

  const exportRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registrations.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to export registrations:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Users className="mr-2 h-6 w-6" />
          <h1 className="text-2xl font-bold">Registrations</h1>
        </div>
        <Button onClick={exportRegistrations}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Registration Statistics</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="eventTitle"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
          <div className="space-y-4">
            {registrations.slice(0, 5).map((registration) => (
              <div
                key={registration.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{registration.userName}</p>
                  <p className="text-sm text-gray-500">{registration.email}</p>
                  <p className="text-sm text-gray-500">
                    Event: {registration.eventTitle}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(registration.registeredAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">All Registrations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Event</th>
                <th className="text-left p-4">Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} className="border-b">
                  <td className="p-4">{registration.userName}</td>
                  <td className="p-4">{registration.email}</td>
                  <td className="p-4">{registration.eventTitle}</td>
                  <td className="p-4">
                    {new Date(registration.registeredAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Registrations;