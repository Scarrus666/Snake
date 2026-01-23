const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for high scores (optional)
let highScores = [];

app.get('/api/highscores', (req, res) => {
    res.json(highScores);
});

app.post('/api/highscores', (req, res) => {
    const { name, score, level } = req.body;
    const newScore = {
        id: Date.now(),
        name: name || 'Anonymous',
        score,
        level: level || 'medium',
        date: new Date().toISOString()
    };
    
    highScores.push(newScore);
    // Keep only top 10 scores
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);
    
    res.status(201).json(newScore);
});

// Start server
app.listen(PORT, () => {
    console.log(`🐍 Snake Game Server running on:`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`🌐 Network: http://${getLocalIP()}:${PORT}`);
});

// Helper function to get local IP address
function getLocalIP() {
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}