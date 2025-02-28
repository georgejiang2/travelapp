import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import defaultpic from './9307950.png';

const Profile = () => {
    const [userProfile, setUserProfile] = useState({
        username: '',
        email: '',
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const storedUsername = localStorage.getItem('username');

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('userToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const response = await axios.get(`http://127.0.0.1:5000/api/profile/${storedUsername}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        const user = response.data;
        setUserProfile(userProfile => ({
            ...userProfile,
            username: user.Username,
            email: user.Email,
        }));
        
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
        setIsLoggedIn(false);
        navigate('/login');
        } else {
        setIsLoggedIn(true);
        fetchUserProfile();
        }
    }, [navigate]);

    const handleDeleteUser = async () => {
        try {
            const deleteduser = {
                Username: storedUsername,
            };
    
            const response = await axios.post('http://127.0.0.1:5000/api/profiledelete', deleteduser);
    
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        navigate('/login');
    }

    const handleLogout = async () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="profile-container">
            <header>
                <h1>User Profile</h1>
            </header>
            <nav>
                <a href="/">Home</a>
                <a href="/Destination">Destinations</a>
                {isLoggedIn && <a href="/Profile">My Profile</a>}
                {isLoggedIn ? ( <a onClick={handleLogout}>Logout</a>): (<a href="/Login">Login</a>)}
            </nav>

            <div className="profile-content">
                <h2>{storedUsername}'s profile</h2>
                <div className="profile-info">
                    <div className="profile-image">
                        <img
                        src={defaultpic}
                        alt="Profile"
                        className="profile-img"
                        />
                    </div>

                    <div className="profile-details">
                        <div>
                            <strong>Username: </strong>
                            <span>{userProfile.username}</span>
                        </div>
                        <div>
                            <strong>Email: </strong>
                            <span>{userProfile.email}</span>
                        </div>
                        <div>
                            <strong>Password: </strong>
                            <span>**********</span>
                        </div>
                    </div>
                    <button className="delete-account-btn" onClick={handleDeleteUser}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
