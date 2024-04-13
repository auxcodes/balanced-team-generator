import React from 'react';

const DisplayTeams = () => {
  const teams = [
    { name: 'Team 1', players: ['Vicky', 'Bappi'] },
    { name: 'Team 2', players: ['HJ', 'Allu'] }
  ];

  return (
    <div>
      <h2>Team Display</h2>
      {teams.map((team, index) => (
        <div key={index}>
          <h3>{team.name}</h3>
          <ul>
            {team.players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
        </div>
      ))}
      
    </div>
  );
};

export default DisplayTeams;
