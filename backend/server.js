const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'healthy', database_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Register a new user and profile
app.api = app.post('/api/register', async (req, res) => {
  const { user_identifier, email, password, role_id, first_name, last_name, phone, date_of_birth, address } = req.body;

  try {
    // 1. Hash the password securely
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 2. Use a transaction to ensure both tables populate safely
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert into master users table
      const userResult = await client.query(
        `INSERT INTO users (user_identifier, email, password_hash, role_id) 
         VALUES ($1, $2, $3, $4) RETURNING id, user_identifier, email, role_id, created_at`,
        [user_identifier, email, password_hash, role_id]
      );
      const newUser = userResult.rows[0];

      // Insert into profiles table
      await client.query(
        `INSERT INTO profiles (user_id, first_name, last_name, phone, date_of_birth, address) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newUser.id, first_name, last_name, phone, date_of_birth, address]
      );

      await client.query('COMMIT');
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});