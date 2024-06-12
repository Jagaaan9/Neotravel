let step = 0;
const messages = document.getElementById('chatbot-messages');

const steps = [
    { message: "Bienvenue! Quel est votre nom?", type: "input" },
    { message: "Quel est votre adresse email?", type: "input" },
    { message: "Quel est votre numéro de téléphone?", type: "input" },
    { message: "Merci! Cliquez sur le bouton ci-dessous pour générer le PDF.", type: "final" }
];

function displayMessage(message, from = 'bot') {
    const messageElement = document.createElement('div');
    messageElement.classList.add(from === 'bot' ? 'bot-message' : 'user-message');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

function nextStep(userResponse = '') {
    if (step > 0 && userResponse) {
        displayMessage(userResponse, 'user');
    }

    if (step < steps.length) {
        displayMessage(steps[step].message);

        if (steps[step].type === 'final') {
            const buttonElement = document.createElement('button');
            buttonElement.textContent = 'Générer le PDF';
            buttonElement.onclick = sendFormData;
            messages.appendChild(buttonElement);
        }

        step++;
    }
}

function sendFormData() {
    const data = {
        name: steps[0].response,
        email: steps[1].response,
        phone: steps[2].response
    };

    console.log('Données envoyées:', data);

    fetch('/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            console.log('Réponse du serveur OK');
            return response.blob();
        } else {
            console.error('Erreur de réponse du serveur');
            throw new Error('Erreur lors de l\'envoi des données.');
        }
    })
    .then(blob => {
        console.log('Blob reçu:', blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'formulaire.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        displayMessage('Le PDF a été généré et téléchargé.');
    })
    .catch(error => {
        console.error('Erreur:', error);
        displayMessage('Une erreur s\'est produite.');
    });
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userResponse = userInput.value.trim();
    if (userResponse !== '') {
        steps[step - 1].response = userResponse;
        userInput.value = '';
        nextStep(userResponse);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    nextStep();
});
