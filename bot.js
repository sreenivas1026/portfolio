let stopResponses = false;
let typingInterval = null;
let trainingData = null;
let isSpeaking = false; // Track if the bot is speaking
let isIntroDisplayed = false; // Prevent intro message repetition
let firstUserMessage = true; // Track if it's the first user message
let currentSection = null; // Track the current section

// Function to remove emojis from a text string (for TTS purposes)
function removeEmojisForTTS(text) {
    return text.replace(/[\p{Emoji}\u200B-\u200D\uFE0F\u25AA]+/gu, "");
}

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

// Open the chatbot and introduce the bot
function openChat() {
    const chatContainer = document.getElementById("chatbot-container");
    const botIcon = document.getElementById("botIcon");
    chatContainer.style.display = "flex";
    botIcon.style.display = "none";

    // Display intro message only once
    if (!isIntroDisplayed) {
        displayMessage("Hello Dear, I am Gopi's Friend. You can call me Kwen, an AI Assistant. How can I assist you today?", "bot", true);
        isIntroDisplayed = true; // Mark intro as displayed
    }
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
    isIntroDisplayed = false; // Reset intro flag
    firstUserMessage = true; // Reset first message flag
    currentSection = null; // Reset current section
    updateSendButton();
}

// Display messages in the chat system
function displayMessage(message, sender, speak = false, buttons = []) {
    if (stopResponses && sender === "bot") return;
    if (!message.trim() && buttons.length === 0) return; // Prevent displaying empty messages

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

    // Add buttons if any
    if (buttons.length > 0) {
        buttons.forEach(button => {
            const buttonElement = document.createElement("button");
            buttonElement.textContent = button.label;
            buttonElement.onclick = button.onClick;
            messageDiv.appendChild(buttonElement);
        });
    }

    // Scroll to the latest message
    scrollToLatestMessage();
}

// Scroll to the latest message in the chat system
function scrollToLatestMessage() {
    const chatContent = document.getElementById("chatContent");
    setTimeout(() => {
        chatContent.scrollTop = chatContent.scrollHeight;
    }, 50);
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
            scrollToLatestMessage(); // Ensure scrolling after typing
        }
    }, 15); // Adjust typing speed here
}

// Bot's voice synthesis (female voice)
function speakMessage(message) {
    if (isSpeaking) return; // Prevent speaking if the bot is already speaking
    isSpeaking = true; // Mark as speaking

    // Remove emojis from message for TTS
    const messageForTTS = removeEmojisForTTS(message);

    const utterance = new SpeechSynthesisUtterance(messageForTTS);
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find(voice => voice.name.toLowerCase().includes("female")) || null;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);

    utterance.onend = function () {
        isSpeaking = false; // Mark as not speaking when the speech ends
    };
}

// Function to handle user input and find response
async function handleUserInput(message, speak = false) {
    displayMessage(message, "user");

    const lowerCaseMessage = message.toLowerCase();

    if (firstUserMessage) {
        firstUserMessage = false; // No longer the first message
    }

    // Check if the user wants to download the resume
    let resumeResponse = handleResumeRequest(lowerCaseMessage);
    if (resumeResponse) {
        displayMessage(resumeResponse, "bot", speak);
        return;
    }

    // Check if the user wants to toggle dark mode
    let darkModeResponse = handleDarkModeRequest(lowerCaseMessage);
    if (darkModeResponse) {
        displayMessage(darkModeResponse, "bot", speak);
        return;
    }

    // Check if the user wants to navigate to a section
    let navigationResponse = await handleNavigationRequest(lowerCaseMessage);
    if (navigationResponse) {
        displayMessage(navigationResponse.message, "bot", speak);
        return;
    }

    // Check if the user wants an explanation for the current section
    let explanationResponse = handleExplanationRequest(lowerCaseMessage);
    if (explanationResponse) {
        displayMessage(explanationResponse, "bot", speak);
        return;
    }

    // First, try full sentence match (more accurate match)
    let fullSentenceResponse = await findFullSentenceResponse(lowerCaseMessage);
    if (fullSentenceResponse) {
        displayMessage(fullSentenceResponse, "bot", speak);
        return;
    }

    // If no full sentence match, do fuzzy word matching (paraphrase)
    let paraphraseResponse = await findParaphraseResponse(lowerCaseMessage);
    if (paraphraseResponse) {
        displayMessage(paraphraseResponse, "bot", speak);
        return;
    }

    // If no response is found, apologize
    displayMessage("Sorry, I couldn't find an answer to that. Could you ask something else?", "bot", speak);
}

// Handle resume request (check if the user wants to download the resume)
function handleResumeRequest(message) {
    const resumeKeywords = ["download resume", "download cv", "resume", "cv"];

    for (let keyword of resumeKeywords) {
        if (message.includes(keyword)) {
            // Automatically download the resume
            downloadResume();
            return "Downloading your resume...";
        }
    }

    return null;
}

