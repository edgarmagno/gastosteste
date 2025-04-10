const API_URL = "https://script.google.com/macros/s/AKfycbw1hidJFgzn8hPEgM09GrUWsUHoXGFCG5ySKeEQdwrfP_38apCSfDfJYAxmNYpEXPCd/exec";

const chatContainer = document.getElementById("chat");
const input = document.getElementById("userInput");
const form = document.getElementById("chatForm");
const darkModeBtn = document.getElementById("darkModeBtn");

function addMessage(text, sender) {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  addMessage(userMessage, "user");
  input.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ mensagem: userMessage }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    addMessage(data.resposta || "⚠️ Sem resposta do servidor.", "bot");
  } catch (error) {
    addMessage("❌ Erro ao enviar mensagem. Verifique sua conexão.", "bot");
  }
});

// Dark Mode Toggle
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
