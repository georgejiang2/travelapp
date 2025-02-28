import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleLogin = async (event) => {
        event.preventDefault();
        if (!username || !password) {
            setError('Please fill out both fields.');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', {
                Username: username,
                Password: password,
            });
            
            if (response.status === 200) {
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('username', username);
                navigate('/database');
            }
        } catch (error) {
            if (error.response) {
                console.log('Error:', error.response.data.message);
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                
                <label htmlFor="password">Password:</label>
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                
                <button type="submit">Login</button>
            </form>
            
            <p>Don't have an account? <a href="/database">Sign up</a></p>
        </div>
    );
};

export default Login;
