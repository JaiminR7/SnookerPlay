import React from "react";
import { Calendar, MapPin, Trophy, IndianRupee } from "lucide-react";
import TiltedCard from "./TiltedCard";
import "./EventCard.css";

const EventCard = ({ event, onClick }) => {
  return (
    <div className="simple-event-card" onClick={() => onClick(event._id)}>
      <TiltedCard
        imageSrc="/images/slide1.png"
        altText={event.title}
        captionText=""
        containerHeight="250px"
        containerWidth="100%"
        imageHeight="100%"
        imageWidth="100%"
        scaleOnHover={1.05}
        rotateAmplitude={8}
        showMobileWarning={false}
        showTooltip={false}
        overlayContent={null}
        displayOverlayContent={false}
      />
      <div className="simple-tournament-name">
        <h3>{event.title}</h3>
      </div>
    </div>
  );
};

export default EventCard;
