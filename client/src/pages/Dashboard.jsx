import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import {
  X,
  CheckCircle,
  Trophy,
  Users,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Clock,
  IndianRupee,
  XCircle,
} from "lucide-react";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const { user } = useUser();
  const [registeredTournaments, setRegisteredTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);
  const [stats, setStats] = useState({
    totalTournaments: Math.floor(Math.random() * 10) + 1,
    tournamentsWon: Math.floor(Math.random() * 5),
    winRate: Math.floor(Math.random() * 100),
    averageRank: (Math.random() * 5 + 1).toFixed(1),
    totalMatches: Math.floor(Math.random() * 30) + 1,
    matchesWon: Math.floor(Math.random() * 20),
    // Additional detailed stats for modal
    bestRank: Math.floor(Math.random() * 3) + 1,
    totalPoints: Math.floor(Math.random() * 1000) + 500,
    currentStreak: Math.floor(Math.random() * 5) + 1,
    longestStreak: Math.floor(Math.random() * 8) + 3,
    favoriteGame: "8-Ball Pool",
    averageGameTime: "45 minutes",
    lastPlayed: new Date().toLocaleDateString(),
    skillLevel: "Intermediate",
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

        // If no tournaments found, add some mock data for demonstration
        let tournaments = response.data;
        if (tournaments.length === 0) {
          tournaments = [
            {
              _id: "mock1",
              title: "Spring Championship",
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
              time: "10:00 AM",
              location: "Main Hall",
            },
            {
              _id: "mock2",
              title: "Weekend Tournament",
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
              time: "2:00 PM",
              location: "Sports Complex",
            },
            {
              _id: "mock3",
              title: "Monthly League",
              date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
              time: "6:00 PM",
              location: "Club House",
            },
            {
              _id: "mock4",
              title: "Annual Cup",
              date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
              time: "9:00 AM",
              location: "Grand Arena",
            },
          ];
        }

        // Filter out any null or invalid tournament objects
        const validTournaments = tournaments.filter(
          (tournament) => tournament && tournament._id
        );
        setRegisteredTournaments(validTournaments);
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

  // Cancel registration function
  const handleCancelRegistration = async (tournamentId, tournamentTitle) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/registration/${user.id}/${tournamentId}`
      );

      if (response.data.success) {
        toast.success("Registration cancelled successfully!");
        // Refresh the tournaments list and filter out null values
        const updatedTournaments = registeredTournaments.filter(
          (tournament) =>
            tournament && tournament._id && tournament._id !== tournamentId
        );
        setRegisteredTournaments(updatedTournaments);
      } else {
        toast.error(response.data.message || "Failed to cancel registration");
      }
    } catch (error) {
      console.error("Error canceling registration:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to cancel registration. Please try again.");
      }
    }
  };

  // Mock data for demonstration - In a real app, this would come from your backend
  const leaderboardData = [
    { rank: 1, name: "John Doe", points: 250, tournaments: 5 },
    { rank: 2, name: "Jane Smith", points: 220, tournaments: 4 },
    { rank: 3, name: "Mike Johnson", points: 200, tournaments: 4 },
    { rank: 4, name: "Sarah Wilson", points: 180, tournaments: 3 },
    { rank: 5, name: "David Brown", points: 150, tournaments: 3 },
    { rank: 6, name: "Emily Davis", points: 140, tournaments: 2 },
    { rank: 7, name: "Chris Miller", points: 130, tournaments: 3 },
    { rank: 8, name: "Lisa Garcia", points: 120, tournaments: 2 },
    { rank: 9, name: "Tom Anderson", points: 110, tournaments: 2 },
    { rank: 10, name: "Amy Taylor", points: 100, tournaments: 1 },
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
          <DashboardCard
            title="My Matches / Fixtures"
            showViewAll={true}
            onViewAll={() => setModalOpen("tournaments")}
          >
            {loading ? (
              <div className="loading-state">Loading your tournaments...</div>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : registeredTournaments.length === 0 ? (
              <div className="empty-state">
                You haven't registered for any tournaments yet.
              </div>
            ) : (
              <div className="tournaments-list">
                {registeredTournaments
                  .filter((tournament) => tournament && tournament._id)
                  .slice(0, 2)
                  .map((tournament) => (
                    <div key={tournament._id} className="tournament-item">
                      <div className="tournament-info">
                        <h4>{tournament.title}</h4>
                        <p>
                          <Calendar className="icon" />{" "}
                          {new Date(tournament.date).toLocaleDateString()}
                        </p>
                        <p>
                          <Clock className="icon" /> {tournament.time}
                        </p>
                        <p>
                          <MapPin className="icon" /> {tournament.location}
                        </p>
                      </div>
                      <button
                        className="cancel-button"
                        onClick={() =>
                          handleCancelRegistration(
                            tournament._id,
                            tournament.title
                          )
                        }
                        title="Withdraw Registration"
                      >
                        <XCircle className="icon" />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </DashboardCard>

          {/* 2. Tournament Stats */}
          <DashboardCard
            title="Tournament Stats"
            showViewAll={true}
            onViewAll={() => setModalOpen("stats")}
          >
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
            </div>
          </DashboardCard>

          {/* 3. Leaderboard */}
          <DashboardCard
            title="Leaderboard"
            showViewAll={true}
            onViewAll={() => setModalOpen("leaderboard")}
          >
            <div className="leaderboard">
              <div className="leaderboard-header">
                <span>Rank</span>
                <span>Player</span>
                <span>Points</span>
                <span>Tournaments</span>
              </div>
              {leaderboardData.slice(0, 5).map((player) => (
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
          <DashboardCard
            title="My Profile Summary"
            showViewAll={true}
            onViewAll={() => setModalOpen("profile")}
          >
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
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Modals */}
        {modalOpen === "tournaments" && (
          <Modal title="All My Tournaments" onClose={() => setModalOpen(null)}>
            <div className="tournaments-list">
              {registeredTournaments
                .filter((tournament) => tournament && tournament._id)
                .map((tournament) => (
                  <div key={tournament._id} className="tournament-item">
                    <div className="tournament-info">
                      <h4>{tournament.title}</h4>
                      <p>
                        <Calendar className="icon" />{" "}
                        {new Date(tournament.date).toLocaleDateString()}
                      </p>
                      <p>
                        <Clock className="icon" /> {tournament.time}
                      </p>
                      <p>
                        <MapPin className="icon" /> {tournament.location}
                      </p>
                    </div>
                    <button
                      className="cancel-button"
                      onClick={() =>
                        handleCancelRegistration(
                          tournament._id,
                          tournament.title
                        )
                      }
                      title="Withdraw Registration"
                    >
                      <XCircle className="icon" />
                    </button>
                  </div>
                ))}
            </div>
          </Modal>
        )}

        {modalOpen === "leaderboard" && (
          <Modal title="Full Leaderboard" onClose={() => setModalOpen(null)}>
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
          </Modal>
        )}

        {modalOpen === "stats" && (
          <Modal
            title="Detailed Tournament Statistics"
            onClose={() => setModalOpen(null)}
          >
            <div className="stats-modal">
              <div className="stats-grid-modal">
                <div className="stat-item-modal">
                  <h4>Total Tournaments</h4>
                  <p className="stat-value">{stats.totalTournaments}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Tournaments Won</h4>
                  <p className="stat-value">{stats.tournamentsWon}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Win Rate</h4>
                  <p className="stat-value">{stats.winRate}%</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Average Rank</h4>
                  <p className="stat-value">{stats.averageRank}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Total Matches</h4>
                  <p className="stat-value">{stats.totalMatches}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Matches Won</h4>
                  <p className="stat-value">{stats.matchesWon}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Best Rank</h4>
                  <p className="stat-value">#{stats.bestRank}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Total Points</h4>
                  <p className="stat-value">{stats.totalPoints}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Current Streak</h4>
                  <p className="stat-value">{stats.currentStreak}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Longest Streak</h4>
                  <p className="stat-value">{stats.longestStreak}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Favorite Game</h4>
                  <p className="stat-value-text">{stats.favoriteGame}</p>
                </div>
                <div className="stat-item-modal">
                  <h4>Avg Game Time</h4>
                  <p className="stat-value-text">{stats.averageGameTime}</p>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {modalOpen === "profile" && user && (
          <Modal
            title="Complete Profile Details"
            onClose={() => setModalOpen(null)}
          >
            <div className="profile-modal">
              <div className="profile-header-modal">
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="profile-image-modal"
                />
                <div className="profile-info">
                  <h3>{user.fullName}</h3>
                  <p className="user-id">User ID: {user.id}</p>
                </div>
              </div>
              <div className="profile-details-modal">
                <div className="profile-section">
                  <h4>Personal Information</h4>
                  <div className="profile-item">
                    <span className="label">Full Name:</span>
                    <span className="value">{user.fullName}</span>
                  </div>
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
                    <span className="label">Last Updated:</span>
                    <span className="value">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="profile-section">
                  <h4>Gaming Statistics</h4>
                  <div className="profile-item">
                    <span className="label">Active Tournaments:</span>
                    <span className="value">
                      {registeredTournaments.length}
                    </span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Total Tournaments:</span>
                    <span className="value">{stats.totalTournaments}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Skill Level:</span>
                    <span className="value">{stats.skillLevel}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Last Played:</span>
                    <span className="value">{stats.lastPlayed}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Total Points:</span>
                    <span className="value">{stats.totalPoints}</span>
                  </div>
                  <div className="profile-item">
                    <span className="label">Best Rank:</span>
                    <span className="value">#{stats.bestRank}</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

// Reusable Card Component
const DashboardCard = ({ title, children, showViewAll, onViewAll }) => (
  <div className="dashboard-card">
    <div className="dashboard-card-title">
      <span>{title}</span>
      {showViewAll && (
        <button className="view-all-btn" onClick={onViewAll}>
          View All
        </button>
      )}
    </div>
    {children}
  </div>
);

// Modal Component
const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2 className="modal-title">{title}</h2>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
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
