let step = 0;
let formData = {
    civilite: '',
    nom: '',
    prenom: '',
    telephone: '',
    mail: '',
    societe: '',
    date_jour: new Date().toLocaleDateString('fr-FR'),
    nb_passagers: '',
    date_depart_aller: '',
    heure_depart_aller: '',
    adresse_depart_aller: '',
    date_arrivee_aller: '',
    heure_arrivee_aller: '',
    adresse_arrivee_aller: '',
    date_depart_retour: '',
    heure_depart_retour: '',
    adresse_depart_retour: '',
    date_arrivee_retour: '',
    heure_arrivee_retour: '',
    adresse_arrivee_retour: ''
};

const questions = [
    "Quelle est votre civilité ? (M./Mme/Mlle)",
    "Quel est votre nom ?",
    "Quel est votre prénom ?",
    "Quel est votre numéro de téléphone ?",
    "Quel est votre adresse e-mail ?",
    "Quelle est votre société ?",
    "Combien de passagers sont prévus pour ce voyage ?",
    "Pour le départ aller, à quelle date et à quelle heure est prévu le départ ? (format: JJ/MM/AAAA HH:MM)",
    "À quelle date et à quelle heure est prévue l'arrivée pour le trajet aller ? (format: JJ/MM/AAAA HH:MM)",
    "Pour le départ retour, à quelle date et à quelle heure est prévu le départ ? (format: JJ/MM/AAAA HH:MM)",
    "À quelle date et à quelle heure est prévue l'arrivée pour le trajet retour ? (format: JJ/MM/AAAA HH:MM)"
];

function displayMessage(message, sender = 'bot') {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'bot' ? 'bot-message' : 'user-message';
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function nextStep(userResponse) {
    if (userResponse !== undefined) {
        displayMessage(userResponse, 'user');
        switch (step) {
            case 0:
                formData.civilite = userResponse;
                break;
            case 1:
                formData.nom = userResponse;
                break;
            case 2:
                formData.prenom = userResponse;
                break;
            case 3:
                formData.telephone = userResponse;
                break;
            case 4:
                formData.mail = userResponse;
                break;
            case 5:
                formData.societe = userResponse;
                break;
            case 6:
                formData.nb_passagers = userResponse;
                break;
            case 7:
                formData.date_depart_aller = userResponse.split(' ')[0];
                formData.heure_depart_aller = userResponse.split(' ')[1];
                formData.adresse_depart_aller = "Adresse à définir";
                break;
            case 8:
                formData.date_arrivee_aller = userResponse.split(' ')[0];
                formData.heure_arrivee_aller = userResponse.split(' ')[1];
                formData.adresse_arrivee_aller = "Adresse à définir";
                break;
            case 9:
                formData.date_depart_retour = userResponse.split(' ')[0];
                formData.heure_depart_retour = userResponse.split(' ')[1];
                formData.adresse_depart_retour = "Adresse à définir";
                break;
            case 10:
                formData.date_arrivee_retour = userResponse.split(' ')[0];
                formData.heure_arrivee_retour = userResponse.split(' ')[1];
                formData.adresse_arrivee_retour = "Adresse à définir";
                break;
        }
    }

    if (step < questions.length) {
        displayMessage(questions[step]);
        step++;
    } else {
        displayMessage('Merci pour vos réponses. Vous pouvez maintenant télécharger votre PDF.');
        document.getElementById('download-pdf').style.display = 'inline-block';
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value;
    userInput.value = '';
    nextStep(message);
}

// Initialisation du chatbot
window.onload = function() {
    displayMessage('Bonjour !');
    setTimeout(() => displayMessage('Nous avons besoin de quelques réponses pour établir votre devis.'), 1000);
    setTimeout(nextStep, 2000);
};

function downloadPDF() {
    fetch('/generate-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.blob())
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'formulaire.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => console.error('Erreur lors de la génération du PDF:', error));
}
