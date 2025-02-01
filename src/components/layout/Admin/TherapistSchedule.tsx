import { useEffect, useState } from "react";
import {api} from '../../../services/api'

const TherapistSchedule = () => {
  const startHour = 8; // 8 AM
  const endHour = 21; // 8 PM
  const timeSlots = Array.from(
    { length: (endHour - startHour) * 2 },
    (_, index) => {
      const hour = Math.floor(index / 2) + startHour;
      const minutes = index % 2 === 0 ? "00" : "30";
      return `${hour}:${minutes}`;
    }
  );
  
  const [therapistNames,setTherapistNames] = useState<any[]>([])
  const [selectedCell, setSelectedCell] = useState<{ therapist: string; time: string } | null>(null);

    useEffect(()=>{
      async function fetchTherapistData(){
        const response = await api.getTherapist();
        setTherapistNames(response.map((therapist)=>{
          return therapist.full_name;
        })||[]);
      }
      fetchTherapistData();
    },[])

  const handleCellClick = (therapist: string, time: string) => {
    setSelectedCell({ therapist, time });
    alert(`Scheduled: ${therapist} at ${time}`);
  };



  return (
    <div className="container mx-auto p-6 min-h-screen max-h-screen overflow-y-auto overflow-x-auto bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Therapist Schedule</h2>
      <div className='flex justify-between'>
        <p>Date : {new Date().getDate()} - {new Date().getMonth()+1} - {new Date().getFullYear()}</p>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${therapistNames.length + 1}, minmax(100px, 1fr))` }}>
        {/* Header Row */}
        <div className="bg-gray-800 text-white font-bold py-2 px-4 border">Time</div>
        {therapistNames.map((therapist, index) => (
          <div key={index} className="bg-gray-800 text-white font-bold py-2 px-4 border text-center">
            {therapist}
          </div>
        ))}
        
        {/* Time slots + Therapist Columns */}
        {timeSlots.map((time, rowIndex) => (
          <>
            <div key={time} className="bg-gray-300 font-medium py-2 px-4 border text-center">{time}</div>
            {therapistNames.map((therapist, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`py-2 px-4 border text-center cursor-pointer transition-all duration-200 hover:bg-blue-200 ${
                  selectedCell?.therapist === therapist && selectedCell?.time === time ? "bg-blue-400 text-white" : ""
                }`}
                onClick={() => handleCellClick(therapist, time)}
              >
                -
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
};

export default TherapistSchedule;
