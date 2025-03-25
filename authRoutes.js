const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registrace
router.post('/register', async (req, res) => {
    const { email, name, surname, password, password2 } = req.body;

    if (!email || !name || !surname || !password || !password2) {
        return res.status(400).json({ message: "Vyplňte všechna pole" });
    }

    if (password !== password2) {
        return res.status(400).json({ message: "Hesla se neshodují" });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "E-mail je již registrován" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            name,
            surname,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "Registrace úspěšná" });
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru" });
    }
});

// Přihlášení
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Vyplňte všechna pole" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Špatný e-mail nebo heslo" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Špatný e-mail nebo heslo" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "Strict" });

        res.json({ message: "Přihlášení úspěšné" });
    } catch (error) {
        res.status(500).json({ message: "Chyba serveru" });
    }
});

// Ochrana stránky
router.get('/protected', protectRoute, (req, res) => {
    res.sendFile(__dirname + '/../views/domu.html');
});

module.exports = router;