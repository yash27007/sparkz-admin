import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from './ui/button';
import Card from './ui/card';
import { axiosWithAuth } from '../utils/api';
import { Loader2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  registrationId: string;
}

interface ScannerProps {
  onClose: () => void;
}

const QRScanner: React.FC<ScannerProps> = ({ onClose }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize the scanner only if scanning is true and the scanner hasn't been created yet.
    if (scanning && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        'reader',
        { qrbox: { width: 250, height: 250 }, fps: 10 },
        false
      );

      scanner.render(
        async (result: string) => {
          try {
            await scanner.clear();
          } catch (clearErr) {
            console.error('Error clearing scanner:', clearErr);
          }
          setScanning(false);
          setLoading(true);

          try {
            // Use the correct endpoint for scanning the QR code.
            const { userId } = JSON.parse(result);
            // alert(userId);
            const response = await axiosWithAuth.post('/api/admin/scan-qr', {userId});
            const { user, registrations } = response.data;
            // Trim the name and set it if available.
            const name = user && user.name ? user.name.trim() : '';
            setUserName(name);
            setEvents(
              registrations.map((reg: any) => ({
                id: reg.eventId,
                title: reg.eventName,
                registrationId: reg.registrationId,
              }))
            );
          } catch (err) {
            console.error('QR verification failed:', err);
          }
          setLoading(false);
        },
        (error) => {
          console.error('QR scan error:', error);
        }
      );

      scannerRef.current = scanner;
    }

    // Cleanup the scanner when the component unmounts or scanning changes.
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) =>
          console.error('Failed to clear scanner on cleanup:', err)
        );
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  const handleMarkAttendance = async (registrationId: string) => {
    try {
      // Use the correct endpoint for marking attendance.
      await axiosWithAuth.post('/api/admin/mark-attendance', { registrationId });
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.registrationId !== registrationId)
      );
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const handleScanAnother = () => {
    setScanning(true);
    setUserName(null);
    setEvents([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">QR Code Scanner</h2>
          <Button variant="ghost" onClick={onClose}>
            X
          </Button>
        </div>

        {scanning ? (
          <div id="reader" className="w-full" />
        ) : loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-gray-500" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="p-4 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold">
                User: {userName && userName.length ? userName : 'Unknown'}
              </h3>
            </Card>

            <h4 className="font-medium mt-2">Registered Events:</h4>
            <div className="space-y-3">
              {events.length > 0 ? (
                events.map((event) => (
                  <Card
                    key={event.id}
                    className="p-4 flex justify-between items-center border border-gray-200 shadow-sm"
                  >
                    <span className="text-md font-medium">{event.title}</span>
                    <Button size="sm" onClick={() => handleMarkAttendance(event.registrationId)}>
                      Mark Present
                    </Button>
                  </Card>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No events found for this user.</p>
              )}
            </div>

            <Button className="w-full mt-4 bg-red-600" onClick={handleScanAnother}>
              Scan Another
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
