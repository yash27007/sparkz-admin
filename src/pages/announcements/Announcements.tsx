import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Megaphone, Edit, Trash2 } from 'lucide-react';
import { axiosWithAuth, fetchWithAuth } from '../../utils/api';
import ConfirmModal from '../../components/ConfirmModal';

const announcementSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface Announcement {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = React.useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
  });

  React.useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetchWithAuth('/api/admin/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };
  const onSubmit = async (data: AnnouncementFormData) => {
    try {
      let response: { data: Announcement; ok: boolean; status: number };
      
      if (editingId) {
        // Update existing announcement
        response = await axiosWithAuth.put(`/api/admin/announcements/${editingId}`, data);
  
        // Update the state immediately after a successful update
        setAnnouncements(announcements.map(a => a.id === editingId ? { ...a, message: data.message, updatedAt: new Date().toISOString() } : a));
      } else {
        // Create new announcement
        response = await axiosWithAuth.post('/api/admin/announcements', data);
  
        // Add the new announcement to the state
        setAnnouncements(prev => [...prev, { ...response.data, message: data.message }]);
      }
  
      if (response.status !== 200) throw new Error('Failed to save announcement');
  
      // Reset the form to clear the input fields and set the form to its initial state
      reset();  // Make sure reset is called with no arguments to clear everything
      setEditingId(null); // Ensure we're not in editing mode after submission
  
    } catch (error) {
      console.error('Failed to save announcement:', error);
    }
  };
  
  
  const handleDelete = async () => {
    if (announcementToDelete) {
      try {
        const response = await axiosWithAuth.delete(`/api/admin/announcements/${announcementToDelete}`);
        if (response.status !== 200) throw new Error('Failed to delete announcement');

        // Remove the deleted announcement from the state immediately
        setAnnouncements(announcements.filter(a => a.id !== announcementToDelete));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Failed to delete announcement:', error);
      }
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    reset({
      message: announcement.message,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Megaphone className="mr-2 h-6 w-6" />
        <h1 className="text-2xl font-bold">Announcements</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            {...register('message')}
            className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
          />
          {errors.message && (
            <p className="text-sm text-red-500">{errors.message.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          {editingId && (
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => {
                setEditingId(null);
                reset();
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">
            {editingId ? 'Update' : 'Create'} Announcement
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white p-6 rounded-lg shadow space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-700">{announcement.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {new Date(announcement.createdAt).toLocaleDateString()}
                  {announcement.updatedAt !== announcement.createdAt && 
                    ` (Updated: ${new Date(announcement.updatedAt).toLocaleDateString()})`
                  }
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(announcement)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setAnnouncementToDelete(announcement.id);
                    setIsModalOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Modal for Deletion */}
      <ConfirmModal
        isOpen={isModalOpen}
        message="Are you sure you want to delete this announcement?"
        onConfirm={handleDelete}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Announcements;
