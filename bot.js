let stopResponses = false;
let typingInterval = null;
let trainingData = null;
let isSpeaking = false; // Track if the bot is speaking

// Load the JSON training data
async function loadTrainingData() {
    try {
        const response = await fetch('./trainingData.json'); // Ensure correct path to trainingData.json
        if (response.ok) {
            trainingData = await response.json();
            console.log('Training data loaded:', trainingData);
        } else {
            console.error('Failed to load training data. Check the file path or server configuration.');
        }
    } catch (error) {
        console.error('Error loading training data:', error);
    }
}

// Open the chatbot
function openChat() {
    const chatContainer = document.getElementById("chatbot-container");
    const botIcon = document.getElementById("botIcon");
    chatContainer.style.display = "flex";
    botIcon.style.display = "none";
    displayMessage("Hello Dear, I am Gopi's Friend. You can call me Kween, an AI Assistant. How can I assist you today?", "bot");
}

// Close the chatbot and reset the chat
function closeChat() {
    const chatContainer = document.getElementById("chatbot-container");
    const botIcon = document.getElementById("botIcon");
    chatContainer.style.display = "none";
    botIcon.style.display = "block";
    resetChat();
}

// Reset the chat system
function resetChat() {
    const chatContent = document.getElementById("chatContent");
    chatContent.innerHTML = ""; // Clear chat content
    stopResponses = false;
    updateSendButton();
}

// Display messages in the chat system
function displayMessage(message, sender, speak = false) {
    if (stopResponses && sender === "bot") return;
    if (!message.trim()) return; // Prevent displaying empty messages

    const chatContent = document.getElementById("chatContent");
    const messageClass = sender === "user" ? "user-message" : "bot-message";
    const messageDiv = document.createElement("div");
    messageDiv.className = messageClass;
    chatContent.appendChild(messageDiv);

    if (sender === "bot") {
        typeMessage(message, messageDiv, speak);
    } else {
        messageDiv.textContent = message;
    }

    // Scroll to the latest message
    setTimeout(() => {
        chatContent.scrollTop = chatContent.scrollHeight;
    }, 100);
}

// Type out the message letter by letter and optionally speak it
function typeMessage(message, element, speak) {
    let index = 0;
    typingInterval = setInterval(() => {
        if (index < message.length) {
            element.textContent += message[index];
            index++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            if (speak) speakMessage(message);
        }
    }, 50); // Adjust typing speed here
}

// Bot's voice synthesis (female voice)
function speakMessage(message) {
    if (isSpeaking) return; // Prevent speaking if the bot is already speaking
    isSpeaking = true; // Mark as speaking

    const utterance = new SpeechSynthesisUtterance(message);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.name.toLowerCase().includes("female")) || null;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    utterance.onend = function () {
        isSpeaking = false; // Mark as not speaking when the speech ends
    };
}

// Handle user input and commands
async function handleUserInput(message, speak = false) {
    displayMessage(message, "user");

    // Handle dark mode commands
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes("dark mode on") || lowerCaseMessage.includes("enable dark mode")) {
        toggleDarkMode(true);
        return;
    } else if (lowerCaseMessage.includes("dark mode off") || lowerCaseMessage.includes("disable dark mode")) {
        toggleDarkMode(false);
        return;
    }

    // Handle tab switching commands
    if (lowerCaseMessage.includes("switch to education") || lowerCaseMessage.includes("go to education") || lowerCaseMessage.includes("education")) {
        openTab("education");
        return;
    } else if (lowerCaseMessage.includes("switch to experience") || lowerCaseMessage.includes("go to experience") || lowerCaseMessage.includes("experience")) {
        openTab("experience");
        return;
    }

    // Handle dynamic navigation or section-specific responses
    const section = getSectionFromMessage(message);
    if (section) {
        const response = trainingData.sections[section]?.responses[0];
        if (response) {
            displayMessage(response, "bot", speak);
        }
        navigateToSection(section);
        return; // Skip further processing if section match is found
    }

    // Handle resume opening and downloading
    if (message.toLowerCase().includes("open my resume")) {
        window.open("Resume-ATS.pdf", "_blank");
        displayMessage("Here is your resume!", "bot", speak);
        return;
    }
    if (message.toLowerCase().includes("download cv") || message.toLowerCase().includes("download resume")) {
        const link = document.createElement("a");
        link.href = "Resume-ATS.pdf";
        link.download = "resume.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        displayMessage("Your resume is downloading now!", "bot", speak);
        return;
    }

    // Fallback if no specific section or action matches
    const response = await findBestResponse(message);
    if (response) {
        displayMessage(response, "bot", speak);
    } else {
        displayMessage("Sorry, please ask relevant to my portfolio.", "bot", speak);
    }
}

