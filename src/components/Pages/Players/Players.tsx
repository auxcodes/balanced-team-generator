import React, { useState, useEffect, useContext } from 'react';
import './Players.css';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../../../App';
import { Link } from 'react-router-dom';
import { PATH } from '../../../constants/path';

interface PlayerModel {
  name: string;
  rating: number;
}

const Players = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedPlayersData, setUpdatedPlayersData] = useState<PlayerModel[]>([]);
  const { userPlayers, setUserPlayers } = useContext(UserContext);

  useEffect(() => {
    setUpdatedPlayersData([...userPlayers]);
  }, [userPlayers]);

  const handleAddPlayer = () => {
    setUpdatedPlayersData([...updatedPlayersData, { name: '', rating: 1.0 }]);
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = [...updatedPlayersData];
    updatedPlayers.splice(index, 1);
    setUpdatedPlayersData(updatedPlayers);
  };

  const savePlayerChanges = () => {
    const allPlayers = [...updatedPlayersData.filter(player => player.name && player.rating)];
    setUserPlayers(allPlayers);
    setEditMode(false); // Exit edit mode after saving changes
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleCancel = () => {
    setUpdatedPlayersData(userPlayers);
    setEditMode(false);
  }

  return (
    <div className="players-page">
      <h2>Players Page</h2>

      <div className="container">
        <h3>Player List</h3>

        {updatedPlayersData.map((player, index) => (
          <div key={index} className="player-item">
            <div className="player-name">
              {editMode ? (
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => {
                    const updatedPlayers = [...updatedPlayersData];
                    updatedPlayers[index].name = e.target.value;
                    setUpdatedPlayersData(updatedPlayers);
                  }}
                />
              ) : (
                player.name
              )}
            </div>
            <div className="player-rating">
              {editMode ? (
                <select
                  value={player.rating}
                  onChange={(e) => {
                    const updatedPlayers = [...updatedPlayersData];
                    updatedPlayers[index].rating = parseFloat(e.target.value);
                    setUpdatedPlayersData(updatedPlayers);
                  }}
                >
                  {[...Array(9)].map((_, i) => (
                    <option key={i} value={(i * 0.5 + 1).toFixed(1)}>
                      {(i * 0.5 + 1).toFixed(1)}
                    </option>
                  ))}
                </select>
              ) : (
                player.rating.toFixed(1)
              )}
            </div>
            <div className="add-remove-buttons">
              {editMode && (
                <button className="add-minus-player-btn" onClick={() => handleRemovePlayer(index)}>
                  <FontAwesomeIcon icon={faMinus as IconProp} />
                </button>
              )}
            </div>
          </div>
        ))}

        <div className='add-players-div'>
          {editMode && (
            <button className="add-minus-player-btn" onClick={handleAddPlayer}
              disabled={updatedPlayersData[updatedPlayersData.length - 1].name ? false : true}>
              <FontAwesomeIcon icon={faPlus as IconProp} />
            </button>
          )}
        </div>

        <button className="edit-players-button" onClick={editMode ? handleCancel : handleEdit}>
          {editMode ? 'Cancel' : 'Edit'}
        </button>
        {editMode && (
          <button className="edit-players-button" onClick={savePlayerChanges}>
            Save
          </button>
        )}
        <Link to={PATH.CREATE_TEAMS_PATH}>Create Teams</Link>
      </div>
    </div>
  );
};

export default Players;
