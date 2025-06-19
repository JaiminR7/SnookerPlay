import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import AddEventForm from "./AddEventForm";
import "./events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/tournaments");
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tournaments. Please try again later.");
      console.error("Error fetching tournaments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => navigate(`/events/${id}`);

  const handleEventAdded = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  if (loading) {
    return <div className="events-container">Loading tournaments...</div>;
  }

  if (error) {
    return <div className="events-container error">{error}</div>;
  }

  return (
    <div className="events-container">
      <h1>Upcoming Tournaments</h1>

      {user && (
        <button
          className="add-event-button"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Tournament
        </button>
      )}

      {showAddForm && (
        <AddEventForm
          onClose={() => setShowAddForm(false)}
          onEventAdded={handleEventAdded}
        />
      )}

      {events.length === 0 ? (
        <p>No tournaments available at the moment.</p>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div
              key={event._id}
              className="event-card"
              onClick={() => handleClick(event._id)}
            >
              <img src="/images/slide1.png" alt={event.title} />
              <h2>{event.title}</h2>
              <p>{event.date?.slice(0, 10)}</p>
              <p>{event.location}</p>
              <p>Prize Pool: {event.prizePool}</p>
              <p>Fee: {event.registrationFee}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
