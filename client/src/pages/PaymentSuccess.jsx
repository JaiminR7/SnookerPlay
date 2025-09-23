import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Trophy,
  ArrowRight,
  Home,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("session_id");
  const eventId = searchParams.get("event_id");

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await API.get(`/tournaments/${eventId}`);
      setEventDetails(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="success-card">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="checkmark-circle">
            <CheckCircle2 className="checkmark-icon" size={64} />
          </div>
        </div>

        {/* Success Message */}
        <div className="success-content">
          <h1 className="success-title">Registration Successful!</h1>
          <p className="success-message">
            Congratulations! You have successfully registered for the
            tournament. We're excited to have you participate!
          </p>

          {/* Event Details */}
          {eventDetails && (
            <div className="event-confirmation">
              <h2 className="event-title">{eventDetails.title}</h2>

              <div className="event-info">
                <div className="info-item">
                  <Calendar className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Date:</span>
                    <span className="info-value">
                      {new Date(eventDetails.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <MapPin className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{eventDetails.location}</span>
                  </div>
                </div>

                <div className="info-item">
                  <Trophy className="info-icon" size={20} />
                  <div className="info-text">
                    <span className="info-label">Prize Pool:</span>
                    <span className="info-value">{eventDetails.prizePool}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="next-steps">
            <h3>What's Next?</h3>
            <ul className="steps-list">
              <li>
                <CheckCircle2 size={16} />
                Check your email for confirmation details
              </li>
              <li>
                <CheckCircle2 size={16} />
                Tournament fixtures will be available soon
              </li>
              <li>
                <CheckCircle2 size={16} />
                Arrive 15 minutes before your scheduled time
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="dashboard-btn" onClick={handleGoToDashboard}>
              <User size={18} />
              View Dashboard
              <ArrowRight size={16} />
            </button>

            <button className="home-btn" onClick={handleGoHome}>
              <Home size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-icon icon-1">
          <Trophy size={24} />
        </div>
        <div className="floating-icon icon-2">
          <CheckCircle2 size={20} />
        </div>
        <div className="floating-icon icon-3">
          <Calendar size={18} />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
