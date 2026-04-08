const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getSheetData, writeSheetData, uuidv4 } = require('../db/excel');

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    let users = getSheetData('Users');
    const userExists = users.find(u => u.username === username);
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { id: uuidv4(), username, password: hashedPassword };
    users.push(newUser);
    writeSheetData('Users', users);

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'super_secret', { expiresIn: '30d' });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during Excel registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    let users = getSheetData('Users');
    const user = users.find(u => u.username === username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'super_secret', { expiresIn: '30d' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = { registerUser, loginUser };
