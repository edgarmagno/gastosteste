const chatBox = document.getElementById('chat');
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');

const scriptURL = 'https://script.google.com/macros/s/AKfycbw1hidJFgzn8hPEgM09GrUWsUHoXGFCG5ySKeEQdwrfP_38apCSfDfJYAxmNYpEXPCd/exec'; // Atualize aqui

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, 'user');
  input.value = '';

  const response = await sendToGoogleSheet(msg);
  if (response && response.reply) {
    addMessage(response.reply, 'bot');
  } else {
    addMessage("Erro ao se comunicar com a planilha!", 'bot');
  }
});

function addMessage(text, sender) {
  const msgEl = document.createElement('div');
  msgEl.classList.add('message', sender);
  msgEl.textContent = text;
  chatBox.appendChild(msgEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendToGoogleSheet(message) {
  try {
    const res = await fetch(scriptURL, {
      method: 'POST',
      body: JSON.stringify({ message }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  } catch (error) {
    console.error('Erro ao enviar:', error);
    return null;
  }
}
