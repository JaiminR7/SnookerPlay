import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  IndianRupee,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import API from "../services/api";
import PaymentModal from "../components/PaymentModal";
import "./eventDetail.css";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { user } = useUser();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/tournaments/${eventId}`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch event details. Please try again later.");
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleRegister = () => {
    if (!user) {
      toast.error("You must be logged in to register for events", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    toast.success("🎉 Registration successful! Welcome to the tournament!", {
      position: "top-right",
      autoClose: 5000,
    });
    setShowPaymentModal(false);
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!event) {
    return <div className="error">Event not found</div>;
  }

  return (
    <div className="event-detail-container">
      <button className="back-button" onClick={() => navigate("/events")}>
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div className="event-header">
        <div className="event-image-container">
          <img
            src="/images/slide1.png"
            alt={event.title}
            className="event-detail-image"
          />
        </div>
        <div className="event-header-info">
          <h1 className="event-detail-title">{event.title}</h1>
          <div className="event-meta">
            <p className="event-date">
              <Calendar size={16} /> Date:{" "}
              {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="event-time">
              <Clock size={16} /> Time: {event.time}
            </p>
            <p className="event-location">
              <MapPin size={16} /> Location: {event.location}
            </p>
            <p className="event-price-pool">
              <Trophy size={16} /> Prize Pool: {event.prizePool}
            </p>
            <p className="event-registration-fee">
              <IndianRupee size={16} /> Registration Fee:{" "}
              {event.registrationFee}
            </p>
          </div>
          <button className="register-button" onClick={handleRegister}>
            Register Now
          </button>
        </div>
      </div>

      <div className="event-content">
        <section className="event-description">
          <h2>About the Event</h2>
          <p>{event.description}</p>
        </section>

        <section className="event-rules">
          <h2>Tournament Rules</h2>
          <ul>
            {event.rules &&
              event.rules.map((rule, index) => <li key={index}>{rule}</li>)}
          </ul>
        </section>

        <section className="event-schedule">
          <h2>Event Schedule</h2>
          <ul>
            {event.schedule &&
              event.schedule.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </section>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          event={event}
          onClose={handlePaymentClose}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default EventDetail;
