const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit-form', async (req, res) => {
    const formData = req.body;
    console.log('Données reçues :', formData);

    try {
        const pdfBytes = await generatePDF(formData);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=formulaire.pdf');
        res.send(pdfBytes);
    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        res.status(500).send('Erreur lors de la génération du PDF.');
    }
});

async function generatePDF(formData) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const fontSize = 24;

    console.log('Génération du PDF...');

    try {
        page.drawText('Formulaire Réponses:', {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Nom: ${formData.name}`, {
            x: 50,
            y: height - 6 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Email: ${formData.email}`, {
            x: 50,
            y: height - 8 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Téléphone: ${formData.phone}`, {
            x: 50,
            y: height - 10 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        console.log('PDF généré avec succès');
        return pdfBytes;
    } catch (error) {
        console.error('Erreur lors de la création du PDF:', error);
        throw error;
    }
}

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
