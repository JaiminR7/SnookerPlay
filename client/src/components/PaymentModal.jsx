import React, { useState } from "react";
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
} from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./PaymentModal.css";

const PaymentModal = ({ event, onClose, onSuccess }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!user) {
      setError("Please sign in to register for events");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if event is free
      const registrationFee = parseFloat(event.registrationFee) || 0;

      if (registrationFee === 0) {
        // Handle free event registration
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
      } else {
        // Direct registration for paid events (no payment integration)
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
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isFreeEvent = parseFloat(event.registrationFee) === 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-header">
          <h2 className="payment-title">
            {isFreeEvent ? (
              <>
                <Users className="title-icon" />
                Register for Event
              </>
            ) : (
              <>
                <CreditCard className="title-icon" />
                Complete Registration
              </>
            )}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

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

            {error && (
              <div className="error-message">
                <X size={16} />
                {error}
              </div>
            )}

            <div className="payment-actions">
              <button
                className="cancel-btn"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="pay-btn"
                onClick={handlePayment}
                disabled={loading}
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
                    <CheckCircle size={16} />
                    Register & Pay Later
                  </>
                )}
              </button>
            </div>

            {!isFreeEvent && (
              <div className="security-note">
                <IndianRupee size={14} />
                <span>
                  Registration confirmed. Payment can be made at the venue.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
