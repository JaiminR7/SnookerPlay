import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import axios from "axios";
import "./eventDetail.css";

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/tournaments/${eventId}`
        );
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

  const handleRegister = async () => {
  if (!user) {
    alert("You must be logged in to register.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/api/registration", {
      userId: user.id,
      tournamentId: event._id,
    });

    if (response.status === 201) {
      alert("Successfully registered!");
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      alert(err.response.data.message);
    } else {
      alert("Registration failed.");
    }
    console.error("Registration error:", err);
  }
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
        ← Back to Events
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
              📅 Date: {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="event-time">⏰ Time: {event.time}</p>
            <p className="event-location">📍 Location: {event.location}</p>
            <p className="event-price-pool">💰 Prize Pool: {event.prizePool}</p>
            <p className="event-registration-fee">
              💵 Registration Fee: {event.registrationFee}
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
    </div>
  );
};

export default EventDetail;
