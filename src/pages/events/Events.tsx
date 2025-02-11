// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Plus, Edit, Trash2, Search } from "lucide-react";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import ConfirmModal from "../../components/ConfirmModal";
// import { format } from "date-fns";
// import { axiosWithAuth, fetchWithAuth } from "../../utils/api";

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   location: string;
//   type: string;
//   host: string;
//   category: string;
// }

// const Events = () => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await fetchWithAuth("/api/admin/events");
//       const data = await response.json();
//       setEvents(data);
//     } catch (error) {
//       console.error("Failed to fetch events:", error);
//     }
//   };

//   const openDeleteModal = (event: Event) => {
//     setSelectedEvent(event);
//     setIsModalOpen(true);
//     console.log("Delete event:", event);
//     console.log("Selected event:", selectedEvent);
//     console.log("Is modal open:", isModalOpen);
//   };

//   const closeDeleteModal = () => {
//     setSelectedEvent(null);
//     setIsModalOpen(false);
//   };

//   const handleDelete = async () => {
//     if (!selectedEvent) return;

//     try {
//       const response = await axiosWithAuth.delete(
//         `/api/admin/events/delete/${selectedEvent.id}`
//       );

//       if (response.status !== 200) throw new Error("Failed to delete event");

//       setEvents(events.filter((event) => event.id !== selectedEvent.id));
//       closeDeleteModal();
//     } catch (error) {
//       console.error("Failed to delete event:", error);
//     }
//   };

//   // Get unique categories from events list
//   const categories = Array.from(new Set(events.map((event) => event.category)));

//   // Filter events based on search query & selected category
//   const filteredEvents = events.filter(
//     (event) =>
//       event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
//       (selectedCategory ? event.category === selectedCategory : true)
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
//         <h1 className="text-2xl font-bold">Events</h1>

//         {/* Search Bar & Category Filter */}
//         <div className="flex items-center space-x-4 w-full md:w-auto">
//           {/* Search Input */}
//           <div className="relative w-full md:w-64">
//             <Input
//               type="text"
//               placeholder="Search events..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           </div>

//           {/* Category Dropdown */}
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
//           >
//             <option value="">All Categories</option>
//             {categories.map((category) => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
//         </div>

//         <Link to="/admin/events/create">
//           <Button>
//             <Plus className="mr-2 h-4 w-4" />
//             Create Event
//           </Button>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredEvents.length > 0 ? (
//           filteredEvents.map((event) => (
//             <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
//               <h3 className="text-lg font-semibold">{event.title}</h3>
//               <p className="text-sm text-gray-600 mt-1">{event.description}</p>
//               <div className="mt-4 space-y-2">
//                 <p className="text-sm">
//                   <span className="font-medium">Date:</span>{" "}
//                   {format(new Date(event.date), "dd MMM yyyy")}
//                 </p>
//                 <p className="text-sm font-medium">
//                   Time:{" "}
//                   <span className="font-normal">
//                     {format(new Date(event.startTime), "h:mm a")} to{" "}
//                     {format(new Date(event.endTime), "h:mm a")}
//                   </span>
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium">Location:</span> {event.location}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium">Type:</span> {event.type}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium">Host:</span> {event.host}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium">Category:</span> {event.category}
//                 </p>
//               </div>
//               <div className="mt-4 flex space-x-2">
//                 <Link to={`/admin/events/${event.id}/edit`}>
//                   <Button variant="outline" size="sm">
//                     <Edit className="mr-2 h-4 w-4" />
//                     Edit
//                   </Button>
//                 </Link>
//                 <Button variant="destructive" size="sm" onClick={() => openDeleteModal(event)}>
//                   <Trash2 className="mr-2 h-4 w-4" />
//                   Delete
//                 </Button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-600 col-span-full">No events found</p>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       <ConfirmModal isOpen={isModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} />
//     </div>
//   );
// };

// export default Events;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import ConfirmModal from "../../components/ConfirmModal";
import { axiosWithAuth, fetchWithAuth } from "../../utils/api";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  host: string;
  category: string;
}

// Helper function to format the date in "dd MMM yyyy" format using en-GB locale.
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  // Using "en-GB" gives us a day-month-year order.
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

// Helper function to format the time. If minutes are zero, only the hour is shown.
const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  // Get the minutes using UTC methods since the dates are in UTC.
  const minutes = date.getUTCMinutes();
  let timeString: string;

  if (minutes === 0) {
    // Format with only the hour
    timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
      timeZone: "UTC",
    });
  } else {
    // Format with hour and minute
    timeString = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "UTC",
    });
  }

  // Remove any space before AM/PM and convert to lowercase
  return timeString.replace(" AM", "am").replace(" PM", "pm");
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetchWithAuth("/api/admin/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const openDeleteModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      const response = await axiosWithAuth.delete(
        `/api/admin/events/delete/${selectedEvent.id}`
      );

      if (response.status !== 200) throw new Error("Failed to delete event");

      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  // Get unique categories from events list
  const categories = Array.from(new Set(events.map((event) => event.category)));

  // Filter events based on search query & selected category
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? event.category === selectedCategory : true)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Events</h1>

        {/* Search Bar & Category Filter */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <Link to="/admin/events/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(event.date)}
                </p>
                <p className="text-sm font-medium">
                  Time:{" "}
                  <span className="font-normal">
                    {formatTime(event.startTime)} to {formatTime(event.endTime)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Type:</span> {event.type}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Host:</span> {event.host}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Category:</span> {event.category}
                </p>
              </div>
              <div className="mt-4 flex space-x-2">
                <Link to={`/admin/events/${event.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDeleteModal(event)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No events found</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal isOpen={isModalOpen} onClose={closeDeleteModal} onConfirm={handleDelete} />
    </div>
  );
};

export default Events;
