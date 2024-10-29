import React, { useContext } from "react";
import Scheduler from "../../components/Scheduler";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { AppointmentContext } from "../../context/context";

const stripePromise = loadStripe(
  "pk_test_51PiQ2kRv1Ud7Q4L2gaztmYGBANqXoUjX6VPvEffqs2AExjN0wcRK8pxRuS1DZ15B2CaRm7gEJ6YDt3eGyDSoJF9X00AxzW8Bxr"
);

const SchedulerPage = () => {
  const { totalPrice } = useContext(AppointmentContext);
  return totalPrice > 0 ? (
    <Elements stripe={stripePromise}>
      <Scheduler />
    </Elements>
  ) : (
    <Scheduler />
  );
};

export default SchedulerPage;
