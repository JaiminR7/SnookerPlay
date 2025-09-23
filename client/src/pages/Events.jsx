import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Trophy, Plus, Target } from "lucide-react";
import API from "../services/api";
import AddEventForm from "./AddEventForm";
import EventCard from "../components/EventCard";
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
      const response = await API.get("/tournaments");
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
      <div className="events-header">
        <div className="header-content">
          <h1 className="events-title">
            <Trophy className="title-icon" size={32} />
            Upcoming Tournaments
          </h1>
          <p className="events-subtitle">
            Discover and participate in exciting snooker tournaments
          </p>
        </div>

        {user && (
          <button
            className="add-event-button enhanced-add-btn"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="btn-icon" size={20} />
            Add New Tournament
          </button>
        )}
      </div>

      {showAddForm && (
        <AddEventForm
          onClose={() => setShowAddForm(false)}
          onEventAdded={handleEventAdded}
        />
      )}

      {events.length === 0 ? (
        <div className="no-events-message">
          <Target className="no-events-icon" size={48} />
          <h3>No tournaments available at the moment</h3>
          <p>Check back soon for exciting upcoming tournaments!</p>
        </div>
      ) : (
        <div className="events-grid enhanced-grid">
          {events.map((event, index) => (
            <EventCard
              key={event._id}
              event={event}
              onClick={handleClick}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
