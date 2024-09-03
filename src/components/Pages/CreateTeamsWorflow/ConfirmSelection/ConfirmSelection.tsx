import React, { useState } from 'react';
import './ConfirmSelection.css';
import { PlayerModel } from '../Models/CreateTeamsModels';

interface ConfirmSelectionProps {
    setErrorMessage: (message: string | undefined) => void,
    setTeams: React.Dispatch<React.SetStateAction<string[][]>>
    selectedPlayers: PlayerModel[],
    teamCount: number,
    onNext: () => void,
    onBack: () => void,
}

const ConfirmSelection: React.FC<ConfirmSelectionProps> = ({ setErrorMessage, setTeams, selectedPlayers, teamCount, onNext, onBack }) => {
    const handleGenerateTeams = (event: React.FormEvent) => {
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
        onNext();
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
        <div className='confirmation-container'>
            <div className="wizard-header">
                <button className="back-button" onClick={onBack}>Back</button>
                <h2>Review Selection</h2>
            </div>
            <h3>Players Playing:</h3>
            <ul>
                {selectedPlayers.map((player, index) => (
                    <li key={index}>{player.name} - {player.rating}</li>
                ))}
            </ul>
            <h2>Number of Teams: {teamCount}</h2>
            <div className='btn-div'>
                <button onClick={handleGenerateTeams}>Generate Teams</button>
            </div>
        </div>
    );
};

export default ConfirmSelection;
