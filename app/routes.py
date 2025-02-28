from flask import Flask, request, jsonify, Blueprint, current_app
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import re
from datetime import datetime

main = Blueprint('main', __name__)

def get_db_connection():
    return mysql.connector.connect(app)

@main.route('/api/users', methods=['GET'])
def get_users():
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM User")
        users = cursor.fetchall()
        cursor.close()
        connection.close()

        user_list = [{"Username": user['Username'], "Email": user['Email'], "Password": user['Password']} for user in users]
        return jsonify(user_list)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})

@main.route('/api/users', methods=['POST'])
def add_user():
    data = request.get_json()

    username = data.get('Username')
    email = data.get('Email')
    password = data.get('Password')

    hashed_password = generate_password_hash(password)
    print(hashed_password)
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor()

        query = "SELECT COUNT(*) FROM User WHERE Username = %s"
        cursor.execute(query, (username,))
        
        result = cursor.fetchone()
        
        if result[0] > 0:
            return jsonify({"message": "Username already taken"})
        
        query = "INSERT INTO User (Username, Email, Password) VALUES (%s, %s, %s)"
        cursor.execute(query, (username, email, hashed_password))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "User added successfully!"})

    except mysql.connector.Error as err:
        return jsonify({"message": f"An error occurred: {str(err)}"})
    

@main.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('Username')
    password = data.get('Password')

    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor()

        query = "SELECT Password FROM User WHERE Username = %s"
        cursor.execute(query, (username,))

        user = cursor.fetchone()

        if not user:
            cursor.close()
            connection.close()
            return jsonify({"message": "Invalid username or password!"})

        actual = user[0]

        if not check_password_hash(actual, password):
            cursor.close()
            connection.close()
            return jsonify({"message": "Invalid username or password!"})

        cursor.close()
        connection.close()
        return jsonify({"message": "Login successful!"}), 200

    except mysql.connector.Error as err:
        return jsonify({"message": f"An error occurred: {str(err)}"})


@main.route('/api/profile/<username>', methods=['GET'])
def get_profile(username):
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM User WHERE Username = %s"
        cursor.execute(query, (username,))

        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if user:
            return jsonify(user)
        else:
            return jsonify({"message": "User not found"})

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})
    
@main.route('/api/profiledelete', methods=['POST'])
def delete_user():
    try:
        data = request.get_json()
        username = data.get('Username')
        
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = "DELETE FROM USER WHERE Username = %s"
        cursor.execute(query, (username,))
        
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Deletion successful"})

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"})

@main.route('/api/locations', methods=['GET'])
def get_locations():
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Location")
        locations = cursor.fetchall()
        cursor.close()
        connection.close()
        location_list = [{"LocationID": location['LocationID'], "LocationName": location['LocationName'], "Country": location['Country'], "Rating": location['Rating']} for location in locations]
        return jsonify(location_list)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})


@main.route('/api/locations/sortinc', methods=['GET'])
def sort_inc_locations():
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Location ORDER BY Rating")
        locations = cursor.fetchall()
        cursor.close()
        connection.close()
        location_list = [{"LocationID": location['LocationID'], "LocationName": location['LocationName'], "Country": location['Country'], "Rating": location['Rating']} for location in locations]
        return jsonify(location_list)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})
    

@main.route('/api/locations/sortdesc', methods=['GET'])
def sort_desc_locations():
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Location ORDER BY Rating DESC")
        locations = cursor.fetchall()
        cursor.close()
        connection.close()
        location_list = [{"LocationID": location['LocationID'], "LocationName": location['LocationName'], "Country": location['Country'], "Rating": location['Rating']} for location in locations]
        return jsonify(location_list)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})

@main.route('/api/locations/<int:location_id>', methods=['GET'])
def get_location(location_id):
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Location WHERE LocationID = %s"
        cursor.execute(query, (location_id,))
        location = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return jsonify(location)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})

@main.route('/api/photos/<int:location_id>', methods=['GET'])
def get_photos(location_id):
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Photos WHERE LocationID = %s"
        cursor.execute(query, (location_id,))
        photos = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return jsonify(photos)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})

@main.route('/api/restaurants/<int:location_id>', methods=['GET'])
def get_restaurants(location_id):
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Restaurant WHERE LocationID = %s"
        cursor.execute(query, (location_id,))
        restaurants = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return jsonify(restaurants)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})

@main.route('/api/hotels/<int:location_id>', methods=['GET'])
def get_hotels(location_id):
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Hotel WHERE LocationID = %s"
        cursor.execute(query, (location_id,))
        hotels = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return jsonify(hotels)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})
    

