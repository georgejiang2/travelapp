import React, { useState, useEffect } from 'react';
import './destination.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Destination = () => {
    const [locations, setLocations] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const fetchLocations = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5000/api/locations');
          setLocations(response.data);
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
    };

    const sortLocationsInc = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5000/api/locations/sortinc');
          setLocations(response.data);
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
    };
    const sortLocationsDesc = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5000/api/locations/sortdesc');
          setLocations(response.data);
        } catch (error) {
          console.error('Error fetching locations:', error);
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('userToken');
        setIsLoggedIn(false);
        navigate('/login');
    };

    useEffect(() => {
        fetchLocations();
        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleDestinationClick = (destination) => {
        navigate(`/destination/${destination.LocationID}`);
    };

    return (
        <div>
            <header>
              <h1>Vacation Destinations</h1>
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

            <div className="destination-content">
                <div className = "sorting">
                    <h2>Select a Destination</h2>
                    <button onClick={sortLocationsInc}>Sort Ascending</button>
                    <button onClick={sortLocationsDesc}>Sort Descending</button>
                </div>
                <ol>
                    {locations.map((destination) => (
                    <li
                      key={destination.LocationID}
                      onClick={() => handleDestinationClick(destination)}
                      className="destination-item"
                    >
                        <div className="destination-name">
                            {destination.LocationName} ({destination.Country})
                        </div>
                        <div className="destination-rating">
                            <span>{`Rating: ${destination.Rating} / 5`}</span>
                        </div>
                    </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

export default Destination;
