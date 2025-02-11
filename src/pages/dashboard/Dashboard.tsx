import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchWithAuth } from '@/utils/api';

interface DashboardStats {
  totalEvents: number;
  totalRegistrations: number;
  totalUsers: number;
  eventRegistrations: Array<{
    eventId: string;
    eventTitle: string;
    registrationsCount: number;
  }>;
  upcomingEvents: Array<{ id: string; title: string; date: string; registrations: number }>;
}

const Dashboard = () => {
  const [stats, setStats] = React.useState<DashboardStats>({
    totalEvents: 0,
    totalRegistrations: 0,
    totalUsers: 0,
    eventRegistrations: [],
    upcomingEvents: [],
  });

  React.useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [eventsRes, usersRes, registrationsRes, registrationsByEventRes] = await Promise.all([
        fetchWithAuth('/api/admin/events'),
        fetchWithAuth('/api/admin/users'),
        fetchWithAuth('/api/admin/stats/registrations/total'),
        fetchWithAuth('/api/admin/stats/registrations/events'),
      ]);

      const events = await eventsRes.json();
      const users = await usersRes.json();
      const totalRegistrations = await registrationsRes.json();
      const registrationsByEvent = await registrationsByEventRes.json();

      const currentDate = new Date();
      const upcomingEvents = events
        .filter((event: any) => new Date(event.date) >= currentDate)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5)
        .map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          registrations: registrationsByEvent.data.find((e: any) => e.eventId === event.id)?.registrationsCount || 0,
        }));

      setStats({
        totalEvents: events.length,
        totalUsers: users.data.length,
        totalRegistrations: totalRegistrations.total,
        eventRegistrations: registrationsByEvent.data,
        upcomingEvents,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const handleRegistraionsExport = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/export/users');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registered_users.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Failed to export registrations:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <LayoutDashboard className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Events Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        {/* Total Registrations Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Registrations</p>
              <p className="text-2xl font-bold">{stats.totalRegistrations}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Registrations List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Event Registrations</h2>
              <Button variant="outline" size="sm" onClick={handleRegistraionsExport}>
                Export All Registrations
              </Button>
          </div>
          <div className="space-y-4">
            {stats.eventRegistrations.map((event) => (
              <div
                key={event.eventId}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{event.eventTitle}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm font-medium mr-4">
                    {event.registrationsCount} registrations
                  </p>
                  <Link to={`/admin/events/${event.eventId}/registrations`}>
                    <Button variant="link" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <Link to="/admin/events">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {stats.upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {event.registrations} registrations
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;