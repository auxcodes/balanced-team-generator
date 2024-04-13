import React, { useState } from 'react';
import { PlayerModel } from '../Models/CreateTeamsModels';

interface TeamSelectionProps{
    playersData: PlayerModel[],
    errorMessage: string | undefined,
    setErrorMessage: (message: string | undefined) => void,
    setTeams: (teams: string[][]) => void
}

const TeamSelection: React.FC<TeamSelectionProps> = ({playersData, setErrorMessage, errorMessage, setTeams}) => {
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [teamCount, setTeamCount] = useState<number>(2);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerModel[]>([]);


  const handleCheckboxChange = (player: PlayerModel) => {
    // Toggle the selected state of the player
    setSelectedPlayers((prevSelectedPlayers) =>
      prevSelectedPlayers.includes(player)
        ? prevSelectedPlayers.filter((playerName) => playerName !== player)
        : [...prevSelectedPlayers, player]
    );
  };

  const handleTeamCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure the team count is a positive integer
    const count = parseInt(event.target.value, 10);
    setTeamCount(count > 0 ? count : 0);
  };

  const handleCreateTeams = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedPlayers?.length >= teamCount) {
      setErrorMessage(undefined);
    }
    else {
      setErrorMessage("CANNOT PROCESS INVALID DATA");
      return;
    }

    // Group players by rating
    const playersByRating: { [key: number]: string[] } = {};
    selectedPlayers.forEach((player) => {
      const rating = player.rating;
      if (!playersByRating[rating]) {
        playersByRating[rating] = [];
      }
      playersByRating[rating].push(player.name);
    });

    // Shuffle individual arrays within each rating group
    Object.keys(playersByRating).forEach((rating) => {
      const numericRating = parseFloat(rating);
      if (!isNaN(numericRating)) {
        playersByRating[parseFloat(rating)] = playersByRating[parseFloat(rating)].sort(() => Math.random() - 0.5);
      }
    });

    // Sort rating groups by descending order of ratings
    const sortedRatingGroups = Object.keys(playersByRating).sort((a, b) => parseFloat(b) - parseFloat(a));

    // Initialize teams and total ratings array
    const newTeams: string[][] = Array.from({ length: teamCount }, () => []);
    const totalRatings: number[] = Array.from({ length: teamCount }, () => 0);

    // Assign players to teams in a round-robin fashion within each rating group
    sortedRatingGroups.forEach((rating) => {
      playersByRating[parseFloat(rating)].forEach((player) => {
        const smallestTeamIndex = findSmallestTeamIndex(totalRatings);
        newTeams[smallestTeamIndex].push(player + ": " + rating);
        totalRatings[smallestTeamIndex] += parseFloat(rating);
      });
    });

    setTeams(newTeams.sort(() => Math.random() - 0.5));
  };

  // Helper function to find the index of the team with the smallest total rating
  const findSmallestTeamIndex = (totalRatings: number[]) => {
    let smallestIndex = 0;
    let smallestRating = totalRatings[0];

    for (let i = 1; i < totalRatings.length; i++) {
      if (totalRatings[i] < smallestRating) {
        smallestIndex = i;
        smallestRating = totalRatings[i];
      }
    }

    return smallestIndex;
  };

  return (
    <div>
      <h2>Team Selection</h2>
      <div className="container">
        <h3>Player List</h3>
        <form onSubmit={handleCreateTeams} className="form">
          {playersData &&
            playersData.map((player) => (
              <div key={player.name} className="player-item">
                <input
                  type="checkbox"
                  checked={selectedPlayers.includes(player)}
                  onChange={() => handleCheckboxChange(player)}
                />
                <p><b>
                  {player.name + ": " + player.rating}
                </b></p>
                <hr className="separator" />
              </div>
            ))}
          <label className="team-count-label">
            Team Count:
            <input
              type="range"
              value={teamCount}
              onChange={handleTeamCountChange}
              min="2"
              max="20"
              step="1"
              className="team-count-slider"
            />
            <span className="team-count-value">{teamCount}</span>
          </label>
          <button type="submit" className="generate-teams-button" disabled={!selectedPlayers}>
            Generate Teams
          </button>
        </form>
      </div>
      <label htmlFor="teamCount">Number of Teams:</label>
      <input 
        type="number" 
        id="teamCount" 
        value={numberOfTeams} 
        min={2} 
        max={100} 
        onChange={(e) => setNumberOfTeams(parseInt(e.target.value))} 
      />
    </div>
  );
};

export default TeamSelection;
