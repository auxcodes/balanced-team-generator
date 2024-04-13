import React, { useState } from 'react';

const ConfirmSelection = () => {
  const PlayerList = [
    { name: 'Vicky', rating: 1 },
    { name: 'Bappi', rating: 2 },
    { name: 'HJ', rating: 4.5 },
    { name: 'Allu', rating: 5.0 },
    { name: 'Kent', rating: 4.0 }
  ];
  const [numberOfTeams, setNumberOfTeams] = useState(2);

  return (
    <div>
      <h2>Confirmation</h2>
      <h3>Players Playing:</h3>
      <ul>
        {PlayerList.map((player, index) => (
          <li key={index}>{player.name} - {player.rating}</li>
        ))}
      </ul>
      <label htmlFor="teamCount">Number of Teams:</label>
      <input 
        type="number" 
        id="teamCount" 
        value={numberOfTeams} 
        min={2} 
        max={100} 
        onChange={(e) => setNumberOfTeams(parseInt(e.target.value))} 
      />
      <button>Generate</button>
    </div>
  );
};

export default ConfirmSelection;
