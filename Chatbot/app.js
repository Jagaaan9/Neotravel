const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-form', (req, res) => {
    const formData = req.body;
    console.log('Données reçues :', formData);

    try {
        const doc = new PDFDocument();
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=formulaire.pdf');
            res.send(pdfData);
        });

        doc.fontSize(25).text('Formulaire Réponses:', 50, 50);
        doc.fontSize(20).text(`Nom: ${formData.name}`, 50, 100);
        doc.fontSize(20).text(`Email: ${formData.email}`, 50, 150);
        doc.fontSize(20).text(`Téléphone: ${formData.phone}`, 50, 200);

        doc.end();
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        res.status(500).send('Erreur lors de la génération du PDF.');
    }
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
