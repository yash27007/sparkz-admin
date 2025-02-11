import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from './ui/button';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
}

interface ScannerProps {
  onClose: () => void;
}

const QRScanner: React.FC<ScannerProps> = ({ onClose }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    }, false);

    scanner.render(success, error);

    async function success(result: string) {
      scanner.clear();
      setScanning(false);
      
      try {
        console.log("QR Code Scanned:", result);
        const response = await axios.post('/admin/scan-qr', { userId: result });
        const { userName, events } = response.data;
        setUserName(userName);
        setEvents(events);
      } catch (error) {
        console.error('Error verifying QR code:', error);
      }
    }

    function error(err:unknown) {
      console.warn(err);
    }

    return () => {
      if (!scanning) {
        scanner.clear();
      }
    };
  }, [scanning]);

  const handleMarkAttendance = async (eventId: string) => {
    try {
      await axios.post('/admin/mark-attendance', { eventId });
      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">QR Code Scanner</h2>
          <Button variant="ghost" onClick={onClose}>×</Button>
        </div>

        {scanning ? (
          <div id="reader" className="w-full"></div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">User: {userName}</h3>
            <div className="space-y-2">
              <h4 className="font-medium">Registered Events:</h4>
              {events.map((event) => (
                <div key={event.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{event.title}</span>
                  <Button 
                    size="sm"
                    onClick={() => handleMarkAttendance(event.id)}
                  >
                    Mark Present
                  </Button>
                </div>
              ))}
            </div>
            <Button 
              className="w-full"
              onClick={() => setScanning(true)}
            >
              Scan Another
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScanner;