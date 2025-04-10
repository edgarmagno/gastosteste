const form = document.getElementById("form");
const mensagem = document.getElementById("mensagem");
const chat = document.getElementById("chat");
const saldo = document.getElementById("saldo");

const API_URL = "https://script.google.com/macros/s/AKfycbwp9Axbob5zgRZXCIYXNUXeMzzHyqsaO-lAgSPQaAmMjPZjTu4Zj-fGhQRWHKqd9x0Z/exec";

function extrairValor(texto) {
  const regex = /-?\d+(,\d{2})?/g;
  const encontrado = texto.match(regex);
  if (!encontrado) return 0;
  let valor = encontrado[0].replace(",", ".");
  return texto.toLowerCase().includes("gastei") || texto.includes("-") ? -parseFloat(valor) : parseFloat(valor);
}

async function carregarMensagens() {
  const res = await fetch(API_URL);
  const data = await res.json();
  let total = 0;

  chat.innerHTML = "";

  data.forEach(({ texto, valor }) => {
    const div = document.createElement("div");
    div.classList.add("bolha");

    if (valor > 0) {
      div.classList.add("ganho");
    } else {
      div.classList.add("gasto");
    }

    total += Number(valor);
    div.textContent = texto;
    chat.appendChild(div);
  });

  saldo.textContent = `Saldo: R$ ${total.toFixed(2)}`;
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = mensagem.value.trim();
  if (!texto) return;

  const valor = extrairValor(texto);
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ texto, valor }),
    headers: {
      "Content-Type": "application/json"
    }
  });

  mensagem.value = "";
  carregarMensagens();
});

carregarMensagens();

