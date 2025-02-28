import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './database.css';

const Database = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
        fetchUsers();
    }, []);

    const handleAddUser = async (event) => {
        event.preventDefault();
        if (!username || !password || !email) {
            setError('Please fill out all fields.');
            return;
        }
        try {
            const newUser = {
                Username: username,
                Email: email,
                Password: password,
            };

            const response = await axios.post('http://127.0.0.1:5000/api/users', newUser);
            if (response.data['message'] == "Username already taken") {
                setError('Username already taken');
                return;  
            }
            fetchUsers();

            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div>
            <header>
                <h1>User Database</h1>
            </header>
            <nav>
                <a href="/">Home</a>
                <a href="/Destination">Destinations</a>
                {isLoggedIn && <a href="/Profile">My Profile</a>}
                {isLoggedIn ? (
                <a onClick={handleLogout}>Logout</a>
                ) : (
                <a href="/Login">Login</a>
                )}
            </nav>

            <div className="main-content">
                <h2>Add New User</h2>
                <form onSubmit={handleAddUser}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit">Add User</button>
                </form>
                {error && <div className="error-message">{error}</div>}
                <h2>List of Users</h2>
                <table>
                <thead>
                    <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                    users.map((user, index) => (
                        <tr key={index}>
                        <td>{user.Username}</td>
                        <td>{"******@******.******"}</td>
                        <td>{"******************"}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="3">No users found</td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </div>
    );
};

export default Database;
