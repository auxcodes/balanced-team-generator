import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../constants/path';

// Define the type for the onLogin prop
interface LoginPageProps {
  onLogin: (isLoggedIn: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const navigate = useNavigate(); // Initialize navigate function

    const [loginMode, setLoginMode] = useState(true);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (loginMode) {
            // Handle login
            console.log('Logging in with:', email, password);
            if(email === 'bappi@btg.com' && password === 'Btg123'){
                // Assuming login is successful
                onLogin(true);
                navigate(PATH.HOME_PATH);
            }
        } else {
            // Handle signup
            console.log('Signing up with:', firstName, lastName, email, password);
            // Assuming signup is successful
            onLogin(false);
        }
    };

    const toggleMode = () => {
        setLoginMode(!loginMode);
    };

    return (
        <div className="login-page">
            <h2>{loginMode ? 'Login' : 'Sign Up'}</h2>
            <form onSubmit={handleSubmit}>
                {!loginMode && (
                    <div className="form-row">
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                )}
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} maxLength={15} pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$" required />
                {!loginMode && (
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                )}
                <button type="submit">{loginMode ? 'Login' : 'Sign Up'}</button>
            </form>
            <p>{loginMode ? 'Don\'t have an account? ' : 'Already have an account? '}<span onClick={toggleMode}>{loginMode ? 'Sign up' : 'Login'}</span></p>
        </div>
    );
};

export default LoginPage;
