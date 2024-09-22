const express = require('express');
const path = require('path');
const cors = require('cors');
const sendMail = require('./nodemailer/sendMial');


const app = express();
const port = process.env.PORT || 4500;
const code = 231524;

app.options('*', cors());

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// API routes
app.get('/authenticate', (req, res) => {
    res.json({ code });
});

app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/sendMail", sendMail);

app.post('/verify', (req, res) => {
    const { code: inputCode } = req.body;
    if (inputCode == code) {
        res.json({ success: true, message: 'success' });
    } else {
        res.json({ success: false, message: 'Invalid code' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log("Listening on port " + port);
});
