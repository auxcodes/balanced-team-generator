import React from 'react';
import './Home.css'; // Import your CSS file for styling

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="description-section">
        <h2>Welcome to the Balanced Team Generator!</h2>
        <p>
          This application is designed for creating balanced sports teams, initially tailored for volleyball but adaptable to other sports as well.
        </p>
        <p className="instruction">
          <strong>Instructions:</strong>
        </p>
        <ol className="instruction-list">
          <li>Manually enter player data with the format "PlayerName: Rating".</li>
          <li>For Spreadsheet, use CSV format "PlayerName, Rating".</li>
          <li>Ratings are in the range [1, 5] with 0.5 differences (e.g., 1, 1.5, 2, 2.5, ..., 4.5, 5.0).</li>
          <li>Team Count must be between 2 and 20.</li>
          <li>Ensure Player Count is greater than or equal to Team Count.</li>
        </ol>
      </div>

      <div className="feature-section">
        <h3>Features:</h3>
        <ul>
          <li>Generate balanced teams with customizable parameters.</li>
          <li>Efficiently process and manage player data.</li>
          <li>Share generated teams with other applications.</li>
          <li>Import player data from Google Sheets.</li>
        </ul>
      </div>

      <div className="how-to-use-section">
        <h3>How to Use:</h3>
        <p>
          Navigate to the "Create Teams" page to input and process player data. Head to the "Generate Team" section to set parameters and generate balanced teams. The app provides a user-friendly interface for an efficient team generation process.
        </p>
      </div>

      <div className="developer-info">
        <p>
          Created by Vickykumar Patel
          <br />
          Software Enginner
          <br />
          Connect on <a href="https://www.linkedin.com/in/vicky-patel-1519a2111/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </p>
      </div>
    </div>
  );
};

export default Home;
