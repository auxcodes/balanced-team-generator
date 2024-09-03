import React, { useContext, useState } from 'react';
import './PlayersImport.css';
import { PlayerModel } from '../Models/CreateTeamsModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { UserContext } from '../../../../App';
import { Link } from 'react-router-dom';
import { PATH } from '../../../../constants/path';

interface PlayersImportProps {
  playersData: PlayerModel[],
  setPlayersData: (players: PlayerModel[]) => void,
  onNext: () => void,
}

const PlayersImport: React.FC<PlayersImportProps> = ({ playersData, setPlayersData, onNext }) => {
  const [dataInputType, setDataInputType] = useState<'manual' | 'url' | 'user' | 'dynamic insert'>('manual');
  const [manualData, setManualData] = useState<string>('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');
  const [dynamicPlayers, setDynamicPlayers] = useState<PlayerModel[]>([{ name: '', rating: 1.0 }]);
  const userPlayers = useContext(UserContext).userPlayers;

  const fetchDataFromUrl = async (url: string): Promise<string> => {
    // Replace this with actual asynchronous logic to fetch data from the Google Sheets API
    const response = await fetch(url);
    const data = await response.text();
    return data;
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

  /*TODO: Remove, just populating dummy data for now. */
  React.useEffect(() => {
    if (dataInputType === 'user') {
      setPlayersData(userPlayers);
    }
  }, [dataInputType]);

  const handleProcessData = async () => {
    try {
      if (dataInputType === 'url') {
        const dataToProcess = await fetchDataFromUrl(spreadsheetUrl);
        setPlayersData(processDataToDisplay(dataToProcess, ','));
      } else if (dataInputType === 'manual') {
        setPlayersData(processDataToDisplay(manualData, ':'));
      } else if (dataInputType === 'dynamic insert') {
        const allPlayers = [...dynamicPlayers.filter(player => player.name && player.rating)];
        setPlayersData(allPlayers);
      } else {
        setPlayersData(userPlayers);
        if (playersData.length > 1) {
          onNext();
        }
      }
      if (playersData.length > 1) {
        onNext();
      }
      else {
        console.error('Not enough players, Please import more.');
      }
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };

  const disableProcessButton = () => {
    if (dataInputType === 'url') {
      return !spreadsheetUrl;
    }
    else if (dataInputType === 'manual') {
      return !manualData;
    }
    else if (dataInputType === 'dynamic insert') {
      const allPlayers = [...dynamicPlayers.filter(player => player.name && player.rating)];
      return allPlayers.length < 2;
    }
    return undefined;
  }

  const handleAddPlayer = () => {
    setDynamicPlayers([...dynamicPlayers, { name: '', rating: 1.0 }]);
  };

  const handleRemovePlayer = (index: number) => {
    const updatedPlayers = [...dynamicPlayers];
    updatedPlayers.splice(index, 1);
    setDynamicPlayers(updatedPlayers);
  };

  const handleDynamicPlayerChange = (index: number, key: keyof PlayerModel, value: string) => {
    const updatedPlayers = dynamicPlayers.map((player, i) => {
      if (i === index) {
        return {
          ...player,
          [key]: value
        };
      }
      return player;
    });
    setDynamicPlayers(updatedPlayers);
  };

  const renderRatingOptions = () => {
    const options = [];
    for (let rating = 1; rating <= 20; rating += 1) {
      options.push(
        <option key={rating} value={rating}>
          {rating.toFixed(1)}
        </option>
      );
    }
    return options;
  };


  return (
    <div className='players-import-container'>
      <div className='import-data-content'>
        <h3>Choose Player Input Type</h3>
        <div>
          <div className="dropdown-container">
            <select
              className="dropdown-type-list"
              value={dataInputType}
              onChange={(e) => setDataInputType(e.target.value as 'manual' | 'url' | 'user' | 'dynamic insert')}
            >
              <option value="manual">List Input</option>
              <option value="url">Google Spreadsheet URL</option>
              <option value="dynamic insert">Manually Add</option>
              <option value="user">Test Players</option>
            </select>
          </div>


          {dataInputType === 'manual' && (
            <div>
              <h4>Enter Players Information</h4>
              <textarea
                className="player-textarea"
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
                className="url-input"
                type="text"
                value={spreadsheetUrl}
                onChange={(e) => setSpreadsheetUrl(e.target.value)}
                placeholder="Enter URL"
              />
            </div>
          )}

          {dataInputType === 'user' && (
            <div>
              <h4>You have {userPlayers.length} players</h4>
              <p>Go to <Link to={PATH.PLAYERS}>Players Page</Link> to update players and ratings.</p>
            </div>
          )}

          {dataInputType === 'dynamic insert' && (
            <div>
              <h4>Manually Add Players</h4>
              {dynamicPlayers.map((player, index) => (
                <div className='manual-div' key={index}>
                  <input
                    className='player-input'
                    type="text"
                    placeholder="Player Name"
                    value={player.name}
                    onChange={(e) => handleDynamicPlayerChange(index, 'name', e.target.value)}
                  />
                  <select
                    className='player-rating'
                    value={player.rating}
                    onChange={(e) => handleDynamicPlayerChange(index, 'rating', e.target.value)}
                  >
                    {renderRatingOptions()}
                  </select>
                  {index === dynamicPlayers.length - 1 && player.name && player.rating && (
                    <button className='round-btn add-player-btn' onClick={handleAddPlayer} >
                      <FontAwesomeIcon icon={faPlus as IconProp} />
                    </button>
                  )}
                  {index !== dynamicPlayers.length - 1 && (
                    <button className='round-btn remove-player-btn' onClick={() => handleRemovePlayer(index)}>
                      <FontAwesomeIcon icon={faMinus as IconProp} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}


          <button className="process-btn" onClick={handleProcessData} disabled={disableProcessButton()}>Import</button>
        </div>
      </div>
    </div>
  );
};

export default PlayersImport;
