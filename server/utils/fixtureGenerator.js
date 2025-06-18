// Generate fixtures for a tournament
export const generateFixtures = (participants) => {
  // Shuffle participants array
  const shuffledParticipants = [...participants].sort(() => Math.random() - 0.5);
  
  // Generate fixtures for first round
  const fixtures = [];
  for (let i = 0; i < shuffledParticipants.length; i += 2) {
    fixtures.push({
      round: 1,
      matchNumber: Math.floor(i / 2) + 1,
      player1: shuffledParticipants[i],
      player2: shuffledParticipants[i + 1],
      status: 'pending'
    });
  }

  // Generate empty fixtures for subsequent rounds
  // Quarter-finals (Round 1) -> 4 matches
  // Semi-finals (Round 2) -> 2 matches
  // Finals (Round 3) -> 1 match
  for (let round = 2; round <= 3; round++) {
    const matchesInRound = Math.pow(2, 3 - round); // 2 matches for round 2, 1 match for round 3
    for (let match = 1; match <= matchesInRound; match++) {
      fixtures.push({
        round,
        matchNumber: match,
        player1: null,
        player2: null,
        status: 'pending'
      });
    }
  }

  return fixtures;
}; 