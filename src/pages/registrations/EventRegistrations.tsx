import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { fetchWithAuth } from '../../utils/api';

const EventRegistrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = React.useState<any[]>([]);
  const [eventTitle, setEventTitle] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [registrationsRes, eventRes] = await Promise.all([
          fetchWithAuth(`/api/admin/events/${eventId}/registrations`),
          fetchWithAuth(`/api/admin/events/${eventId}`)
        ]);
        
        const registrationsData = await registrationsRes.json();
        const eventData = await eventRes.json();
        
        setRegistrations(registrationsData.data);
        setEventTitle(eventData.title);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, [eventId]);

  const handleExport = async () => {
    try {
      const response = await fetchWithAuth(`/api/admin/export/events/${eventId}/registrations`);
      if (!response.ok) {
        throw new Error('Failed to export registrations');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event-${eventId}-registrations.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Error exporting registrations:', error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Registrations for {eventTitle}</h1>
        <Button onClick={handleExport}>Export to CSV</Button>
      </div>
      
      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">College</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Register Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map((reg, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{reg.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reg.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reg.collegeName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{reg.registerNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(reg.registrationDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventRegistrations;