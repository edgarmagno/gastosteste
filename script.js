const chat = document.getElementById('chat');
const input = document.getElementById('input');
const send = document.getElementById('send');
const toggleTheme = document.getElementById('toggle-theme');

function appendMessage(text, sender) {
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function processMessage(message) {
  appendMessage(message, 'user');

  try {
    const response = await fetch('https://script.google.com/macros/s/SEU_WEBAPP_URL/exec', {
      method: 'POST',
      body: JSON.stringify({ mensagem: message }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    appendMessage(data.resposta, 'bot');
  } catch (e) {
    appendMessage('Erro ao conectar com o servidor.', 'bot');
  }
}

send.onclick = () => {
  const msg = input.value.trim();
  if (msg !== '') {
    processMessage(msg);
    input.value = '';
  }
};

input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') send.click();
});

// Alternar tema claro/escuro com armazenamento em localStorage
let dark = localStorage.getItem('dark-mode') === 'true';
if (dark) document.body.classList.add('dark-mode');
toggleTheme.innerText = dark ? '☀️' : '🌙';

toggleTheme.onclick = () => {
  dark = !dark;
  document.body.classList.toggle('dark-mode');
  toggleTheme.innerText = dark ? '☀️' : '🌙';
  localStorage.setItem('dark-mode', dark);
};
