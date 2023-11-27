import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/free-solid-svg-icons';
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
  const [teamCount, setTeamCount] = useState<number>(2);
  const [teams, setTeams] = useState<string[][]>([]);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("No Selected Players");


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
    setTeams([]);
    setSelectedPlayers([]);
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

  const handleShare = async () => {
    const teamsText = teams
      .map((team, index) => `Team ${index + 1}\n${team.map(player => player.split(":")[0]).join('\n')}`)
      .join('\n\n');
    try {
      // Trigger the native sharing dialog
      if (navigator.share) {
        await navigator.share({
          title: 'Generated Teams',
          text: teamsText,
        });
      } else {
        // Deprecated way to copy to clipboard document.execCommand('copy'); that uses useRef.select() to hidden <textarea>
        // New way Using the Clipboard API to copy the selected text
        await navigator.clipboard.writeText(teamsText);
        alert('Teams data copied to clipboard! Paste it to share.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div>
      <h2>Players Page</h2>
      <button className="enter-data-btn" onClick={handleOpenModal}>Enter Data</button>

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
                <h4>Enter Players Information</h4>
                <textarea
                  value={manualData}
                  onChange={(e) => setManualData(e.target.value)}
                  placeholder="Player1:Rating1&#10;Player2:Rating2&#10;...."
                />
              </div>
            )}

            {dataInputType === 'url' && (
              <div>
                <h4>Google Spreadsheet CSV URL</h4>
                <input
                  type="text"
                  value={spreadsheetUrl}
                  onChange={(e) => setSpreadsheetUrl(e.target.value)}
                  placeholder="Enter URL"
                />
              </div>
            )}

            <div className="dialog-btn-div">
              <button className="process-btn" onClick={handleProcessData}>Process</button>
              <button className="close-dialog-btn" onClick={handleCloseModal}>Close</button>

            </div>

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

      {teams && !errorMessage &&
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
          <button className="share-btn" onClick={handleShare}>
          <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      }

      {errorMessage &&
        <h3 className="error-msg">{errorMessage}</h3>}

    </div>
  );
};

export default Players;
