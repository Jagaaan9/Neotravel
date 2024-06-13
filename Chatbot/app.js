const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuration Airtable
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route pour soumettre le formulaire et générer le PDF
app.post('/generate-pdf', async (req, res) => {
    const formData = req.body;

    // Envoi des données à Airtable
    try {
        await axios.post(AIRTABLE_API_URL, {
            fields: formData
        }, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Génération du PDF
        try {
            const doc = new PDFDocument();
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                res.setHeader('Content-Length', Buffer.byteLength(pdfData));
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=formulaire.pdf');
                res.end(pdfData);
            });

            // Écriture du contenu du PDF
            doc.fontSize(12).text(`À l’attention de : ${formData.civilite} ${formData.nom} ${formData.prenom}`, { align: 'left' });
            doc.text(`Tél : ${formData.telephone}`, { align: 'left' });
            doc.text(`Mail : ${formData.mail}`, { align: 'left' });
            doc.text(`${formData.societe}`, { align: 'left' });
            doc.text(`Le ${formData.date_jour}`, { align: 'left' });
            doc.text(`\nConcernant votre voyage :`, { align: 'left' });
            doc.text(`Nombre de passagers : ${formData.nb_passagers}`, { align: 'left' });
            doc.text(`Départ Aller : ${formData.date_depart_aller} à ${formData.heure_depart_aller} - Adresse à définir - ${formData.adresse_depart_aller}`, { align: 'left' });
            doc.text(`Arrivée Aller : ${formData.date_arrivee_aller} vers ${formData.heure_arrivee_aller} - Adresse à définir - ${formData.adresse_arrivee_aller}`, { align: 'left' });
            doc.text(`Départ Retour : ${formData.date_depart_retour} à ${formData.heure_depart_retour} - Adresse à définir - ${formData.adresse_depart_retour}`, { align: 'left' });
            doc.text(`Arrivée Retour : ${formData.date_arrivee_retour} vers ${formData.heure_arrivee_retour} - Adresse à définir - ${formData.adresse_arrivee_retour}`, { align: 'left' });
            doc.text('\nVous recevrez le devis par mail.', { align: 'left' });

            doc.end();
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            res.status(500).send('Erreur lors de la génération du PDF.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données à Airtable :', error);
        res.status(500).send('Erreur lors de l\'envoi des données à Airtable.');
    }
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
