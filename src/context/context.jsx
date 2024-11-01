import { createContext, useState } from "react";
import React from "react";
import dayjs from "dayjs";

export const AppointmentContext = createContext();

const AppointmentContextProvider = ({ children }) => {
  const [services, setServices] = useState([]); // coming from backend which i am listing on the Scheduler
  // user states
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
  const [loading, setLoading] = useState(false);

  const totalPrice = services
    ?.filter((service) => selectedServices?.includes(service._id))
    ?.reduce((sum, service) => sum + service.price, 0);

  const slots = services?.map((ser) => {
    return ser?.duration;
  });

  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceId)) {
        return prevSelected?.filter((id) => id !== serviceId);
      } else {
        return [...prevSelected, serviceId];
      }
    });
  };

  return (
    <AppointmentContext.Provider
      value={{
        services,
        setServices,
        patientInfo,
        setPatientInfo,
        selectedServices,
        setSelectedServices,
        selectedTime,
        setSelectedTime,
        accountNumber,
        setAccountNumber,
        value,
        setValue,
        errors,
        setErrors,
        errorMessage,
        setErrorMessage,
        loading,
        setLoading,
        totalPrice,
        slots,
        handleServiceSelection,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export default AppointmentContextProvider;
