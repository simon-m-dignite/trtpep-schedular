import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const handleResponse = (response) => {
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
};

const fetchServices = async (doctorId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/get-doctor-services/${doctorId}`
    );
    return handleResponse(response);
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

const bookAppointment = async (
  patientFirstName,
  patientLastName,
  patientEmail,
  patientPhoneNumber,
  accountNumber,
  selectedTime,
  selectedDate,
  selectedServices
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/book-appointment`, {
      patientFirstName,
      patientLastName,
      patientEmail,
      patientPhoneNumber,
      accountNumber,
      selectedTime,
      selectedDate,
      selectedServices,
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};

export default {
  fetchServices,
  bookAppointment,
};
