const form = document.getElementById("form");
const mensagem = document.getElementById("mensagem");
const chat = document.getElementById("chat");
const saldo = document.getElementById("saldo");
const reset = document.getElementById("reset");

let historico = JSON.parse(localStorage.getItem("chatFinance")) || [];

function atualizarInterface() {
  chat.innerHTML = "";
  let total = 0;

  historico.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("bolha");

    const valor = extrairValor(item);
    if (valor > 0) {
      div.classList.add("ganho");
      total += valor;
    } else {
      div.classList.add("gasto");
      total += valor;
    }

    div.textContent = item;
    chat.appendChild(div);
  });

  saldo.textContent = `Saldo: R$ ${total.toFixed(2)}`;
  localStorage.setItem("chatFinance", JSON.stringify(historico));
}

function extrairValor(texto) {
  const regex = /-?\d+(,\d{2})?/g;
  const encontrado = texto.match(regex);
  if (!encontrado) return 0;
  let valor = encontrado[0].replace(",", ".");
  return texto.toLowerCase().includes("gastei") || texto.includes("-") ? -parseFloat(valor) : parseFloat(valor);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = mensagem.value.trim();
  if (texto === "") return;

  historico.push(texto);
  mensagem.value = "";
  atualizarInterface();
});

reset.addEventListener("click", () => {
  if (confirm("Deseja limpar o histórico?")) {
    historico = [];
    atualizarInterface();
  }
});

atualizarInterface();
