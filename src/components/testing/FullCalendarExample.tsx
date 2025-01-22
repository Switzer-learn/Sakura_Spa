// FullCalendarWithResources.tsx
import React, { useState } from "react";
import FullCalendar, {
  EventInput,
  DateSelectArg,
  EventClickArg,
  ResourceInput,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid"; // Day/Week view
import interactionPlugin from "@fullcalendar/interaction"; // Drag, drop, and event click
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid"; // Resource view
//import "./FullCalendar.css"; // Custom styling if needed



const FullCalendarWithResources: React.FC = () => {
  // State for events
  const [events, setEvents] = useState<EventInput[]>([
    {
      id: "1",
      title: "Appointment 1",
      start: new Date().toISOString(), // Default event: today
      end: new Date(new Date().getTime() + 30 * 60 * 1000).toISOString(), // Ends in 30 minutes
      resourceId: "therapist-1", // Assign to Therapist 1
    },
  ]);

  // Therapist resources
  const resources: ResourceInput[] = [
    { id: "therapist-1", title: "Therapist 1" },
    { id: "therapist-2", title: "Therapist 2" },
    { id: "therapist-3", title: "Therapist 3" },
  ];

  // Function to handle new event creation (e.g., drag or click on the calendar)
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Enter a title for your appointment:");
    if (title) {
      const newEvent = {
        id: String(events.length + 1), // Unique ID
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        resourceId: selectInfo.resource?.id, // Assign to selected resource (therapist)
      };
      setEvents([...events, newEvent]); // Add to events
    }
    selectInfo.view.calendar.unselect(); // Clear selection
  };

  // Function to handle event click (e.g., delete or edit an event)
  const handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Do you want to delete the event: '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove(); // Remove the event from the calendar
    }
  };

  return (
    <div className="App">
      <h1>Therapist Scheduling with Columns</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]} // Add resource plugin
        headerToolbar={{
          left: "prev,next today", // Navigation buttons
          center: "title", // Calendar title
          right: "resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth", // View options
        }}
        initialView="resourceTimeGridWeek" // Default view with resources
        editable={true} // Allow drag-and-drop
        selectable={true} // Allow selection
        selectMirror={true} // Visual feedback
        dayMaxEvents={true} // Limit events per day
        events={events} // Bind events
        resources={resources} // Therapist columns
        select={handleDateSelect} // Handle date selection
        eventClick={handleEventClick} // Handle event clicks
      />
    </div>
  );
};

export default FullCalendarWithResources;
