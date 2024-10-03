import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const DateSelection = () => {
  const [value, setValue] = useState(dayjs("2024-08-17"));

  useEffect(() => {
    const checkAvailability = async () => {
      const res = await fetch(
        "http://localhost:8000/api/appointments/check-availability",
        {
          method: "",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([]),
        }
      );
      const resp = await res.json();
      console.log("availablity api res >> ", resp);
    };
  }, []);

  return (
    <div>
      <div className="">
        <p className="mt-8 font-serif text-xl font-bold text-blue-900">
          Select a date
        </p>
        <div className="">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateCalendar", "DateCalendar"]}>
              <DemoItem>
                <DateCalendar
                  value={value}
                  onChange={(newValue) => setValue(newValue)}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>

        {/* <div className="relative mt-4 w-56">
            <input
              datepicker=""
              datepicker-orientation="bottom"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-2.5 pl-10 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
              placeholder="Select date"
            />
          </div> */}
        {errors.selectedDate && (
          <p className="text-red-500 text-sm mt-2">{errors.selectedDate}</p>
        )}
      </div>
    </div>
  );
};

export default DateSelection;
