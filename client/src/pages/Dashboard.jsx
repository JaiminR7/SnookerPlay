import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const { user } = useUser();
  const [registeredTournaments, setRegisteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalTournaments: 0,
    tournamentsWon: 0,
    winRate: 0,
    averageRank: 0,
    totalMatches: 0,
    matchesWon: 0,
  });

  useEffect(() => {
    const fetchRegisteredTournaments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/registration/user/${user.id}`
        );
        setRegisteredTournaments(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Failed to fetch tournaments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredTournaments();
  }, [user]);

  // Mock data for demonstration - In a real app, this would come from your backend
  const leaderboardData = [
    { rank: 1, name: "John Doe", points: 250, tournaments: 5 },
    { rank: 2, name: "Jane Smith", points: 220, tournaments: 4 },
    { rank: 3, name: "Mike Johnson", points: 200, tournaments: 4 },
    { rank: 4, name: "Sarah Wilson", points: 180, tournaments: 3 },
    { rank: 5, name: "David Brown", points: 150, tournaments: 3 },
  ];

  return (
    <div className="dashboard-container">
      <div>
        <h1 className="dashboard-title">Welcome to SnookerPlay Dashboard</h1>

        <div className="dashboard-info-box">
          <h3>
            Manage your snooker and pool events, track matches, view stats, and
            stay on top of tournaments.
          </h3>

          {/* <div style={{ marginTop: "1rem" }}>
            <ButtonStyle href="/register">Register Now !!</ButtonStyle>
          </div> */}
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* 1. My Matches / Fixtures */}
          <DashboardCard title="My Matches / Fixtures">
            {loading ? (
              <p>Loading your tournaments...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : registeredTournaments.length === 0 ? (
              <p>You haven't registered for any tournaments yet.</p>
            ) : (
              <div className="tournaments-list">
                {registeredTournaments.map((tournament) => (
                  <div key={tournament._id} className="tournament-item">
                    <h4>{tournament.title}</h4>
                    <p>📅 {new Date(tournament.date).toLocaleDateString()}</p>
                    <p>⏰ {tournament.time}</p>
                    <p>📍 {tournament.location}</p>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

          {/* 2. Tournament Stats */}
          <DashboardCard title="Tournament Stats">
            <div className="stats-grid">
              <div className="stat-item">
                <h4>Total Tournaments</h4>
                <p className="stat-value">{stats.totalTournaments}</p>
              </div>
              <div className="stat-item">
                <h4>Tournaments Won</h4>
                <p className="stat-value">{stats.tournamentsWon}</p>
              </div>
              <div className="stat-item">
                <h4>Win Rate</h4>
                <p className="stat-value">{stats.winRate}%</p>
              </div>
              <div className="stat-item">
                <h4>Average Rank</h4>
                <p className="stat-value">{stats.averageRank}</p>
              </div>
              <div className="stat-item">
                <h4>Total Matches</h4>
                <p className="stat-value">{stats.totalMatches}</p>
              </div>
              <div className="stat-item">
                <h4>Matches Won</h4>
                <p className="stat-value">{stats.matchesWon}</p>
              </div>
            </div>
          </DashboardCard>

          {/* 3. Leaderboard */}
          <DashboardCard title="Leaderboard">
            <div className="leaderboard">
              <div className="leaderboard-header">
                <span>Rank</span>
                <span>Player</span>
                <span>Points</span>
                <span>Tournaments</span>
              </div>
              {leaderboardData.map((player) => (
                <div key={player.rank} className="leaderboard-item">
                  <span className="rank">#{player.rank}</span>
                  <span className="player-name">{player.name}</span>
                  <span className="points">{player.points}</span>
                  <span className="tournaments">{player.tournaments}</span>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* 4. My Profile Summary */}
          <DashboardCard title="My Profile Summary">
            {user && (
              <div className="profile-summary">
                <div className="profile-header">
                  <img
                    src={user.imageUrl}
                    alt={user.fullName}
                    className="profile-image"
                  />
                  <h3>{user.fullName}</h3>
                </div>
                <div className="profile-details">
                  <div className="profile-item">
                    <span className="label">Email:</span>
                    <span className="value">
                      {user.primaryEmailAddress?.emailAddress}
                    </span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Member Since:</span>
                    <span className="value">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Active Tournaments:</span>
                    <span className="value">
                      {registeredTournaments.length}
                    </span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Achievement Level:</span>
                    <span className="value">Intermediate</span>
                  </div>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component
const DashboardCard = ({ title, children }) => (
  <div className="dashboard-card">
    <h3 className="dashboard-card-title">{title}</h3>
    {children}
  </div>
);

// Reusable Button component
const ButtonStyle = ({ children, href, onClick, type = "button" }) => {
  if (href) {
    return (
      <a href={href} className="dashboard-button">
        {children}
      </a>
    );
  } else {
    return (
      <button type={type} className="dashboard-button" onClick={onClick}>
        {children}
      </button>
    );
  }
};

export default Dashboard;
