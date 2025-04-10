const scriptURL = "https://script.google.com/macros/s/AKfycbyR9GzrX7MxLeU6LHjZY1e7sNWueyrGfUkp-nmA9Sw/exec";

function adicionarMensagem(origem, texto) {
  const chat = document.getElementById("chat");
  const msg = document.createElement("div");
  msg.className = origem === "Você" ? "mensagem usuario" : "mensagem bot";
  msg.innerText = `${origem}: ${texto}`;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

async function enviarMensagem() {
  const input = document.getElementById("mensagem");
  const texto = input.value.trim();
  if (texto === "") return;

  adicionarMensagem("Você", texto);
  input.value = "";

  try {
    const resposta = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify({ mensagem: texto }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const dados = await resposta.json();
    adicionarMensagem("Bot", dados.resposta);
  } catch (error) {
    adicionarMensagem("Bot", "❌ Erro ao enviar mensagem. Verifique sua conexão.");
    console.error("Erro:", error);
  }
}

document.getElementById("mensagem").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    enviarMensagem();
  }
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
