import React, { useEffect, useState } from "react";
// import appointmentServices from "../../services/appointmentServices";
import appointmentServices from "../services/appointmentServices";
import { useNavigate, useParams } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { BASE_URL } from "../api/api";

const Scheduler = () => {
  const navigate = useNavigate();
  const session = useSession();
  const supabase = useSupabaseClient();
  const { doctorId } = useParams();
  const [dEmail, setDEmail] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const [services, setServices] = useState([]); // coming from backend which i am listing on the Scheduler

  // use states
  const [patientInfo, setPatientInfo] = useState({
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    patientPhoneNumber: "",
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedTime, setSelectedTime] = useState({});
  const [accountNumber, setAccountNumber] = useState("account number");
  const [value, setValue] = useState(dayjs());
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setPatientInfo((values) => ({ ...values, [name]: value }));
  };

  const handleClick = (time) => {
    setSelectedTime(time);
  };

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

    if (!value) {
      newErrors.value = "Please select a date";
    }

    if (!selectedTime) {
      newErrors.selectedTime = "Please choose a time";
    }

    // if (!accountNumber) {
    //   newErrors.accountNumber = "Account number is required";
    // } else if (accountNumber.length !== 16) {
    //   newErrors.accountNumber = "Account number must be 16 digits";
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    document.title = "Book An Appointment";
    const fetchServices = async () => {
      const res = await appointmentServices.fetchServices(doctorId);
      // console.log("services api hit >> ", res);
      setServices(res?.services);
      setDEmail(res?.doctorEmail);
    };

    fetchServices();
  }, [doctorId]);

  async function signOut() {
    await supabase.auth.signOut();
  }

  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceId)) {
        return prevSelected.filter((id) => id !== serviceId);
      } else {
        return [...prevSelected, serviceId];
      }
    });
  };

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
        redirectTo: `http://localhost:5173/${doctorId}`,
      },
    });
    if (error) {
      alert("Error logging in with Google provider with supabase");
      console.log("Google provider with supabase error >> ", error);
    }
  }

  const createCalendarEvent = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("Please sign in with Google first.");
      googleSignIn();
      return;
    }
    if (!validateForm()) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    // const { data } = await axios.post(
    //   "http://localhost:5000/create-payment-intent",
    //   { amount: 5000 }
    // );
    // // Confirm the payment with Stripe using client secret
    // const { paymentIntent, error } = await stripe.confirmCardPayment(
    //   data.clientSecret,
    //   {
    //     payment_method: {
    //       card: cardElement,
    //     },
    //   }
    // );

    // if (error) {
    //   setErrorMessage(error.message);
    // } else if (paymentIntent.status === "succeeded") {
    //   setPaymentSuccess("Payment successful!");
    // }

    const formattedDate = value.format("YYYY-MM-DD");

    const formatDateTime = (date, time) => {
      return dayjs(`${date}T${time}`).toISOString();
    };

    const startDateTime = formatDateTime(
      value.format("YYYY-MM-DD"),
      selectedTime.startTime
    );

    const endDateTime = formatDateTime(
      value.format("YYYY-MM-DD"),
      selectedTime.endTime
    );

    const event = {
      summary: "Doctor Appointment",
      description: "Scheduled doctor appointment with Google Meet.",
      start: {
        dateTime: startDateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: [{ email: patientInfo.patientEmail }, { email: dEmail }],
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1", // conferenceDataVersion=1 is needed for Google Meet
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + session.provider_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(event),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const meetLink = data.conferenceData?.entryPoints[0]?.uri;
        console.log("Google Meet Link:", meetLink);

        const res = await fetch(`${BASE_URL}/book-appointment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doctorId,
            patient: patientInfo,
            selectedServices,
            selectedTime,
            selectedDate: formattedDate,
            accountNumber,
            meetUrl: meetLink,
            amount: "100",
          }),
        });

        const dataRes = await res.json();

        console.log("api/book-appointment/res >> ", dataRes);

        if (dataRes.code === 400) {
          alert(dataRes.message);
          return;
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(
          dataRes.clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          console.log("stripe error >> ", error);
          // setErrorMessage(error.message);
        } else if (paymentIntent.status === "succeeded") {
          // setPaymentSuccess("Payment successful!");
          console.log("payment successful");
        }

        if (dataRes.code === 400) {
          alert(dataRes.message);
        } else {
          await sendEmail(dEmail, patientInfo.patientEmail, meetLink);
          navigate(`/${doctorId}`);
          setSelectedServices([]);
          setPatientInfo({
            patientFirstName: "",
            patientLastName: "",
            patientEmail: "",
            patientPhoneNumber: "",
          });
          setSelectedTime({});
          setAccountNumber("");
          setValue(dayjs());
          setErrorMessage("");
          setErrors({});
        }
      } else {
        console.error("Error creating event:", data);
        if (data.error.code == 401) {
          alert("Please sign in again");
          googleSignIn();
        }
        if (data.error.code == 403) {
          setErrorMessage(data.error.message);
          alert("The user must be signed up for Google Calender.");
          googleSignIn();
        }
      }
    } catch (err) {
      console.error("Error:", err);
      alert(err.message);
    }
  };

  const sendEmail = async (doctorEmail, patientEmail, meetLink) => {
    try {
      const response = await fetch(`${BASE_URL}/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorEmail,
          patientEmail,
          meetLink,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Emails sent successfully:", data);
        alert(
          `Appointment booked successfully. An email with Google Meet Link has been sent to you on the provided email address.`
        );
      } else {
        console.error("Error sending emails:", data.message);
      }
    } catch (error) {
      console.error("Error in sending email:", error);
    }
  };

  return (
    <>
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
          onSubmit={createCalendarEvent}
          className="mx-auto grid max-w-screen-lg px-6 pb-20"
        >
          {/* doctor services */}
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

          {/* date calender */}
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

            {errors.value && (
              <p className="text-red-500 text-sm mt-2">{errors.value}</p>
            )}
          </div>

          {/* time slots */}
          <div className="">
            <p className="mt-8 font-serif text-xl font-bold text-blue-900">
              Choose a timeslot
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2 lg:max-w-xl">
              {services?.map((service) =>
                service?.timeSlots?.map((timeSlot) => (
                  <button
                    type="button"
                    key={timeSlot._id} // Use timeSlot._id for unique keys
                    onClick={() => handleClick(timeSlot)} // Pass timeSlot to handleClick
                    // disabled={timeSlot.isBooked}
                    className={`rounded-lg px-2 py-2.5 font-medium ${
                      selectedTime === timeSlot
                        ? "bg-red-600 text-white"
                        : `bg-red-100 text-red-900 `
                    } active:scale-95 outline-none ${
                      !timeSlot && "cursor-no-drop"
                    }`}
                  >
                    {timeSlot.startTime}
                  </button>
                ))
              )}
            </div>
            {errors.selectedTime && (
              <p className="text-red-500 text-sm mt-2">{errors.selectedTime}</p>
            )}
          </div>

          {/* patient info */}
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

          {/* payment info */}
          <div className="">
            <p className="mt-8 font-serif text-xl font-bold text-blue-900 mb-3">
              Payment
            </p>
            <CardElement />
            {/* <div className="mt-4">
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
              <p className="text-red-500 text-sm mt-2">
                {errors.accountNumber}
              </p>
            )} */}
          </div>

          <button
            type="submit"
            className="mt-8 w-56 rounded-full border-8 border-red-500 bg-red-600 px-10 py-4 text-lg font-bold text-white transition hover:translate-y-1"
            onClick={(e) => {
              if (session) {
                createCalendarEvent(e);
              } else {
                googleSignIn();
              }
            }}
          >
            {session ? "Book Now" : "Book Now"}
          </button>

          {errorMessage !== "" ? (
            <div className="w-full bg-red-50 p-4 rounded-lg mt-5">
              {errorMessage !== "" || errorMessage !== null ? (
                <p className="text-red-600 font-medium text-sm">
                  An error occurred: {errorMessage}
                </p>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </>
  );
};

export default Scheduler;
