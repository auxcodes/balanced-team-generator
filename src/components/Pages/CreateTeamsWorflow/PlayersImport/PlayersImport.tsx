import React, { useState } from 'react';
import './PlayersImport.css';
import { PlayerModel } from '../Models/CreateTeamsModels';

interface PlayersImportProps {
  playersData: PlayerModel[],
  setPlayersData: (players: PlayerModel[]) => void
}

const PlayersImport: React.FC<PlayersImportProps> = ({ playersData, setPlayersData }) => {
  const [dataInputType, setDataInputType] = useState<'manual' | 'url'>('manual');
  const [manualData, setManualData] = useState<string>('');
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string>('');

  const PlayerList: PlayerModel[] = [
    { name: 'Vicky', rating: 1 },
    { name: 'Bappi', rating: 2 },
    { name: 'HJ', rating: 4.5 },
    { name: 'Allu', rating: 5.0 },
    { name: 'Kent', rating: 4.0 }
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

    displayData.push(...PlayerList);
    return displayData;
  }

  const handleProcessData = async () => {
    try {
      let dataToProcess = '';

      if (dataInputType === 'url' && spreadsheetUrl) {
        dataToProcess = await fetchDataFromUrl(spreadsheetUrl);
        setPlayersData(processDataToDisplay(dataToProcess, ','));
      } else {
        dataToProcess = manualData;
        setPlayersData(processDataToDisplay(dataToProcess, ':'));
      }
    } catch (error) {
      console.error('Error processing data:', error);
    }
  };



  return (
    <div>
      <div className='import-data-content'>
        <h3>Choose Data Input Type</h3>
        <div>
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


          <button className="process-btn" onClick={handleProcessData}>Process</button>
        </div>
      </div>
      {playersData.length > 0 &&
        <p className="player-count">
          {playersData.length} Players Processed
        </p>
      }
      {playersData.length === 0 &&
        <p className="player-count">
          Process Players to Proceed Forward
        </p>
      }
    </div>
  );
};

export default PlayersImport;
