require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const router = express.Router();

const app = express();
const PORT = 3000; // Port pro server


const config = {
    mysqlOptions: {
        server: '127.0.0.1',
        port: 3307
    },
    username: 'root',
    password: '',
    database: 'treninky'
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Připojení k MySQL databázi
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Chyba připojení k DB:', err);
        return;
    }
    console.log('✅ Připojeno k MySQL');
});


//REGISTRACE
router.post('/register', async (req, res) => {
    console.log('Přijatý požadavek:', req.body); // Log přijatých dat

    const { email, jmeno, prijmeni, heslo, heslo2 } = req.body;

    if (!email || !jmeno || !prijmeni || !heslo) {
        return res.status(400).json({ message: 'Chybí požadovaná pole' });
    }

    if (heslo !== heslo2) {
        return res.status(400).json({ message: 'Hesla se neshodují' });
    }

    try {
        const hashedPassword = await bcrypt.hash(heslo, 10);
        console.log('Hashované heslo:', hashedPassword);

        db.query(
            'INSERT INTO uzivatele (email, jmeno, prijmeni, heslo) VALUES (?, ?, ?, ?)',
            [email.trim(), jmeno.trim(), prijmeni.trim(), hashedPassword],
            (err, result) => {
                if (err) {
                    console.error('Chyba při registraci:', err);
                    return res.status(500).json({ message: 'Chyba při registraci', error: err });
                }

                console.log('Uživatel zaregistrován:', result);
                res.json({ message: 'Registrace úspěšná' });
            }
        );
    } catch (err) {
        console.error('Chyba při hashování hesla:', err);
        return res.status(500).json({ message: 'Chyba při hashování hesla', error: err });
    }
});



//PRIHLASENI
router.post('/login', (req, res) => {
    const { email, heslo } = req.body;

    db.query('SELECT * FROM uzivatele WHERE email = ?', [email.trim()], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Uživatel nenalezen' });
        }

        const uzivatel = results[0];
        const hesloOk = await bcrypt.compare(heslo, uzivatel.heslo);

        if (!hesloOk) return res.status(400).json({ message: 'Špatné heslo' });

        res.json({ message: 'Přihlášení úspěšné', user: { id: uzivatel.id, email: uzivatel.email } });
    });
});

module.exports = router;

// Endpoint pro uložení tréninku
app.post('/api/pridat', (req, res) => {
    const { sport, podnazev, gym, trener, datum, zacatek, konec, dovednost, kategorie } = req.body;

    const sql = `INSERT INTO treninky (sport, podnazev, gym, trener, datum, zacatek, konec, dovednost, kategorie)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        sport, podnazev, gym, trener, datum, zacatek, konec,
        JSON.stringify(dovednost), JSON.stringify(kategorie)
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('❌ Chyba při vkládání dat:', err);
            res.status(500).json({ error: 'Chyba při ukládání' });
            return;
        }
        res.json({ success: true, message: '✅ Úspěšně uloženo' });
    });
});

// 📥 Endpoint pro získání tréninků podle dne
app.get('/api/treninky', (req, res) => {
    const { datum } = req.query;

    const sql = `SELECT * FROM treninky WHERE datum = ?`;

    db.query(sql, [datum], (err, result) => {
        if (err) {
            console.error('❌ Chyba při načítání tréninků:', err);
            res.status(500).json({ error: 'Chyba při načítání dat' });
            return;
        }
        res.json(result); // ✅ Vrátíme tréninky jako JSON
    });
});

app.use('/api', router);

// Spuštění serveru
app.listen(PORT, () => {
    console.log(`🚀 Server běží na http://localhost:${PORT}`);
});
