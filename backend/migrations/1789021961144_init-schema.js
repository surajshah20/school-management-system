exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20) UNIQUE NOT NULL
    );

    INSERT INTO roles (name) VALUES ('admin'), ('teacher'), ('student');

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        user_identifier VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role_id INT REFERENCES roles(id) ON DELETE RESTRICT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE profiles (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        address TEXT
    );
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE profiles;
    DROP TABLE users;
    DROP TABLE roles;
  `);
};