let step = 0;
const messages = document.getElementById('chatbot-messages');

const steps = [
    { message: "Bienvenue! Quel est votre nom?", type: "input" },
    { message: "Quel est votre adresse email?", type: "input" },
    { message: "Quel est votre numéro de téléphone?", type: "input" },
    { message: "Merci! Vous avez terminé le formulaire.", type: "final" }
];

function displayMessage(message, from = 'bot') {
    const messageElement = document.createElement('div');
    messageElement.classList.add(from === 'bot' ? 'bot-message' : 'user-message');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

function nextStep(userResponse = '') {
    if (step > 0) {
        displayMessage(userResponse, 'user');
    }
    if (step < steps.length) {
        displayMessage(steps[step].message);
        step++;
    } else {
        sendFormData();
    }
}

function sendFormData() {
    const data = {
        name: steps[0].response,
        email: steps[1].response,
        phone: steps[2].response
    };

    fetch('/submit-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        displayMessage(data.message);
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
