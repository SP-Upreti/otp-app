const express = require('express');
const app = express();
const cors = require('cors');
// const nodemailer = require("nodemailer");
const sendMail = require("./nodemailer/sendMial")
app.options('*', cors()); // Enable preflight requests for all routes

app.use(cors());

const port = 4500;
const code = 231524;

app.use(express.json());

app.get('/authenticate', (req, res) => {
    res.json({ code });
});

app.get("/", (req, res) => {
    res.send("Hello")
})

app.post("/sendMail", sendMail);

app.post('/verify', (req, res) => {
    const { code: inputCode } = req.body;
    if (inputCode == code) {
        res.json({ success: true, message: 'success' });
    } else {
        res.json({ success: false, message: 'Invalid code' });
    }
});

app.listen(port, () => {
    console.log("Listening on port " + port);
});
