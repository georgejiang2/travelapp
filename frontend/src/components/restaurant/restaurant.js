import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './restaurant.css';

const Restaurants = () => {
    const {id} = useParams();
    const [restaurants, setRestaurants] = useState([]);
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
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/restaurants/${id}`);
                setRestaurants(response.data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };
        fetchRestaurants();
    }, [id]);

    const handleRestaurantClick = (restaurants) => {
        navigate(`/restaurants/${id}/${restaurants.RestaurantID}`);
    };

    const handleBackClick = () => {
        navigate(`/destination/${id}`);
    };

    return (
        <div>
            <header>
                <h1>Restaurants</h1>
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
            <div className="restaurant-list">
                <h2>Restaurants</h2>
                {restaurants.length > 0 ? (
                <ol>
                {restaurants.map((restaurants) => (
                    <li
                    key={restaurants.Restaurant}
                    onClick={() => handleRestaurantClick(restaurants)}
                    className="restaurant-item"
                    >
                    <div className="restaurant-name">
                        {restaurants.RestaurantName}
                    </div>
                    <div className="restaurant-rating">
                        <span>{`Rating: ${restaurants.Rating} / 5`}</span>
                    </div>
                    </li>
                ))}
                </ol>
                ) : (
                <p>No restaurants found for this location.</p>
                )}
            </div>
            <button className="back" onClick={handleBackClick}>Back to Destination</button>
        </div>
    );
};

export default Restaurants;
