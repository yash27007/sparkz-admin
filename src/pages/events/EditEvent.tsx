import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { axiosWithAuth, fetchWithAuth } from '../../utils/api';
import { format } from 'date-fns';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(1, 'Location is required'),
});

type EventFormData = z.infer<typeof eventSchema>;

const EditEvent = () => {
  const { eventId } = useParams<{ eventId: string }>(); // Get eventId from URL
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetchWithAuth(`/api/admin/events/${eventId}`);
        const eventData = await response.json();
        if (response.ok) {
          // Convert ISO date and time to proper formats
          setValue('title', eventData.title);
          setValue('date', format(new Date(eventData.date), 'yyyy-MM-dd')); // Format for <input type="date">
          setValue('startTime', format(new Date(eventData.startTime), 'HH:mm')); // Format for <input type="time">
          setValue('endTime', format(new Date(eventData.endTime), 'HH:mm')); // Format for <input type="time">
          setValue('location', eventData.location);
        } else {
          console.error('Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, setValue]);

  const onSubmit = async (data: EventFormData) => {
    try {
      const response = await axiosWithAuth.patch(`/api/admin/events/update/${eventId}`, data);
      if (response.status === 200) {
        navigate('/admin/events'); // Redirect back to events list
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (loading) return <p>Loading event data...</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" {...register('date')} />
          {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input type="time" id="startTime" {...register('startTime')} />
          {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input type="time" id="endTime" {...register('endTime')} />
          {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location')} />
          {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/events')}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default EditEvent;
