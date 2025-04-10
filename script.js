const API_URL = "https://script.google.com/macros/s/AKfycbw1hidJFgzn8hPEgM09GrUWsUHoXGFCG5ySKeEQdwrfP_38apCSfDfJYAxmNYpEXPCd/exec";

const chat = document.getElementById('chat');
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const toggle = document.getElementById('darkModeToggle');

toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  adicionarMensagem('user', msg);
  interpretarMensagem(msg);
  input.value = '';
});

function adicionarMensagem(remetente, texto) {
  const div = document.createElement('div');
  div.className = `message ${remetente}`;
  div.textContent = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function interpretarMensagem(msg) {
  const valorRegex = /^([\+\-])\s*(\d+(?:[,.]\d{1,2})?)\s*(.*)$/i;
  const relatorioRegex = /relatorio (hoje|semana|mes)/i;

  if (valorRegex.test(msg)) {
    const [, sinal, valorStr, descricao] = msg.match(valorRegex);
    const valor = parseFloat(valorStr.replace(',', '.'));
    const tipo = sinal === '+' ? 'ganho' : 'gasto';

    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        tipo: 'inserir',
        categoria: tipo,
        valor,
        descricao
      })
    }).then(res => res.text())
      .then(res => adicionarMensagem('bot', '✅ ' + res));

    return;
  }

  const matchRelatorio = msg.match(relatorioRegex);
  if (matchRelatorio) {
    const periodo = matchRelatorio[1];

    fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({
        tipo: 'relatorio',
        periodo
      })
    }).then(res => res.json())
      .then(dados => {
        let texto = `📊 Relatório ${periodo}:

`;

        texto += `💰 Ganhos:
`;
        for (let [k, v] of Object.entries(dados.ganhos)) {
          texto += `• ${k}: R$ ${v.toFixed(2)}\n`;
        }

        texto += `\n💸 Gastos:\n`;
        for (let [k, v] of Object.entries(dados.gastos)) {
          texto += `• ${k}: R$ ${v.toFixed(2)}\n`;
        }

        texto += `\n📈 Total: +R$ ${dados.totalGanhos.toFixed(2)} | -R$ ${dados.totalGastos.toFixed(2)}`;
        adicionarMensagem('bot', texto);
      });

    return;
  }

  adicionarMensagem('bot', '🤖 Comando não reconhecido. Use:\n+ 200 descrição\n- 100 descrição\nrelatorio hoje|semana|mes');
}