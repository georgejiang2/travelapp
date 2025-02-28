from flask import Flask, g
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

def create_app():
    app = Flask(__name__)

    app.config['HOST'] = 'localhost'
    app.config['USER'] = 'root'
    app.config['PASSWORD'] = ''
    app.config['DATABASE'] = 'mydatabase'

    CORS(app)

    def get_db_connection():
        try:
            conn = mysql.connector.connect(
                host=app.config['HOST'],
                user=app.config['USER'],
                password=app.config['PASSWORD'],
                database=app.config['DATABASE']
            )
            if conn.is_connected():
                return conn
        except Error as e:
            print(f"Error while connecting to MySQL: {e}")
            return None

    app.get_db_connection = get_db_connection

    from .routes import main
    app.register_blueprint(main)

    return app
