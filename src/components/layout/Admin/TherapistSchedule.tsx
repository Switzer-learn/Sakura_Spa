import { useEffect, useState } from "react";
import { api } from "../../../services/api";

const TherapistSchedule = () => {
  const startHour = 8; // 8 AM
  const endHour = 21; // 9 PM
  const timeSlots = Array.from({ length: (endHour - startHour) * 2 }, (_, index) => {
    const hour = Math.floor(index / 2) + startHour;
    const minutes = index % 2 === 0 ? "00" : "30";
    return `${hour}:${minutes}`;
  });

  const getFormattedDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [therapistNames, setTherapistNames] = useState<string[]>([]);
  const [transactionData, setTransactionData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(new Date()));
  const [assignedColors, setAssignedColors] = useState<{ [customer: string]: string }>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const therapists = await api.getTherapist();
        const transactions = await api.getTransactions();

        if (therapists) {
          setTherapistNames(therapists.map((therapist) => therapist.full_name));
        }

        if (transactions) {
          const filteredTransactions = transactions.filter((transaction) =>
            transaction.schedule.slice(0, 10) === selectedDate
          );

          setTransactionData(filteredTransactions);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    const uniqueCustomers = [...new Set(transactionData.map((t) => t.customer_name))];
    const colors = uniqueCustomers.reduce((acc, customer) => {
      acc[customer] = `hsl(${Math.random() * 360}, 70%, 70%)`; // Random HSL color
      return acc;
    }, {} as { [customer: string]: string });

    setAssignedColors(colors);
  }, [transactionData]);

  const getTransactionForSlot = (therapist: string, time: string) => {
    return transactionData.find((transaction) => {
      if (transaction.therapist_name !== therapist) return false;

      const startTime = new Date(transaction.schedule);
      const startHour = startTime.getHours();
      const startMinutes = startTime.getMinutes();
      const startTimeFormatted = `${startHour}:${startMinutes === 0 ? "00" : "30"}`;

      const durationSlots = Math.ceil(transaction.duration / 30); // How many slots to block
      const startIndex = timeSlots.indexOf(startTimeFormatted);

      return startIndex !== -1 && timeSlots.slice(startIndex, startIndex + durationSlots).includes(time);
    });
  };

  return (
    <div className="container mx-auto p-6 min-h-screen max-h-screen overflow-y-auto overflow-x-auto bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Therapist Schedule</h2>

      {/* Date Picker */}
      <div className="flex justify-between mb-4">
        <label className="font-medium">
          Select Date: 
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="ml-2 px-3 py-1 border rounded"
          />
        </label>
      </div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${therapistNames.length + 1}, minmax(100px, 1fr))` }}
      >
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
            {therapistNames.map((therapist, colIndex) => {
              const transaction = getTransactionForSlot(therapist, time);
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`py-2 px-4 border text-center cursor-pointer transition-all duration-200 ${
                    transaction ? "text-white" : "hover:bg-blue-200"
                  }`}
                  style={{ backgroundColor: transaction ? assignedColors[transaction.customer_name] : "transparent" }}
                >
                  {transaction ? transaction.customer_name : "-"}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
};

export default TherapistSchedule;
