import React, { useState } from 'react';
import './PlayersImport.css';
import { PlayerModel } from '../Models/CreateTeamsModels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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


  const PlayerList: PlayerModel[] = [
    { name: 'Vicky', rating: 1 },
    { name: 'Bappi', rating: 2 },
    { name: 'HJ', rating: 4.5 },
    { name: 'Allu', rating: 5.0 },
    { name: 'Kent', rating: 4.0 },
    { name: 'Neal', rating: 1 },
    { name: 'Nishil', rating: 2 },
    { name: 'JK', rating: 4.5 },
    { name: 'DD', rating: 5.0 },
    { name: 'PP', rating: 4.0 },
    { name: 'Pintu', rating: 1 },
    { name: 'JP', rating: 2.5 },
    { name: 'Jiya', rating: 3.0 },
    { name: 'Mamta', rating: 3.0 },
    { name: 'Roshanda', rating: 3.5 },
    { name: 'Nikki', rating: 3.0 },
    { name: 'Sesha', rating: 4.0 },
    { name: 'Bhartiya', rating: 3.5 },
    { name: 'Krups', rating: 4.5 },
    { name: 'Sanjay Dutt', rating: 4.0 },
    { name: 'Roops', rating: 3.5 }
  ];

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
  React.useEffect(()=> {
    if(dataInputType === 'user'){
      setPlayersData(PlayerList);
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
        setDynamicPlayers(allPlayers);
        setPlayersData(dynamicPlayers);
      } else {
        //setPlayersData(PlayerList);
        console.log('default added',playersData);
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
    for (let rating = 1.0; rating <= 5.0; rating += 0.5) {
      options.push(
        <option key={rating} value={rating.toFixed(1)}>
          {rating.toFixed(1)}
        </option>
      );
    }
    return options;
  };


  return (
    <div className='players-import-container'>
      <div className='import-data-content'>
        <h3>Choose Data Input Type</h3>
        <div>
        <div className="dropdown-container">
          <select
            className="dropdown-type-list"
            value={dataInputType}
            onChange={(e) => setDataInputType(e.target.value as 'manual' | 'url' | 'user' | 'dynamic insert')}
          >
            <option value="manual">Manual Input</option>
            <option value="url">Google Spreadsheet URL</option>
            <option value="user">Use My Players</option>
            <option value="dynamic insert">Dynamic Insert</option>
          </select>
        </div>


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

          {dataInputType === 'user' && (
            <div>
              <h4>Click process if you are ok with the ratings.</h4>
            </div>
          )}

          {dataInputType === 'dynamic insert' && (
            <div>
              <h4>Dynamic Player Insertion</h4>
              {dynamicPlayers.map((player, index) => (
                <div className='dynamic-div' key={index}>
                  <input
                    type="text"
                    placeholder="Player Name"
                    value={player.name}
                    onChange={(e) => handleDynamicPlayerChange(index, 'name', e.target.value)}
                  />
                  <select
                    value={player.rating}
                    onChange={(e) => handleDynamicPlayerChange(index, 'rating', e.target.value)}
                  >
                    {renderRatingOptions()}
                  </select>
                  {index === dynamicPlayers.length - 1 && player.name && player.rating && (
                    <button className='add-minus-btn' onClick={handleAddPlayer} >
                      <FontAwesomeIcon icon={faPlus as IconProp} />
                    </button>
                  )}
                  {index !== dynamicPlayers.length - 1 && (
                    <button className='add-minus-btn' onClick={() => handleRemovePlayer(index)}>
                      <FontAwesomeIcon icon={faMinus as IconProp} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}


          <button className="process-btn" onClick={handleProcessData} disabled={disableProcessButton()}>Process</button>
        </div>
      </div>
      <p className="player-count">
        Click Process To Import Players
      </p>
    </div>
  );
};

export default PlayersImport;
