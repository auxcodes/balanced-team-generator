import React from 'react';
import './Home.css'; // Import your CSS file for styling

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <p className="description">
        Welcome to the Balanced Team Generator app! This simple application is designed for creating balanced sports teams, initially tailored for volleyball but adaptable to other sports as well. You can manually enter player data with the format "PlayerName: Rating" (where the rating is a number from 1 to 5 with 0.5 differences), or import data from a Google Spreadsheet in CSV format ("PlayerName, Rating").
      </p>

      <div className="feature-section">
        <h3>Features:</h3>
        <ul>
          <li>Generate balanced teams with customizable parameters.</li>
          <li>Process and manage player data efficiently.</li>
          <li>Share generated teams with other applications.</li>
          <li>Option to import player data from Google Sheets.</li>
        </ul>
      </div>

      <div className="how-to-use-section">
        <h3>How to Use:</h3>
        <ul>
          <li>Navigate to the "Create Teams" page.</li>
          <li>Click "Enter Data" Popup to insert Manual/Google Spreadsheet data.</li>
          <li>Click "Process" and you will see all your players.</li>
          <li>User "Team Count" Scroll and checkbox to select players.</li>
          <li>Click "Generate Teams" BOOM ready to share.</li>
        </ul>
      </div>

      {/* <div className="quote-section">
        <h3>Creator's Quote:</h3>
        <p>
          "Credit to NGVA Volleyball Club that inspired me to build this app, which can assist many other clubs/associations in building teams using my tool. Your feedback is valuable and appreciated."
        </p>
      </div> */}
    </div>
  );
};

export default Home;