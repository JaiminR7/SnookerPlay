import React from "react";
import TiltedCard from "./TiltedCard";
import "./EventCard.css";

const EventCard = ({ event, onClick, index }) => {
  // Array of available event images
  const eventImages = [
    "/images/events/img1.jpg",
    "/images/events/img2.png",
    "/images/events/img3.png",
    "/images/events/img4.png",
    "/images/events/img5.jpg",
    "/images/events/img6.jpg",
    "/images/events/img7.jpg"
  ];

  // Select image based on index or event ID hash
  const getEventImage = () => {
    if (typeof index === 'number') {
      return eventImages[index % eventImages.length];
    }
    // Fallback: use event ID to create a consistent hash
    const hash = event._id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return eventImages[Math.abs(hash) % eventImages.length];
  };

  return (
    <div className="simple-event-card" onClick={() => onClick(event._id)}>
      <TiltedCard
        imageSrc={getEventImage()}
        altText={event.title}
        containerHeight="250px"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        scaleOnHover={1.05}
        rotateAmplitude={8}
        showMobileWarning={false}
        showTooltip={false}
      />
      <div className="simple-tournament-name">
        <h3>{event.title}</h3>
      </div>
    </div>
  );
};

export default EventCard;
