import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faShareFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "./DisplayTeams.css";

interface DisplayTeamsProps {
  errorMessage: string | undefined;
  teams: string[][];
  onBack: () => void;
}

const DisplayTeams: React.FC<DisplayTeamsProps> = ({ errorMessage, teams, onBack }) => {
  const handleShare = async () => {
    const teamsText = teams
      .map((team, index) => `Team ${index + 1}\n${team.map((player) => player.split(":")[0]).join("\n")}`)
      .join("\n\n");
    try {
      // Trigger the native sharing dialog
      if (navigator.share) {
        await navigator.share({
          title: "Generated Teams",
          text: teamsText,
        });
      } else {
        // Deprecated way to copy to clipboard document.execCommand('copy'); that uses useRef.select() to hidden <textarea>
        // New way Using the Clipboard API to copy the selected text
        await navigator.clipboard.writeText(teamsText);
        alert("Teams data copied to clipboard! Paste it to share.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="team-display-container">
      <div className="wizard-header">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
        <h2>Teams</h2>
      </div>

      {teams && !errorMessage && (
        <div className="team-display-container">
          <div className="team-options">
            <div className="info-row">
              <span className="regen-note">Click Back and re-Generate Teams. </span>
              <button className="share-btn" onClick={handleShare}>
                Copy Teams
              </button>
            </div>
          </div>
          <div className="teams-wrapper">
            {teams.map((team, index) => (
              <div key={index} className="team">
                <h5>Team {index + 1}:</h5>
                <ul>
                  {team.map((player, playerIndex) => (
                    <li key={playerIndex}>{player}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayTeams;