// Function to download the resume
function downloadResume() {
    const link = document.createElement("a");
    link.href = "Resume-ATS.pdf";
    link.download = "Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Handle dark mode request (check if the user wants to toggle dark mode)
function handleDarkModeRequest(message) {
    const darkModeKeywords = ["dark mode", "light mode", "enable dark mode", "disable dark mode", "switch on dark mode", "switch off dark mode", "make it dark", "make it light"];

    for (let keyword of darkModeKeywords) {
        if (message.includes(keyword)) {
            const body = document.body;
            const darkModeToggle = document.getElementById("darkMode__Toggle");
            if (darkModeToggle) {
                darkModeToggle.checked = !darkModeToggle.checked;
                body.classList.toggle("dark-theme", darkModeToggle.checked);
                return `Dark mode has been ${darkModeToggle.checked ? "enabled" : "disabled"}.`;
            }
        }
    }

    return null;
}

// Handle navigation request (check if the user wants to navigate to a section)
async function handleNavigationRequest(message) {
    const sections = {
        home: 'home',
        about: 'about',
        services: 'services',
        contact: 'contact',
        portfolio: 'portfolio',
        skills: 'skills',
        experience: 'experience',
        education: 'education',
        projects: 'projects',
    };

    const navigationKeywords = ["navigate", "go", "move", "show"];

    // Check if the message contains any navigation keyword AND a section name
    for (let keyword of navigationKeywords) {
        if (message.includes(keyword)) {
            for (let section in sections) {
                if (message.includes(section)) {
                    highlightSection(sections[section]);
                    currentSection = section; // Set the current section
                    return { message: `Navigating to the ${section} section...`, buttons: [] };
                }
            }
        }
    }

    // If no navigation command found, just return null
    return null;
}

// Handle explanation request (check if the user wants an explanation for the current section)
function handleExplanationRequest(message) {
    const explanationKeywords = ["explain", "tell me more", "details", "information"];

    for (let keyword of explanationKeywords) {
        if (message.includes(keyword) && currentSection) {
            let responseMessage = "";
            switch (currentSection) {
                case 'home':
                    responseMessage = document.getElementById("homeMessage").textContent || "Welcome to the portfolio.";
                    break;
                case 'about':
                    responseMessage = document.getElementById("aboutMessage").textContent || "Here are the things you want to know about Gopi. Gopi is interested in data science, AI, web development technologies. He is passionate about work, and his hobbies include playing chess and coding.";
                    break;
                case 'skills':
                    responseMessage = document.getElementById("skillsMessage").textContent || "Gopi is an expert in various fields. In frontend development, he is very good at web development using HTML, CSS, JavaScript, and React. In programming, he knows Python and SQL for data engineering.";
                    break;
                case 'contact':
                    responseMessage = document.getElementById("contactMessage").textContent || "You can contact Gopi by his email id.";
                    break;
                case 'services':
                    responseMessage = document.getElementById("servicesMessage").textContent || "Gopi is able to serve in the following services: [mention services here].";
                    break;
                case 'education':
                    responseMessage = document.getElementById("educationMessage").textContent || "Gopi graduated from [college name] in the Mechanical department.";
                    break;
                default:
                    responseMessage = `Here is the information about the ${currentSection} section.`;
                    break;
            }
            return responseMessage;
        }
    }

    return null;
}

// Highlight the section with a smooth transition
function highlightSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
        // Scroll to the section
        section.scrollIntoView({ behavior: "smooth" });

        // Add the highlight class to the section
        section.classList.add("highlight");

        // Remove the highlight after a short duration
        setTimeout(() => {
            section.classList.remove("highlight");
        }, 2000); // Highlight for 2 seconds
    }
}

// Check if the input exactly matches any sentence in the training data
async function findFullSentenceResponse(message) {
    const responses = trainingData.bot.responses_to_questions;

    // Loop through all questions and check for exact sentence match
    for (let questionKey in responses) {
        const questionData = responses[questionKey];
        for (let inputKeyword of questionData.input) {
            // Exact match with the full input sentence
            if (inputKeyword.toLowerCase() === message) {
                return questionData.response[Math.floor(Math.random() * questionData.response.length)];
            }
        }
    }

    return null;
}

// Find a response based on paraphrase (fuzzy match) of user's question from the JSON
async function findParaphraseResponse(message) {
    const responsesToQuestions = trainingData.bot.responses_to_questions;

    // Loop through all questions in the JSON to see if there's a fuzzy match
    for (let questionKey in responsesToQuestions) {
        const questionData = responsesToQuestions[questionKey];
        for (let inputKeyword of questionData.input) {
            if (isMatch(message, inputKeyword)) {
                return questionData.response[Math.floor(Math.random() * questionData.response.length)];
            }
        }
    }

    return null;
}

// Helper function to check for exact or fuzzy match
function isMatch(input, keyword) {
    const lowerInput = input.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();

    // Exact match check
    if (lowerInput === lowerKeyword) {
        return true;
    }

    // Fuzzy match check using Levenshtein distance
    const distance = getLevenshteinDistance(lowerInput, lowerKeyword);
    const similarity = 1 - distance / Math.max(lowerInput.length, lowerKeyword.length);
    return similarity >= 0.6; // Set threshold for fuzzy match (60% similarity)
}

// Levenshtein Distance (Fuzzy Matching)
function getLevenshteinDistance(a, b) {
    const temp = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) {
        temp[0][i] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        temp[j][0] = j;
    }

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            temp[j][i] = Math.min(temp[j - 1][i] + 1, temp[j][i - 1] + 1, temp[j - 1][i - 1] + cost);
        }
    }

    return temp[b.length][a.length];
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

// Event listener for bot icon click to introduce the bot
document.getElementById("botIcon").addEventListener("click", openChat);

// Load training data when the page loads
window.onload = function () {
    loadTrainingData();
    updateSendButton(); // Ensure the send button functionality is set up

    // Add CSS for highlighting
    const style = document.createElement('style');
    style.innerHTML = `
        .highlight {
            background-color: yellow;
            transition: background-color 0.5s ease;
        }
    `;
    document.head.appendChild(style);
};