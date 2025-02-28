import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './home';
import Database from './components/database/database';
import Destination from './components/destination/destination';
import DestinationDetail from './components/destinationdetail/destinationdetail';
import Profile from './components/profile/profile';
import Login from './components/login/login';
import Hotels from './components/hotel/hotel';
import HotelDetail from './components/hoteldetail/hoteldetail';
import Restaurants from './components/restaurant/restaurant';
import RestaurantDetail from './components/restaurantdetail/restaurantdetail';

function App() {
    return (
        <Router>
        <div className="App">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/database" element={<Database />} />
            <Route path="/destination" element={<Destination />} />
            <Route path="/destination/:id" element={<DestinationDetail />} />
            <Route path="/hotels/:id" element={<Hotels />} />
            <Route path="/hotels/:locationid/:hotelid" element={<HotelDetail />} />
            <Route path="/restaurants/:id" element={<Restaurants />} />
            <Route path="/restaurants/:locationid/:restaurantid" element={<RestaurantDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            </Routes>
        </div>
        </Router>
    );
}

export default App;