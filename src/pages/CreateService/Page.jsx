import React, { useEffect, useState } from "react";
import appointmentServices from "../../services/appointmentServices";
import { useParams } from "react-router-dom";

const Page = () => {
  const { doctorId } = useParams();
  console.log("doctorId >> ", doctorId);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);

  const times = ["12:00", "14:00", "09:00", "15:00"];
  const handleClick = (time) => {
    setSelectedTime(time);
  };

  useEffect(() => {
    document.title = "Book An Appointment";
    const fetchServices = async () => {
      const res = await appointmentServices.fetchServices(doctorId);
      console.log("services data >> ", res);
      setServices(res.services);
    };

    fetchServices();
  }, []);

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

      <div className="mx-auto grid max-w-screen-lg px-6 pb-20">
        <div className="">
          <p className="font-serif text-xl font-bold text-blue-900">
            Select a service
          </p>
          <div className="mt-4 grid w-full gap-x-4 gap-y-5 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((ser, index) => {
              return (
                <div
                  className="relative custom-shadow rounded-2xl cursor-pointer"
                  key={index}
                >
                  <input
                    className="peer hidden"
                    id="radio_1"
                    type="radio"
                    name="radio"
                  />
                  <span className="absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-red-300 bg-white peer-checked:border-red-400"></span>
                  <label
                    className="flex h-full cursor-pointer flex-col gap-4 rounded-2xl p-6 peer-checked:bg-red-600 peer-checked:text-white"
                    for="radio_1"
                  >
                    <span className="mt-2- font-medium">
                      {ser.serviceTitle} - {ser.serviceSubtitle}
                    </span>
                    <span className="text-xs">
                      {ser.price == 0 ? (
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
        </div>

        <div className="">
          <p className="mt-8 font-serif text-xl font-bold text-blue-900">
            Select a date
          </p>
          <div className="relative mt-4 w-56">
            {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div> */}
            <input
              datepicker=""
              datepicker-orientation="bottom"
              type="date"
              className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-2.5 pl-10 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
              placeholder="Select date"
            />
          </div>
        </div>

        <div className="">
          <p className="mt-8 font-serif text-xl font-bold text-blue-900">
            Select a time
          </p>

          <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
            {times.map((time, index) => (
              <button
                key={index}
                onClick={() => handleClick(time)}
                className={`rounded-lg px-4 py-2 font-medium ${
                  selectedTime === time
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-900"
                } active:scale-95 outline-none`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <p className="mt-8 font-serif text-xl font-bold text-blue-900">
            Contact info
          </p>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="First name"
              />
            </div>
            <div>
              <input
                type="text"
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="Last name"
              />
            </div>
          </div>
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <input
                type="text"
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                type="text"
                className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
                placeholder="Phone number"
              />
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
              className="datepicker-input block w-full rounded-lg border border-red-300 bg-red-50 p-3.5 text-red-800 outline-none ring-opacity-30 placeholder:text-red-800 focus:ring focus:ring-red-300 sm:text-sm"
              placeholder="4242 4242 4242 4242 4242"
            />
          </div>
        </div>

        <button className="mt-8 w-56 rounded-full border-8 border-red-500 bg-red-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default Page;
