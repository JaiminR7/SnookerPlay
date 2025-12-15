import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useUser } from "@clerk/clerk-react";
import {
  CreditCard,
  X,
  Loader2,
  Calendar,
  MapPin,
  Trophy,
  Users,
  IndianRupee,
  CheckCircle,
  Lock,
} from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./PaymentModal.css";

// Debug Stripe key
console.log(
  "Stripe Publishable Key:",
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe card element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
  hidePostalCode: false, // Show postal code field
};

// Payment form component (inside Stripe Elements provider)
const PaymentForm = ({ event, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  // Debug Stripe initialization
  console.log("Stripe object:", stripe);
  console.log("Elements object:", elements);

  // Parse registration fee - handle Indian Rupee symbol and commas
  const parseRegistrationFee = (feeString) => {
    if (!feeString) return 0;
    // Remove currency symbols, commas, and spaces, then parse
    const cleanFee = feeString.toString().replace(/[₹,\s]/g, "");
    return parseFloat(cleanFee) || 0;
  };

  const registrationFee = parseRegistrationFee(event.registrationFee);
  const isFreeEvent = registrationFee === 0;

  // Debug logging
  console.log("Event:", event);
  console.log("Raw Registration Fee:", event.registrationFee);
  console.log("Parsed Registration Fee:", registrationFee);
  console.log("Is Free Event:", isFreeEvent);
  console.log("User:", user);

  // Create payment intent when component mounts (for paid events)
  useEffect(() => {
    console.log(
      "useEffect triggered - isFreeEvent:",
      isFreeEvent,
      "user:",
      !!user
    );
    if (!isFreeEvent && user) {
      console.log("Creating payment intent...");
      createPaymentIntent();
    }
  }, [event, user, isFreeEvent]);

  const createPaymentIntent = async () => {
    try {
      const response = await API.post("/payments/create-payment-intent", {
        amount: registrationFee,
        currency: "inr", // Indian Rupees
        eventId: event._id,
        userId: user.id,
        userEmail: user.emailAddresses[0]?.emailAddress,
      });

      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
    } catch (error) {
      console.error("Error creating payment intent:", error);
      setError("Failed to initialize payment. Please try again.");
    }
  };

  const handleFreeRegistration = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/registration", {
        userId: user.id,
        tournamentId: event._id,
        userDetails: {
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.emailAddresses[0]?.emailAddress,
          phone: user.phoneNumbers[0]?.phoneNumber || "Not provided",
        },
      });

      if (response.data.success || response.status === 201) {
        toast.success(
          "🎉 Registration successful! Welcome to the tournament!",
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    try {
      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              name: user.fullName || `${user.firstName} ${user.lastName}`,
              email: user.emailAddresses[0]?.emailAddress,
            },
          },
        });

      if (stripeError) {
        console.error("Stripe payment error:", stripeError);
        setError(stripeError.message);
        toast.error(stripeError.message);
      } else if (paymentIntent.status === "succeeded") {
        // Payment successful, complete registration
        const response = await API.post("/payments/confirm-payment", {
          paymentIntentId: paymentIntent.id,
        });

        if (response.data.success) {
          // Also register in your system
          await API.post("/registration", {
            userId: user.id,
            tournamentId: event._id,
            paymentStatus: "paid",
            paymentId: paymentIntent.id,
            userDetails: {
              name: user.fullName || `${user.firstName} ${user.lastName}`,
              email: user.emailAddresses[0]?.emailAddress,
              phone: user.phoneNumbers[0]?.phoneNumber || "Not provided",
            },
          });

          toast.success("🎉 Payment successful! Registration completed!", {
            position: "top-right",
            autoClose: 3000,
          });
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      const errorMessage =
        error.response?.data?.message || "Payment failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!user) {
      setError("Please sign in to register for events");
      return;
    }

    if (isFreeEvent) {
      handleFreeRegistration();
    } else {
      handleStripePayment();
    }
  };

  return (
    <div className="payment-content">
      {/* Event Details Summary */}
      <div className="event-summary">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="detail-item">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
          <div className="detail-item">
            <Trophy size={16} />
            <span>Prize Pool: {event.prizePool}</span>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="payment-section">
        <div className="fee-breakdown">
          <div className="fee-item">
            <span>Registration Fee:</span>
            <span className="fee-amount">
              {isFreeEvent ? (
                "FREE"
              ) : (
                <>
                  <IndianRupee size={16} />
                  {event.registrationFee}
                </>
              )}
            </span>
          </div>
          {!isFreeEvent && (
            <div className="fee-total">
              <strong>
                <span>Total:</span>
                <span className="total-amount">
                  <IndianRupee size={16} />
                  {event.registrationFee}
                </span>
              </strong>
            </div>
          )}
        </div>

        {/* Stripe Card Element for paid events */}
        {!isFreeEvent && (
          <div className="stripe-card-container">
            <label className="card-label">
              <Lock size={16} />
              Card Information
            </label>
            {stripe && elements ? (
              <div>
                <div className="stripe-card-element">
                  <CardNumberElement
                    options={{
                      style: cardElementOptions.style,
                      placeholder: "1234 1234 1234 1234",
                    }}
                  />
                </div>
                <div
                  style={{ display: "flex", gap: "12px", marginTop: "12px" }}
                >
                  <div className="stripe-card-element" style={{ flex: 1 }}>
                    <CardExpiryElement
                      options={{
                        style: cardElementOptions.style,
                        placeholder: "MM/YY",
                      }}
                    />
                  </div>
                  <div className="stripe-card-element" style={{ flex: 1 }}>
                    <CardCvcElement
                      options={{
                        style: cardElementOptions.style,
                        placeholder: "CVC",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="stripe-card-element">
                <div
                  style={{
                    color: "#666",
                    padding: "10px",
                    textAlign: "center",
                  }}
                >
                  Loading payment form...
                </div>
              </div>
            )}
            <div
              style={{
                fontSize: "12px",
                color: "#666",
                marginTop: "8px",
                lineHeight: "1.4",
              }}
            >
              <p style={{ margin: "0 0 4px 0" }}>
                <strong>Test Card:</strong> 4242424242424242, any future expiry
                (12/25), any CVC (123)
              </p>
             
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <X size={16} />
            {error}
          </div>
        )}

        <div className="payment-actions">
          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="pay-btn"
            onClick={handleSubmit}
            disabled={loading || (!isFreeEvent && !clientSecret)}
          >
            {loading ? (
              <>
                <Loader2 className="loading-spinner" size={16} />
                Processing...
              </>
            ) : isFreeEvent ? (
              <>
                <Users size={16} />
                Register Now
              </>
            ) : (
              <>
                <CreditCard size={16} />
                Pay ₹{registrationFee}
              </>
            )}
          </button>
        </div>

        {!isFreeEvent && (
          <div className="security-note">
            <Lock size={14} />
            <span>Your payment is secured by Stripe encryption</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Main PaymentModal component with Stripe Elements provider
const StripePaymentModal = ({ event, onClose, onSuccess }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-header">
          <h2 className="payment-title">
            {parseFloat(event.registrationFee) === 0 ? (
              <>
                <Users className="title-icon" />
                Register for Event
              </>
            ) : (
              <>
                <CreditCard className="title-icon" />
                Complete Payment
              </>
            )}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm event={event} onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </div>
    </div>
  );
};

export default StripePaymentModal;