// Extract section name from user message (for dynamic navigation)
function getSectionFromMessage(message) {
    const sections = Object.keys(trainingData.sections || {});
    const lowerCaseMessage = message.toLowerCase();

    for (let section of sections) {
        if (lowerCaseMessage.includes(section)) {
            return section; // Return the first matching section
        }
    }
    return null; // No section found
}

// Find the best matching response based on the user's message
async function findBestResponse(query) {
    const lowerCaseQuery = query.toLowerCase();

    // Load training data if not already loaded
    if (!trainingData) {
        await loadTrainingData();
    }

    if (trainingData && trainingData.intents) {
        let bestResponse = null;
        let maxMatchCount = 0;

        // Match against synonyms or related queries
        for (let intent of trainingData.intents) {
            for (let keyword of intent.queries) {
                if (lowerCaseQuery.includes(keyword.toLowerCase())) {
                    return intent.responses[0];
                }
            }
        }
    }

    return null; // No match found
}

// Update the send button functionality
function updateSendButton() {
    const sendBtn = document.getElementById("sendBtn");
    sendBtn.onclick = () => {
        const userMessage = document.getElementById("user-message").value.trim();
        if (userMessage !== "") {
            handleUserInput(userMessage);
            document.getElementById("user-message").value = ""; // Clear the input
        }
    };
}

// Event listener for the Enter key to send the message
document.getElementById("user-message").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        const userMessage = document.getElementById("user-message").value.trim();
        if (userMessage !== "") {
            handleUserInput(userMessage);
            document.getElementById("user-message").value = ""; // Clear the input
        }
    }
});

// Event listener for the mic button (speech-to-text)
document.getElementById("micBtn").addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (event) {
        const userMessage = event.results[0][0].transcript.toLowerCase();
        handleUserInput(userMessage, true); // Enable speech for voice input

        // Check for dark mode commands
        if (userMessage.includes("dark mode on") || userMessage.includes("enable dark mode")) {
            toggleDarkMode(true);
        } else if (userMessage.includes("dark mode off") || userMessage.includes("disable dark mode")) {
            toggleDarkMode(false);
        }

        // Check for tab switching commands
        if (userMessage.includes("switch to education") || userMessage.includes("go to education") || userMessage.includes("education")) {
            openTab("education");
        } else if (userMessage.includes("switch to experience") || userMessage.includes("go to experience") || userMessage.includes("experience")) {
            openTab("experience");
        }
    };

    recognition.onerror = function () {
        displayMessage("Sorry, I couldn't hear you. Could you try again?", "bot");
    };
});

// Event listener to close the chat system when clicking outside of it
document.addEventListener("click", (event) => {
    const chatContainer = document.getElementById("chatbot-container");
    const botIcon = document.getElementById("botIcon");

    if (chatContainer.style.display === "flex" && !chatContainer.contains(event.target) && !botIcon.contains(event.target)) {
        closeChat();
    }
});

// Function for navigation (scroll to the section)
function navigateToSection(section) {
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });

        // Highlight the section briefly using JavaScript
        sectionElement.style.transition = "background-color 0.5s ease";
        sectionElement.style.backgroundColor = "#ffff99"; // Yellow highlight
        setTimeout(() => sectionElement.style.backgroundColor = "", 2000); // Reset highlight after 2 seconds
    }
}

// Function to toggle dark mode
function toggleDarkMode(enable) {
    const body = document.body;
    const darkModeToggle = document.getElementById("darkMode__Toggle");
    if (enable) {
        body.classList.add("dark-theme");
        darkModeToggle.checked = true;
        const message = "Dark mode enabled.";
        displayMessage(message, "bot");
        speakMessage(message);
    } else {
        body.classList.remove("dark-theme");
        darkModeToggle.checked = false;
        const message = "Dark mode disabled.";
        displayMessage(message, "bot");
        speakMessage(message);
    }
}

// Load training data when the page loads
window.onload = function () {
    loadTrainingData();
    updateSendButton(); // Ensure the send button functionality is set up
};