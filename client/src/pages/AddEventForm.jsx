import React, { useState } from "react";
import axios from "axios";
import "./events.css";

const AddEventForm = ({ onClose, onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    prizePool: "",
    registrationFee: "",
    description: "",
    rules: [""],
    schedule: [""],
    status: "upcoming",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData((prev) => ({
      ...prev,
      rules: newRules,
    }));
  };

  const handleScheduleChange = (index, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = value;
    setFormData((prev) => ({
      ...prev,
      schedule: newSchedule,
    }));
  };

  const addRule = () => {
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, ""],
    }));
  };

  const removeRule = (index) => {
    if (formData.rules.length > 1) {
      const newRules = formData.rules.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        rules: newRules,
      }));
    }
  };

  const addSchedule = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, ""],
    }));
  };

  const removeSchedule = (index) => {
    if (formData.schedule.length > 1) {
      const newSchedule = formData.schedule.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        schedule: newSchedule,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const payload = {
        ...formData,
        date: new Date(formData.date), // Convert to Date object
      };
  
      const response = await axios.post(
        "http://localhost:5000/api/tournaments",
        payload
      );
  
      alert("Event added successfully!");
      onEventAdded(response.data);
      onClose();
    } catch (error) {
      alert("Error adding event. Please try again.");
      console.error("Submission error:", error?.response?.data || error);
    }
  };
  

  return (
    <div className="add-event-form-overlay">
      <div className="add-event-form">
        <h2>Add New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="title"
              placeholder="Event Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="prizePool"
              placeholder="Prize Pool (e.g. ₹50,000)"
              value={formData.prizePool}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              name="registrationFee"
              placeholder="Registration Fee (e.g. ₹1,000)"
              value={formData.registrationFee}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="description"
              placeholder="Event Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <h3>Tournament Rules</h3>
            {formData.rules.map((rule, index) => (
              <div key={index} className="input-with-button">
                <input
                  value={rule}
                  onChange={(e) => handleRuleChange(index, e.target.value)}
                  placeholder={`Rule ${index + 1}`}
                  required
                />
                {formData.rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="remove-button"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addRule} className="add-button">
              Add Rule
            </button>
          </div>

          <div className="form-group">
            <h3>Event Schedule</h3>
            {formData.schedule.map((item, index) => (
              <div key={index} className="input-with-button">
                <input
                  value={item}
                  onChange={(e) => handleScheduleChange(index, e.target.value)}
                  placeholder={`Schedule Item ${index + 1}`}
                  required
                />
                {formData.schedule.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="remove-button"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addSchedule} className="add-button">
              Add Schedule Item
            </button>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-button">
              Add Event
            </button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
