import { useState, useEffect } from 'react';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from 'react-calendar-timeline';
//import 'react-calendar-timeline/lib/Timeline.css';
//import { format } from 'date-fns';
import { TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface Therapist {
  employee_id: string;
  full_name: string;
}

interface Appointment {
  id: string;
  group: string; // therapist_id
  title: string;
  start_time: Date;
  end_time: Date;
}

const SpaSchedule = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);

  // Dummy therapists (replace with API call)
  useEffect(() => {
    setTherapists([
      { employee_id: 'T1', full_name: 'Sarah Wilson' },
      { employee_id: 'T2', full_name: 'Mike Johnson' },
      { employee_id: 'T3', full_name: 'Emma Davis' },
    ]);
  }, []);

  // Convert therapists to timeline groups
  const groups = therapists.map((t) => ({
    id: t.employee_id,
    title: t.full_name,
  }));

  // Convert appointments to timeline items
  const items = appointments.map((apt) => ({
    id: apt.id,
    group: apt.group,
    title: (
      <div className="p-1">
        <div className="font-medium text-sm">{apt.title}</div>
        <div className="text-xs opacity-75">
          {format(apt.start_time, 'HH:mm')} - {format(apt.end_time, 'HH:mm')}
        </div>
      </div>
    ),
    start_time: apt.start_time,
    end_time: apt.end_time,
  }));

  // Handle time slot selection
  const handleTimeSelect = (start: Date, end: Date) => {
    const title = prompt('Enter treatment name:');
    if (title && selectedTherapist) {
      const newAppointment = {
        id: `apt-${Date.now()}`,
        group: selectedTherapist,
        title,
        start_time: start,
        end_time: end,
      };
      setAppointments([...appointments, newAppointment]);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Spa Therapist Schedule</h1>

        {/* Therapist Selection */}
        <div className="flex gap-2 mb-4">
          {therapists.map((t) => (
            <button
              key={t.employee_id}
              onClick={() => setSelectedTherapist(t.employee_id)}
              className={`px-4 py-2 rounded-lg ${
                selectedTherapist === t.employee_id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t.full_name}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Timeline
            groups={groups}
            items={items}
            defaultTimeStart={new Date().setHours(8, 0, 0)}
            defaultTimeEnd={new Date().setHours(20, 0, 0)}
            onCanvasClick={(groupId, time, e) => {
              if (!selectedTherapist) return;
              const start = new Date(time);
              const end = new Date(time + 3600000); // 1 hour
              handleTimeSelect(start, end);
            }}
          >
            <TimelineHeaders>
              <SidebarHeader>
                {({ getRootProps }) => (
                  <div {...getRootProps()} className="bg-gray-50 border-r border-gray-200" />
                )}
              </SidebarHeader>
              <DateHeader unit="hour" />
            </TimelineHeaders>
          </Timeline>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <PlusCircleIcon className="w-4 h-4" />
          <span>Click on timeline to add appointments</span>
          <TrashIcon className="w-4 h-4 ml-4" />
          <span>Right-click appointments to delete</span>
        </div>
      </div>
    </div>
  );
};

export default SpaSchedule;