@main.route('/api/locations/reviews/<int:location_id>', methods=['POST'])
def add_location_review(location_id):
    data = request.get_json()
    
    description = data.get('description')
    rating = data.get('rating')
    
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor()

        today_date = datetime.today().date()

        query = "INSERT INTO ReviewsLocation (LocationID, Rating, Description, Date) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (location_id, rating, description, today_date))
        connection.commit()

        avg = "SELECT AVG(Rating) AS avg FROM ReviewsLocation WHERE LocationID = %s"
        cursor.execute(avg, (location_id,))
        result = cursor.fetchone()
        
        update = "UPDATE Location SET Rating = %s WHERE LocationID = %s"
        cursor.execute(update, (round(result[0], 1), location_id))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Review added successfully!"})

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"})



@main.route('/api/locations/reviews/<int:location_id>', methods=['GET'])
def get_location_review(location_id):
    
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM ReviewsLocation WHERE LocationID = %s"
        cursor.execute(query, (location_id, ))

        reviews = cursor.fetchall()

        for review in reviews:
            review['Date'] = review['Date'].strftime('%Y-%m-%d')
        cursor.close()
        connection.close()

        return jsonify(reviews)

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"})


@main.route('/api/hotels/reviews/<int:hotel_id>', methods=['POST'])
def add_hotel_review(hotel_id):
    data = request.get_json()
    
    description = data.get('description')
    rating = data.get('rating')
    
    if not description or not rating:
        return jsonify({"message": "ReviewText and Rating are required!"})

    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor()

        today_date = datetime.today().date()

        query = "INSERT INTO ReviewsHotel (HotelID, Rating, Description, Date) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (hotel_id, rating, description, today_date))
        connection.commit()

        avg = "SELECT AVG(Rating) AS avg FROM ReviewsHotel WHERE HotelID = %s"
        cursor.execute(avg, (hotel_id,))
        result = cursor.fetchone()
        
        update = "UPDATE Hotel SET Rating = %s WHERE HotelID = %s"
        cursor.execute(update, (round(result[0], 1), hotel_id))
        connection.commit()
        
        cursor.close()
        connection.close()

        return jsonify({"message": "Review added successfully!"})

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"})


@main.route('/api/hotels/reviews/<int:location_id>', methods=['GET'])
def get_hotel_review(location_id):
    
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = "SELECT * FROM ReviewsHotel WHERE HotelID = %s"
        cursor.execute(query, (location_id, ))

        reviews = cursor.fetchall()
        
        for review in reviews:
            review['Date'] = review['Date'].strftime('%Y-%m-%d')
        cursor.close()
        connection.close()

        return jsonify(reviews)

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"})
    
@main.route('/api/restaurants/reviews/<int:restaurant_id>', methods=['POST'])
def add_restaurant_review(restaurant_id):
    data = request.get_json()
    
    description = data.get('description')
    rating = data.get('rating')

    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor()

        today_date = datetime.today().date()

        query = "INSERT INTO ReviewsRestaurant (RestaurantID, Rating, Description, Date) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (restaurant_id, rating, description, today_date))
        connection.commit()

        avg = "SELECT AVG(Rating) AS avg FROM ReviewsRestaurant WHERE RestaurantID = %s"
        cursor.execute(avg, (restaurant_id,))
        result = cursor.fetchone()
        
        update = "UPDATE Restaurant SET Rating = %s WHERE RestaurantID = %s"
        cursor.execute(update, (round(result[0], 1), restaurant_id))
        connection.commit()
        
        cursor.close()
        connection.close()

        return jsonify({"message": "Review added successfully!"})

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"})


@main.route('/api/restaurants/reviews/<int:location_id>', methods=['GET'])
def get_restaurant_review(location_id):
    
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)

        query = "SELECT * FROM ReviewsRestaurant WHERE RestaurantID = %s"
        cursor.execute(query, (location_id, ))

        reviews = cursor.fetchall()
        
        for review in reviews:
            review['Date'] = review['Date'].strftime('%Y-%m-%d')
        cursor.close()
        connection.close()
        
        return jsonify(reviews)

    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"})


@main.route('/api/restaurants/<int:location_id>/<int:restaurant_id>', methods=['GET'])
def get_restaurant(location_id, restaurant_id):
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Restaurant WHERE RestaurantID = %s"
        cursor.execute(query, (restaurant_id,))
        restaurant = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return jsonify(restaurant)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})
    

@main.route('/api/hotels/<int:location_id>/<int:hotel_id>', methods=['GET'])
def get_hotel(location_id, hotel_id):
    try:
        connection = current_app.get_db_connection()
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM Hotel WHERE HotelID = %s"
        cursor.execute(query, (hotel_id,))
        hotel = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return jsonify(hotel)

    except mysql.connector.Error as err:
        return jsonify({"message": f"error: {err}"})
    