import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './restaurantdetail.css';

const RestaurantDetail = () => {
    const { locationid, restaurantid } = useParams();
    const [restaurant, setRestaurant] = useState([]);
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
        const fetchRestaurantDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/restaurants/${locationid}/${restaurantid}`);
                
                setRestaurant(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/api/restaurants/reviews/${restaurantid}`);
                
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

        fetchRestaurantDetails();
        fetchReviews();

        const token = localStorage.getItem('userToken');
        setIsLoggedIn(!!token);
    }, [restaurantid]);

    const handleBackClick = () => {
        navigate(`/restaurants/${locationid}`);
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

            const response = await axios.post(`http://127.0.0.1:5000/api/restaurants/reviews/${restaurantid}`, {'description': description,'rating': rating},);

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
                <h1>{restaurant.RestaurantName}</h1>
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
                <h3>{restaurant.RestaurantName}</h3>
                <i>{restaurant.Cuisine} Cuisine</i>
                <p>Rating: {restaurant.Rating}/5</p>
                
                <h3>Description</h3>
                <p>{restaurant.Description}</p>

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
            <button className="back" onClick={handleBackClick}>Back to Restaurants</button>
        </div>
    );
};

export default RestaurantDetail;
