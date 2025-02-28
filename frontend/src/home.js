import React, { useState, useEffect } from 'react';
import './home.css';
import { useNavigate } from 'react-router-dom';

const StaticPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
        setIsLoggedIn(true);
        } else {
        setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = async () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <>
        <header>
            <h1>CMPSC431 Final Project</h1>
            <p>Glen Jiang, George Jiang</p>
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

        <div className="container">
            <div className="main-content">
                <h2>CMPSC 431 Project</h2>
                <p>This is our project for CMPSC 431w
                <br></br>
                <br></br>
                The web app was coded using Flask for the backend and React for the frontend. We cloned the react repository from create-react-app to make the front end implementation simpler.
                <br></br>
                <br></br>
                10 features we implemented
                <br></br>
                <br></br>
                Sign up with a username, email, password (insert)
                <br></br>
                Display my profile page (query)
                <br></br>
                Sort destinations by rating (sort)
                <br></br>
                Insert a review for restaurants (insert)
                <br></br>
                Insert a review for hotels (insert)
                <br></br>
                Insert a review for location (insert)
                <br></br>
                Log in/out feature for users (query)
                <br></br>
                Update ratings after submitting a review (update)
                <br></br>
                Update user info feature (update)
                <br></br>
                Delete account (delete)
                <br></br>
                <br></br>
                8 tables
                <br></br>
                <br></br>
                User, Location, Hotel, Restaurant, ReviewsLocation, ReviewsHotel, ReviewsRestaurant, Photos
                </p>
            </div>
        </div>

        <footer>
            <p>2024 CMPSC431 Final Project - Glen Jiang, George Jiang</p>
        </footer>
        </>
    );
};

export default StaticPage;
