// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-form', (req, res) => {
    const formData = req.body;

    // Traitez les données reçues du formulaire ici
    console.log('Données reçues :', formData);

    res.json({ message: 'Données reçues avec succès !' });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
