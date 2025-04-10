const API_URL = "https://script.google.com/macros/s/1DD8KWdqHsQIHBEUtYDZWy8wgrgZkVp82nNPm5qqZxz8/exec";

const chatContainer = document.getElementById('chatContainer');
const inputMessage = document.getElementById('inputMessage');
const sendButton = document.getElementById('sendButton');

// Função para adicionar uma nova mensagem ao chat
function adicionarMensagem(usuario, mensagem) {
  const mensagemContainer = document.createElement('div');
  mensagemContainer.classList.add('mensagem');
  mensagemContainer.classList.add(usuario === 'Você' ? 'mensagem-enviada' : 'mensagem-recebida');
  mensagemContainer.innerText = `${usuario}: ${mensagem}`;
  chatContainer.appendChild(mensagemContainer);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Função para enviar a mensagem ao servidor
async function enviarMensagem(mensagem) {
  adicionarMensagem("Você", mensagem);

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ mensagem }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const dados = await resposta.json();

    if (dados && dados.resposta) {
      adicionarMensagem("Bot", dados.resposta);
    } else {
      adicionarMensagem("Bot", "❌ Resposta inválida do servidor.");
    }

  } catch (e) {
    adicionarMensagem("Bot", "❌ Erro ao enviar mensagem. Verifique sua conexão ou a URL da API.");
  }
}

// Enviar mensagem ao clicar no botão
sendButton.addEventListener('click', () => {
  const mensagem = inputMessage.value.trim();
  if (mensagem) {
    inputMessage.value = '';
    enviarMensagem(mensagem);
  }
});

// Enviar mensagem ao pressionar Enter
inputMessage.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const mensagem = inputMessage.value.trim();
    if (mensagem) {
      inputMessage.value = '';
      enviarMensagem(mensagem);
    }
  }
});
