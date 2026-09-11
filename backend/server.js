const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { verifyToken, requireRole } = require('./authMiddleware');

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

// POST: Authenticate user and issue JWT
app.post('/api/login', async (req, res) => {
  const { user_identifier, password } = req.body;

  try {
    // 1. Find user by their identifier
    const userResult = await pool.query(
      `SELECT u.id, u.user_identifier, u.email, u.password_hash, r.name AS role 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.user_identifier = $1`,
      [user_identifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid user identifier or password' });
    }

    const user = userResult.rows[0];

    // 2. Compare submitted password with stored bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid user identifier or password' });
    }

    // 3. Generate a secure JWT valid for 24 hours
    const token = jwt.sign(
      { userId: user.id, role: user.role, identifier: user.user_identifier },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        user_identifier: user.user_identifier,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Admin-only protected route
app.get('/api/admin/dashboard', verifyToken, requireRole(['admin']), (req, res) => {
  res.json({ 
    message: 'Welcome to the Admin Dashboard', 
    admin: req.user 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});