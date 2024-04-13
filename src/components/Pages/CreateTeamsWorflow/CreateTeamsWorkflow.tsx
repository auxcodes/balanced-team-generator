import React, { useState } from 'react';
import './CreateTeamsWorkflow.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCheckCircle, faCircle as faSolidCircle} from '@fortawesome/free-solid-svg-icons';
import { faCircle as faRegularCircle } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import DisplayTeams from './DisplayTeams/DisplayTeams';
import TeamSelection from './TeamSelection/TeamSelection';
import ConfirmSelection from './ConfirmSelection/ConfirmSelection';
import PlayersImport from './PlayersImport/PlayersImport';
import { PlayerModel } from './Models/CreateTeamsModels';

const CreateTeamsWorkflow = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [playersData, setPlayersData] = useState<PlayerModel[]>([]);


    const handleNext = () => {
        if (activeStep < 4) {
            setActiveStep(activeStep + 1);
            setTaskCompleted(false);
        }
    };

    const handleBack = () => {
        if (activeStep > 1) {
            setActiveStep(activeStep - 1);
            setTaskCompleted(false);
        }
    };

    const handleTaskComplete = () => {
        setTaskCompleted(true);
    };

    return (
        <div className="create-teams-workflow">
            <div className="tabs">
                <div className={`tab ${activeStep === 1 ? 'active' : ''}`} onClick={() => setActiveStep(1)}>
                    <FontAwesomeIcon icon={(taskCompleted && activeStep >= 1 ? faCheckCircle: faSolidCircle) as IconProp} className="dot-icon" />
                </div>
                <div className={`tab ${activeStep === 2 && taskCompleted ? 'active' : ''}`} onClick={() => setActiveStep(2)}>
                    <FontAwesomeIcon icon={(taskCompleted && activeStep >= 2 ? faCheckCircle : faRegularCircle) as IconProp} className="dot-icon" />
                </div>
                <div className={`tab ${activeStep === 3 && taskCompleted ? 'active' : ''}`} onClick={() => setActiveStep(3)}>
                    <FontAwesomeIcon icon={(taskCompleted && activeStep >= 3 ? faCheckCircle : faRegularCircle) as IconProp} className="dot-icon" />
                </div>
                <div className={`tab ${activeStep === 4 && taskCompleted ? 'active' : ''}`} onClick={() => setActiveStep(4)}>
                    <FontAwesomeIcon icon={(taskCompleted && activeStep >= 4 ? faCheckCircle : faRegularCircle) as IconProp} className="dot-icon" />
                </div>
            </div>

            <div className="content">
                {activeStep === 1 && (
                    <div>
                        <h2>Import Players</h2>
                        <PlayersImport playersData={playersData} setPlayersData={setPlayersData}/>
                        <p>
                        <button onClick={handleNext} disabled={playersData.length === 0}>
                            <FontAwesomeIcon icon={faChevronRight as IconProp} />
                        </button>
                        </p>
                    </div>
                )}
                {activeStep === 2 && (
                    <div>
                        <h2>Step 2</h2>
                        <p>Set Number of Teams and select playing Players.</p>
                        <TeamSelection playersData={playersData}/>
                        <div>
                            <button onClick={handleBack}>
                                <FontAwesomeIcon icon={faChevronLeft as IconProp} />
                            </button>
                            <button onClick={handleNext} disabled={!taskCompleted}>
                                <FontAwesomeIcon icon={faChevronRight as IconProp} />
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 3 && (
                    <div>
                        <h2>Step 3</h2>
                        <p>Confirm Players & Ratings then Generate.</p>
                        <ConfirmSelection/>
                        <div>
                            <button onClick={handleBack}>
                                <FontAwesomeIcon icon={faChevronLeft as IconProp} />
                            </button>
                            <button onClick={handleNext} disabled={!taskCompleted}>
                                <FontAwesomeIcon icon={faChevronRight as IconProp} />
                            </button>
                        </div>
                    </div>
                )}
                {activeStep === 4 && (
                    <div>
                        <h2>Step 4</h2>
                        <p>Display Teams & Share it.</p>
                        <DisplayTeams />
                        <button onClick={handleBack}>
                            <FontAwesomeIcon icon={faChevronLeft as IconProp} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateTeamsWorkflow;
