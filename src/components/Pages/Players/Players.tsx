// Players.tsx

import React, { useState } from 'react';
import './Players.css';

interface PlayerModel {
  name: string;
  rating: number;
}

const Players: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [dataInputType, setDataInputType] = useState<'manual' | 'url'>('manual');
  const [manualData, setManualData] = useState<string>('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');
  const [playersData, setPlayerData] = useState<PlayerModel[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerModel[]>([]);
  const [teamCount, setTeamCount] = useState<number>(0);
  const [teams, setTeams] = useState<string[][]>();


  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const processDataToDisplay = (dataToProcess: string, delimiter: string) => {
    let displayData: PlayerModel[] = [];
    const lines = dataToProcess.split("\n");
    lines.forEach(line => {
      const player = line.split(delimiter);
      if (parseFloat(player[1])) {
        displayData.push({ name: player[0], rating: parseFloat(player[1]) });
      }
    });

    return displayData;
  }

  const handleProcessData = async () => {
    try {
      let dataToProcess = '';

      if (dataInputType === 'url' && spreadsheetUrl) {
        dataToProcess = await fetchDataFromUrl(spreadsheetUrl);
        setPlayerData(processDataToDisplay(dataToProcess, ','));
      } else {
        dataToProcess = manualData;
        setPlayerData(processDataToDisplay(dataToProcess, ':'));
      }
    } catch (error) {
      console.error('Error processing data:', error);
    }

    handleCloseModal();
  };

  const fetchDataFromUrl = async (url: string): Promise<string> => {
    // Replace this with actual asynchronous logic to fetch data from the Google Sheets API
    const response = await fetch(url);
    const data = await response.text();
    return data;
  };

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
        newTeams[smallestTeamIndex].push(player+": "+rating);
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
      <h2>Players Page</h2>
      <button onClick={handleOpenModal}>Open Spreadsheet Dialog</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h3>Choose Data Input Type</h3>
            <label>
              <input
                type="radio"
                value="manual"
                checked={dataInputType === 'manual'}
                onChange={() => setDataInputType('manual')}
              />
              Manual Input
            </label>
            <label>
              <input
                type="radio"
                value="url"
                checked={dataInputType === 'url'}
                onChange={() => setDataInputType('url')}
              />
              Google Spreadsheet URL
            </label>

            {dataInputType === 'manual' && (
              <div>
                <h3>Enter Players' Information Manually</h3>
                <textarea
                  value={manualData}
                  onChange={(e) => setManualData(e.target.value)}
                  placeholder="Enter players' information here (e.g., Player1:Rating1:Skill1,Player2:Rating2:Skill2)"
                />
              </div>
            )}

            {dataInputType === 'url' && (
              <div>
                <h3>Enter Google Spreadsheet URL</h3>
                <input
                  type="text"
                  value={spreadsheetUrl}
                  onChange={(e) => setSpreadsheetUrl(e.target.value)}
                  placeholder="Enter URL"
                />
              </div>
            )}

            <button onClick={handleProcessData}>Process</button>
          </div>
        </div>
      )}

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
              type="number"
              value={teamCount}
              onChange={handleTeamCountChange}
              min="0"
              step="1"
              className="team-count-input"
            />
          </label>
          <button type="submit" className="generate-teams-button">
            Generate Teams
          </button>
        </form>
      </div>

      {teams &&
        <div className="team-container">
          <h2>Teams</h2>
          {teams.map((team, index) => (
            <div key={index} className="team">
              <p>Team {index + 1}:</p>
              <ul>
                {team.map((player, playerIndex) => (
                  <li key={playerIndex}>{player}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      }

    </div>
  );
};

export default Players;
