import React, { useEffect, useRef, useState } from "react";
import appointmentServices from "../../services/appointmentServices";
import { useNavigate, useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

const GoogleCalendarEmbed = () => {
  return (
    <iframe
      src="https://calendar.google.com/calendar/embed?src=smshoaib2001%40gmail.com&ctz=Asia%2FKarachi"
      style={{ style: 0 }}
      width="800"
      height="600"
      frameborder="0"
      scrolling="no"
    ></iframe>
  );
};

const Page = () => {
  const { doctorId } = useParams();
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [patientInfo, setPatientInfo] = useState({
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    patientPhoneNumber: "",
  });
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [value, setValue] = useState(dayjs("2024-08-17"));
  // console.log("date value >> ", value.$d);
  const navigate = useNavigate();
  const [availability, setAvailability] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setPatientInfo((values) => ({ ...values, [name]: value }));
  };

  // Handle service selection
  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceId)) {
        return prevSelected.filter((id) => id !== serviceId);
      } else {
        return [...prevSelected, serviceId];
      }
    });
  };

  const times = ["12:00", "14:00", "09:00", "15:00"];
  const handleClick = (time) => {
    setSelectedTime(time);
  };

  // console.log("selectedServices >> ", selectedServices);

  const validateForm = () => {
    const newErrors = {};

    if (!patientInfo.patientFirstName) {
      newErrors.patientFirstName = "First name is required";
    }

    if (!patientInfo.patientLastName) {
      newErrors.patientLastName = "Last name is required";
    }

    if (!selectedServices) {
      newErrors.selectedServices = "Please select a service";
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!patientInfo.patientEmail) {
      newErrors.patientEmail = "Email is required";
    } else if (!emailRegex.test(patientInfo.patientEmail)) {
      newErrors.patientEmail = "Invalid email format";
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!patientInfo.patientPhoneNumber) {
      newErrors.patientPhoneNumber = "Phone number is required";
    } else if (!phoneRegex.test(patientInfo.patientPhoneNumber)) {
      newErrors.patientPhoneNumber = "Invalid phone number format";
    }

    if (!selectedDate) {
      newErrors.selectedDate = "Please select a date";
    }

    if (!selectedTime) {
      newErrors.selectedTime = "Please choose a time";
    }

    if (!accountNumber) {
      newErrors.accountNumber = "Account number is required";
    } else if (accountNumber.length !== 16) {
      newErrors.accountNumber = "Account number must be 16 digits";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // setSelectedDate("");
      // setSelectedTime(null);
      // setSelectedServices([]);
      // setAccountNumber("");
      // setPatientInfo({
      //   patientFirstName: "",
      //   patientLastName: "",
      //   patientEmail: "",
      //   patientPhoneNumber: "",
      // });
      setErrors({});
      console.log(patientInfo);

      const appointmentData = {
        selectedServices,
        selectedDate,
        selectedTime,
        patientFirstName: patientInfo.patientFirstName,
        patientLastName: patientInfo.patientLastName,
        patientEmail: patientInfo.patientEmail,
        patientPhoneNumber: patientInfo.patientPhoneNumber,
        accountNumber,
      };

      try {
        const response = await fetch(
          "http://localhost:8000/api/book-appointment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(appointmentData),
          }
        );

        if (response.ok) {
          console.log("Appointment booked successfully");
        } else {
          console.error("Error booking appointment");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      console.log("Validation failed");
    }
  };

  useEffect(() => {
    document.title = "Book An Appointment";
    const fetchServices = async () => {
      const res = await appointmentServices.fetchServices(doctorId);
      setServices(res.services);
    };

    fetchServices();
  }, [doctorId]);

  const isFirstRender = useRef(true); // Track if it's the first render
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/appointments/check-availability",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              doctorId,
              selectedServices,
              selectedDate: value,
              timeSlot,
            }),
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to check availability: ${res.statusText}`);
        }

        const resp = await res.json();
        console.log("Availability API response >> ", resp);
        if (resp.status === 200) {
          setAvailability(true);
        }
      } catch (error) {
        console.error("Error checking availability >> ", error);
      }
    };

    if (isFirstRender.current) {
      isFirstRender.current = false; // Skip the first render
      return;
    }

    if (value) {
      checkAvailability();
    }
  }, [value]);

  return (
    <div className="w-full px-4">
      <div className="relative mx-auto mt-20 mb-20 max-w-screen-lg overflow-hidden rounded-xl bg-red-400/60 py-32 text-center shadow-xl shadow-gray-300">
        <h1 className="mt-2 px-8 text-3xl font-bold text-white md:text-5xl">
          Book an appointment
        </h1>
        <p className="mt-6 text-lg text-white">
          Get an appointment with our experienced doctors.
        </p>
        <img
          className="absolute top-0 left-0 -z-10 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1504672281656-e4981d70414b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
          alt=""
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-screen-lg px-6 pb-20"
      >
        <div className="">
          <p className="font-serif text-xl font-bold text-blue-900">
            Select a service
          </p>
          <div className="mt-4 grid w-full gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((ser) => {
              const isSelected = selectedServices.includes(ser._id);

              return (
                <div
                  className={`relative custom-shadow rounded-2xl cursor-pointer ${
                    isSelected ? "bg-red-600 text-white" : ""
                  }`}
                  key={ser._id}
                  onClick={() => handleServiceSelection(ser._id)} // Call the selection handler
                >
                  <input
                    className="peer hidden"
                    id={`service-${ser._id}`}
                    type="checkbox" // Use checkbox for multiple selections
                    name="services"
                    checked={isSelected} // Bind checked state
                    onChange={() => handleServiceSelection(ser._id)} // Ensure state updates on change
                  />
                  <span
                    className={`absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 ${
                      isSelected ? "border-red-400" : "border-red-300"
                    } bg-white peer-checked:border-red-400`}
                  ></span>
                  <label
                    className={`flex h-full cursor-pointer flex-col gap-4 rounded-2xl p-6 ${
                      isSelected
                        ? "bg-red-600 text-white"
                        : "bg-white text-black"
                    }`}
                    htmlFor={`service-${ser._id}`}
                  >
                    <span className="mt-2 font-medium">
                      {ser.serviceTitle} - {ser.serviceSubtitle}
                    </span>
                    <span className="text-xs">
                      {ser.price === 0 ? (
                        <span>Price varies</span>
                      ) : (
                        <span>US${ser.price}</span>
                      )}{" "}
                      - {ser.duration} mins
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
          {errors.selectedServices && (
            <p className="text-red-500 text-sm mt-2">
              {errors.selectedServices}
            </p>
          )}
        </div>

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
        <div className="">
          <p className="mt-8 font-serif text-xl font-bold text-blue-900">
            Choose a time slot
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
            {services.map((service) =>
              service.timeSlots.map((timeSlot) => (
                <button
                  key={timeSlot._id} // Use timeSlot._id for unique keys
                  onClick={() => handleClick(timeSlot)} // Pass timeSlot to handleClick
                  className={`rounded-lg px-4 py-2 font-medium ${
                    selectedTime === timeSlot
                      ? "bg-red-600 text-white"
                      : "bg-red-100 text-red-900"
                  } active:scale-95 outline-none`}
                >
                  {timeSlot.start} - {timeSlot.end}
                </button>
              ))
            )}
            {services.timeSlots?.map((time, index) => (
              <button
                key={index}
                onClick={() => handleClick(time)}
                className={`rounded-lg px-4 py-2 font-medium ${
                  selectedTime === time
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-900"
                } active:scale-95 outline-none`}
              >
                {time.start} - {time.end}
              </button>
            ))}
          </div>
          {errors.selectedTime && (
            <p className="text-red-500 text-sm mt-2">{errors.selectedTime}</p>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <p className="mt-8 font-serif text-xl font-bold text-blue-900">
            Contact info
          </p>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="patientFirstName"
                value={patientInfo.patientFirstName}
                onChange={handleChange}
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="First name"
              />
              {errors.patientFirstName && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.patientFirstName}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="patientLastName"
                value={patientInfo.patientLastName}
                onChange={handleChange}
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="Last name"
              />
              {errors.patientLastName && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.patientLastName}
                </p>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                name="patientEmail"
                value={patientInfo.patientEmail}
                onChange={handleChange}
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="Email"
              />
              {errors.patientEmail && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.patientEmail}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="patientPhoneNumber"
                value={patientInfo.patientPhoneNumber}
                onChange={handleChange}
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="Phone number"
              />
              {errors.patientPhoneNumber && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.patientPhoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="">
          <p className="mt-8 font-serif text-xl font-bold text-blue-900">
            Payment
          </p>
          <div className="mt-4">
            <input
              type="text"
              name="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
              placeholder="4242 4242 4242 4242 4242"
            />
          </div>
          {errors.accountNumber && (
            <p className="text-red-500 text-sm mt-2">{errors.accountNumber}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-8 w-56 rounded-full border-8 border-red-500 bg-red-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Page;
