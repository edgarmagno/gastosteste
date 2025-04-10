
document.getElementById('send').addEventListener('click', sendMessage);
document.getElementById('input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});
document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function appendMessage(text, className) {
  const chat = document.getElementById('chat');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + className;
  messageDiv.textContent = text;
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('input');
  const message = input.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  input.value = '';

  try {
    const response = await fetch('AKfycbxV3NBRF2g-Is53qglDucuardscOARsk9IA7X2db_s13Jnf2rOl62XXmYz8-KpLOrw5', {
      method: 'POST',
      body: JSON.stringify({ mensagem: message }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    appendMessage(data.resposta, 'bot');
  } catch (error) {
    appendMessage('Erro ao conectar com o servidor.', 'bot');
  }
}
