import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './hotel.css';

const Hotels = () => {
    const { id } = useParams();
    const [hotels, setHotels] = useState([]);
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
        const fetchHotels = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/hotels/${id}`);
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };
        fetchHotels();
    }, [id]);

    const handleHotelClick = (hotel) => {
        navigate(`/hotels/${id}/${hotel.HotelID}`);
    };

    const handleBackClick = () => {
        navigate(`/destination/${id}`);
    };

    return (
        <div>
            <header>
                <h1>Hotels in Destination</h1>
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
            <div className="hotel-list">
                <h2>Hotels in Destination</h2>
                {hotels.length > 0 ? (
                <ol>
                {hotels.map((hotel) => (
                    <li
                    key={hotel.HotelID}
                    onClick={() => handleHotelClick(hotel)}
                    className="hotel-item"
                    >
                    <div className="hotel-name">
                        {hotel.HotelName}
                    </div>
                    <div className="hotel-rating">
                        <span>{`Rating: ${hotel.Rating} / 5`}</span>
                    </div>
                    </li>
                ))}
                </ol>
                ) : (
                    <p>No hotels found for this location.</p>
                )}
            </div>
            <button className="back" onClick={handleBackClick}>Back to Destination</button>
        </div>
    );
};

export default Hotels;
