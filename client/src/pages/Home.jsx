import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import "./home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const carouselImages = [
    "/images/slide1.png",
    "/images/slide2.png",
    "/images/slide3.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === carouselImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Our SnookerPlay</h1>

      <div className="carousel-container">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="carousel-slide"
            style={{
              backgroundImage: `url(${image})`,
              opacity: index === currentSlide ? 1 : 0,
            }}
          />
        ))}

        <button onClick={goToPrevSlide} className="carousel-arrow left">
          &#10094;
        </button>

        <button onClick={goToNextSlide} className="carousel-arrow right">
          &#10095;
        </button>

        <div className="carousel-dots">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`carousel-dot ${
                index === currentSlide ? "active" : ""
              }`}
            />
          ))}
        </div>
      </div>

      <div className="why-container">
        <div className="why-divider"></div>
        <h2 className="why-title">Why Choose SnookerPlay?</h2>
        <p className="why-text">
          Empower your gaming experience with professional equipment and
          seamless tournament organization.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span>✓</span>
            </div>
            <h3 className="feature-title">What is SnookerPlay?</h3>
            <p className="feature-text">
              An online platform that connects snooker and pool players, clubs,
              and organizers—making it easier to play, manage, and follow
              tournaments.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>✓</span>
            </div>
            <h3 className="feature-title">What can I do with SnookerPlay?</h3>
            <p className="feature-text">
              Organize and manage snooker & pool tournaments with ease —
              featuring online registrations, automatic brackets, live scores,
              player stats, and more!
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <span>✓</span>
            </div>
            <h3 className="feature-title">Who is it for?</h3>
            <p className="feature-text">
              SnookerPlay is for everyone! Whether you're a Tournament
              Organizer, Event Promoter, Room Owner, Industry Professional, or a
              Player of any age and skill level — we've got you covered!
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          marginTop: "4rem",
          backgroundColor: "#1B3A2F",
          padding: "3rem 2rem",
          borderRadius: "8px",
          maxWidth: "1000px",
          margin: "4rem auto",
          height: "200px",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            color: "#F8F9F9",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Ready to Join the SnookerPlay Community?
        </h2>
        <p
          style={{
            color: "#F8F9F9",
            marginBottom: "2rem",
            maxWidth: "700px",
            margin: "0 auto 2rem",
            opacity: 0.9,
            textAlign: "center",
          }}
        >
          Get started today and experience the best way to participate in
          snooker tournaments.
        </p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <SignedIn>
            <button
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#F4A261",
                color: "#1B3A2F",
                border: "none",
                borderRadius: "0.375rem",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontWeight: "600",
                justifyContent: "center",
              }}
              onClick={() => {
                console.log("Navigating to dashboard...");
                navigate("/dashboard");
              }}
            >
              Go to Dashboard
            </button>
          </SignedIn>

          <SignedOut>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
              }}
            >
              <SignInButton mode="modal">
                <button
                  style={{
                    padding: "0.75rem 2rem",
                    border: "1px solid #F8F9F9",
                    color: "#F8F9F9",
                    backgroundColor: "transparent",
                    borderRadius: "0.375rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  style={{
                    padding: "0.75rem 2rem",
                    backgroundColor: "#F4A261",
                    color: "#1B3A2F",
                    border: "none",
                    borderRadius: "0.375rem",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: "600",
                  }}
                >
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      </div>
    </div>
  );
};

export default Home;
