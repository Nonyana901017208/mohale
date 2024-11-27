// Import required modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing application/json

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'react', // Your database name (adjust if necessary)
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Routes

// Registration route (POST: /register)
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if the user already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (result.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Insert new user into the database (plain text password for simplicity)
    db.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password],
      (err) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ message: 'Failed to register user' });
        }
        res.status(201).json({ message: 'Registration successful' });
      }
    );
  });
});

// Login route (POST: /login)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  // Check if the user exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    // If no user is found with that username
    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = result[0];

    // Compare the entered password with the stored password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ success: true, message: 'Login successful' });
  });
});

// User management routes

// Get all users
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users' });
    }
    res.json(results);
  });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error checking username:', err);
      return res.status(500).json({ message: 'Error checking username' });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Insert the new user into the database
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
      if (err) {
        console.error('Error adding user:', err);
        return res.status(500).json({ message: 'Error adding user' });
      }
      res.status(201).json({ message: 'User added successfully' });
    });
  });
});

// Update a user's password
app.put('/api/users/:username', (req, res) => {
  const { username } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  // Update the user's password
  db.query('UPDATE users SET password = ? WHERE username = ?', [password, username], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Error updating user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  });
});

// Delete a user
app.delete('/api/users/:username', (req, res) => {
  const { username } = req.params;

  db.query('DELETE FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  });
});

// Routes for product management

// Retrieve all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// Add a new product
app.post('/api/products', (req, res) => {
  const { name, description, category, price, quantity } = req.body;
  const query = 'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, description, category, price, quantity], (err, result) => {
    if (err) {
      console.error('Error adding product:', err);
      return res.status(500).json({ message: 'Failed to add product' });
    }
    res.status(201).json({ message: 'Product added successfully' });
  });
});

// Update product quantity by ID
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const { quantity } = req.body;
  const query = 'UPDATE products SET quantity = ? WHERE id = ?';
  db.query(query, [quantity, productId], (err, result) => {
    if (err) {
      console.error('Error updating product quantity:', err);
      return res.status(500).json({ message: 'Failed to update quantity' });
    }
    res.json({ message: 'Product quantity updated successfully' });
  });
});

// Delete a product by ID
app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [productId], (err, result) => {
    if (err) {
      console.error('Error deleting product:', err);
      return res.status(500).json({ message: 'Failed to delete product' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});
// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
