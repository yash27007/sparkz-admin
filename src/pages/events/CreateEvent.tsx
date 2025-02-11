import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { axiosWithAuth} from '../../utils/api';
import { Toast } from '@radix-ui/react-toast';

const EventCategory = {
  DANCE: 'DANCE',
  MUSIC: 'MUSIC',
  ART: 'ART',
  FUN_EVENT: 'FUN_EVENT',
  LITERATURE: 'LITERATURE',
  GAMING: 'GAMING',
  FASHION: 'FASHION',
  MEDIA: 'MEDIA',
  DRAMATICS: 'DRAMATICS',
  QUIZARD: 'QUIZARD',
} as const;

const EventType = {
  CLUB: 'CLUB',
  PROSHOW: 'PROSHOW',
} as const;

const EventHost = {
  PYROS: 'PYROS',
  GREEN_ARMY: 'GREEN_ARMY',
  YUVA_TOURISM: 'YUVA_TOURISM',
  NSS: 'NSS',
  VISHAKA_CLUB: 'VISHAKA_CLUB',
  PHOTOGRAPHY_CLUB: 'PHOTOGRAPHY_CLUB',
  NATURE_CLUB: 'NATURE_CLUB',
  TAMIL_MANDRAM: 'TAMIL_MANDRAM',
  YRC: 'YRC',
} as const;

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(1, 'Location is required'),
  type: z.nativeEnum(EventType),
  host: z.nativeEnum(EventHost),
  category: z.nativeEnum(EventCategory),
});

type EventFormData = z.infer<typeof eventSchema>;

const CreateEvent = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      // console.log(data);
      const response = await axiosWithAuth.post('/api/admin/events/create', data);

      if (response.status !== 201) throw new Error('Failed to create event');
      <Toast
      >Event Created Successfully</Toast>
      navigate('/admin/events');
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center mb-6">
        <Calendar className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Create New Event</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Event Type</Label>
            <Select onValueChange={(value) => setValue('type', value as keyof typeof EventType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EventType).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" {...register('date')} />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input type="time" id="startTime" {...register('startTime')} />
            {errors.startTime && (
              <p className="text-sm text-red-500">{errors.startTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input type="time" id="endTime" {...register('endTime')} />
            {errors.endTime && (
              <p className="text-sm text-red-500">{errors.endTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register('location')} />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Select onValueChange={(value) => setValue('host', value as keyof typeof EventHost)}>
              <SelectTrigger>
                <SelectValue placeholder="Select host" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EventHost).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.host && (
              <p className="text-sm text-red-500">{errors.host.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setValue('category', value as keyof typeof EventCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EventCategory).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/events')}
          >
            Cancel
          </Button>
          <Button type="submit">Create Event</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;