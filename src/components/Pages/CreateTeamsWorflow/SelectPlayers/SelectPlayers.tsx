import React, { useState, useEffect } from "react";
import "./SelectPlayers.css";
import { PlayerModel } from "../Models/CreateTeamsModels";

interface SelectPlayersProps {
  playersData: PlayerModel[];
  errorMessage: string | undefined;
  setErrorMessage: (message: string | undefined) => void;
  selectedPlayers: PlayerModel[];
  setSelectedPlayers: React.Dispatch<React.SetStateAction<PlayerModel[]>>;
  teamCount: number;
  setTeamCount: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
  onBack: () => void;
}

const SelectPlayers: React.FC<SelectPlayersProps> = ({
  playersData,
  errorMessage,
  setErrorMessage,
  selectedPlayers,
  setSelectedPlayers,
  teamCount,
  setTeamCount,
  onBack,
  onNext,
}) => {
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const initSelectAll = selectedPlayers ? (selectedPlayers.length === playersData.length ? "Yes" : "Some") : "No";
  const [selectAll, setSelectAll] = useState<string>(initSelectAll);

  // Function to handle checkbox change
  const handleCheckboxChange = (player: PlayerModel) => {
    if (player.name === "Select All") {
      // Toggle selectAll state
      setSelectAll(selectAll == "Yes" ? "No" : "Yes");
    } else {
      // Update selectedPlayers based on player selection
      setSelectedPlayers((prevSelectedPlayers) => {
        const isPlayerSelected = prevSelectedPlayers.includes(player);
        if (isPlayerSelected) {
          return prevSelectedPlayers.filter((prevPlayer) => prevPlayer !== player);
        } else {
          return [...prevSelectedPlayers, player];
        }
      });
      teamCount = selectedPlayers.length / 2;
    }
  };

  // Update selectAll state based on selectedPlayers
  useEffect(() => {
    if (selectedPlayers.length === playersData.length) {
      setSelectAll("Yes");
    } else if (selectedPlayers.length > 0) {
      setSelectAll("Some");
    } else {
      setSelectAll("No");
    }
  }, [selectedPlayers, playersData]);

  // Update selectedPlayers based on selectAll state
  useEffect(() => {
    if (selectAll === "Yes") {
      setSelectedPlayers(playersData);
    } else if (selectAll === "No") {
      setSelectedPlayers([]);
    }
  }, [selectAll]);

  // Function to handle team count change
  const handleTeamCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(event.target.value, 10);
    setTeamCount(count > 0 ? count : 0);
  };

  // Function to handle confirmation of player selection
  const handleConfirmSelection = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedPlayers.length >= teamCount) {
      setErrorMessage(undefined);
      onNext();
    } else {
      setErrorMessage("CANNOT PROCESS INVALID DATA");
    }
  };

  return (
    <div className="team-selection-container">
      <div className="wizard-header">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
        <h2>Player Selection</h2>
      </div>
      <div className="sub-container">
        <form onSubmit={handleConfirmSelection} className="form">
          <div className="team-options">
            <div className="info-row">
              <div className="player-options">
                <span className="selected-count">
                  <b>Players: </b> {selectedPlayers.length}
                </span>
                <label className="team-count-label">
                  <b>Number of Teams:</b>
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
              </div>
              <button type="submit" className="next-button" disabled={selectedPlayers.length < 2}>
                Next
              </button>
            </div>
          </div>
          <div key="Select All" className="player-item select-all">
            <input
              type="checkbox"
              checked={selectAll === "Yes"}
              onChange={() => handleCheckboxChange({ name: "Select All", rating: 0 })}
            />
            <span className="player-name">
              <b>Select All</b>
            </span>
          </div>
          {playersData.map((player) => (
            <div key={player.name} className="player-item">
              <input
                type="checkbox"
                checked={selectedPlayers.includes(player)}
                onChange={() => handleCheckboxChange(player)}
              />
              <span className="player-name">{player.name + ": " + player.rating}</span>
              <hr className="separator" />
            </div>
          ))}
        </form>
      </div>
      {/* {!errorMessage && <label htmlFor="teamCount">Number of Teams: {teamCount} & Players: {selectedPlayers.length}</label>} */}
    </div>
  );
};

export default SelectPlayers;
