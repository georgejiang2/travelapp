import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './destinationdetail.css';

const DestinationDetail = () => {
    const { id } = useParams();
    const [destination, setDestination] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState(0);
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
        const fetchDestinationDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/locations/${id}`);
                setDestination(response.data);
            } catch (error) {
                console.error('Error fetching destination details:', error);
            }
        };

        const fetchPhotos = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/photos/${id}`);
                setPhotos(response.data);
            } catch (error) {
                console.error('Error fetching photos:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/locations/reviews/${id}`);
                
                const valid = response.data.map((review) => {
                    console.log(review.date);
                    return review;
                });
                console.log(valid);
                setReviews(valid);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchDestinationDetails();
        fetchPhotos();
        fetchReviews();

        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
    }, [id]);

    const handleBackClick = () => {
        navigate('/Destination');
    };

    const handleViewHotels = () => {
        navigate(`/hotels/${id}`);
    };

    const handleViewRestaurants = () => {
        navigate(`/restaurants/${id}`);
    };

    const handleReviewChange = (e) => {
        setDescription(e.target.value);
    };

    const handleRatingChange = (e) => {
        setRating(Number(e.target.value));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!description.trim()) {
        alert('Please write a review before submitting.');
        return;
        }

        if (rating === 0) {
        alert('Please select a rating.');
        return;
        }

        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                alert('You must be logged in to submit a review.');
                return;
            }

            const response = await axios.post(
                `http://127.0.0.1:5000/api/locations/reviews/${id}`,
                {'description': description,'rating': rating},
            );

            setReviews((prevReviews) => [
                ...prevReviews,
                { description, rating, user: 'Current User', date: new Date().toISOString() }
            ]);
            setDescription('');
            setRating(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <div>
            <header>
                <h1>{destination.LocationName}</h1>
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
            <div className="destination-detail">
                <h3>{destination.LocationName}, {destination.Country}</h3>
                <p>Rating: {destination.Rating}/5</p>

                <button onClick={handleViewHotels}>View Hotels</button>
                <button onClick={handleViewRestaurants}>View Restaurants</button>

                <div className="destination-photos">
                    <h3>Photos</h3>
                    <div className="photo-gallery">
                        {photos.length > 0 ? (
                            photos.map((photo) => (
                                <div className="photo-container" key={photo.PhotoID}>
                                    <img 
                                        src={photo.URL} 
                                        alt={`Photo of ${photo.LocationName}`} 
                                        className="photo-image" 
                                    />
                                    <div className="caption">
                                        {photo.Description}
                                    </div>
                                </div>
                            ))
                            ) : (
                            <p>No photos available for this location.</p>
                        )}
                    </div>
                </div>
            
                <div className="reviews-section">
                    <h3>Reviews</h3>
                    {reviews.length > 0 ? (
                        <div className="reviews-list">
                        {reviews.map((review, index) => (
                            <div key={index} className="review-item">
                            <p>Date: {review.Date}</p>
                            <p>Rating: {review.Rating} / 5</p>
                            <p>{review.Description}</p>
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p>No reviews yet.</p>
                    )}

                    {isLoggedIn && (
                        <div className="review-form">
                        <textarea
                            value={description}
                            onChange={handleReviewChange}
                            placeholder="Write a review..."
                            rows="4"
                        />
                        <div className="rating">
                            <label>Select a Rating: </label>
                            {[1, 2, 3, 4, 5].map((num) => (
                            <label key={num}>
                                <input
                                type="radio"
                                name="rating"
                                value={num}
                                checked={rating === num}
                                onChange={handleRatingChange}
                                />
                                {num}
                            </label>
                            ))}
                        </div>
                        <button onClick={handleReviewSubmit}>Submit Review</button>
                        </div>
                    )}
                    {!isLoggedIn && <p>You must be logged in to write a review.</p>}
                </div>
            </div>
            <button className="back" onClick={handleBackClick}>Back to Destinations</button>
        </div>
    );
};

export default DestinationDetail;
