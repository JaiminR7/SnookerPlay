// Simple test to check if Stripe is working
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SAw9vPnzv1IZUeCI1aVqaCQFFP1Y5uSLToUgCLeqBsGsAuOPqfd49gvT5PVquLv51UPmkV6vGInXeVsVaN2jnCY00XoMiY2Uh"
);

const TestCard = () => {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "20px auto" }}>
      <h3>Stripe Test</h3>
      <div
        style={{
          border: "2px solid #ccc",
          borderRadius: "8px",
          padding: "12px",
          backgroundColor: "white",
        }}
      >
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>
      <p>Stripe loaded: {stripe ? "Yes" : "No"}</p>
      <p>Elements loaded: {elements ? "Yes" : "No"}</p>
    </div>
  );
};

const StripeTest = () => (
  <Elements stripe={stripePromise}>
    <TestCard />
  </Elements>
);

export default StripeTest;
