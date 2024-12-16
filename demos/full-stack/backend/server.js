const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/slackware_learning', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    progress: {
        currentLevel: { type: Number, default: 0 },
        completedLevels: [Number]
    }
});

const User = mongoose.model('User', model);

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findOne({ _id: decoded._id });
        
        if (!user) {
            throw new Error();
        }
        
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        
        const user = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await user.save();
        const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
        
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('Unable to login');
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            throw new Error('Unable to login');
        }
        
        const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

app.get('/api/progress', auth, async (req, res) => {
    res.send(req.user.progress);
});

app.post('/api/progress', auth, async (req, res) => {
    try {
        const { currentLevel, completedLevel } = req.body;
        
        req.user.progress.currentLevel = currentLevel;
        if (!req.user.progress.completedLevels.includes(completedLevel)) {
            req.user.progress.completedLevels.push(completedLevel);
        }
        
        await req.user.save();
        res.send(req.user.progress);
    } catch (e) {
        res.status(400).send(e);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
