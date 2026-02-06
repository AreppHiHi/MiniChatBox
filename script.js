// --- CONFIGURATION ---
// PASTE YOUR KEY INSIDE THE QUOTES BELOW
const API_KEY = "AIzaSyByVv-MSZ97HHCVUuNGj3YMbiDUPE0Qtuk";

// PASTE YOUR COMPANY DATA HERE
const companyData = `
You are the AI support assistant for a company called "TechSolutions".
Here is the company information you must use to answer questions:

- Services: Web Development, Cloud Hosting, and Cyber Security.
- Pricing: Web dev starts at $500, Hosting is $10/month.
- Location: 123 Tech Street, Kuala Lumpur, Malaysia.
- Contact: Email support@techsolutions.com or call +60123456789.
- Opening Hours: Mon-Fri, 9am to 6pm.
- Ceo : Alex tan
- Have 50 employees
- Established in 2010
- Mission : To provide afforfable and reliable tech solutions to small businessses
- If you have problem with computer , can give a simptom and we can help to diagnose
- Computer have not power on : check power cable, power supply, motherboard


INSTRUCTIONS:
- Only answer based on the information above.
- If the user asks something outside this scope, politely say you don't know.
`;
// ---------------------

const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; 
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; 
}

const generateResponse = async (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    // Check if API Key is missing
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
        messageElement.textContent = "Error: API Key is missing in script.js";
        messageElement.style.color = "red";
        return;
    }

    // USE THIS EXACT FORMAT
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${API_KEY}`;
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{
                parts: [{ 
                    text: companyData + "\n\nUser Question: " + userMessage 
                }]
            }]
        })
    }

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            messageElement.textContent = `Error: ${data.error.message}`;
            messageElement.style.color = "#ff0000";
            return;
        }

        const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*/g, '').trim();
        messageElement.textContent = apiResponse;

    } catch (error) {
        console.error("Network Error:", error);
        messageElement.textContent = "Internet or Network error. Check console.";
        messageElement.style.color = "#ff0000";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

// Event Listeners
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));