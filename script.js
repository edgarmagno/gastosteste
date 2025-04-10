const scriptURL = 'https://script.google.com/macros/s/AKfycbw1hidJFgzn8hPEgM09GrUWsUHoXGFCG5ySKeEQdwrfP_38apCSfDfJYAxmNYpEXPCd/exec'; // substitua pela URL do seu script

const chat = document.getElementById('chat');
const input = document.getElementById('input');
const form = document.getElementById('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;

  addMessage('Você', msg);
  input.value = '';

  if (msg.toLowerCase().startsWith('gastei') || msg.toLowerCase().startsWith('ganhei')) {
    await tratarLancamento(msg);
  } else if (msg.toLowerCase().includes('relatório')) {
    await gerarRelatorio(msg);
  } else {
    addMessage('Assistente', 'Desculpe, não entendi. Tente: "gastei 20 com lanche", "ganhei 300 de salário", "relatório semanal"...');
  }
});

function addMessage(remetente, texto) {
  const div = document.createElement('div');
  div.className = remetente === 'Você' ? 'mensagem usuario' : 'mensagem bot';
  div.textContent = `${remetente}: ${texto}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function tratarLancamento(texto) {
  const tipo = texto.toLowerCase().startsWith('gastei') ? 'Gasto' : 'Ganho';
  const regex = /(gastei|ganhei)\s+(\d+(?:[.,]\d{1,2})?)\s+com\s+(.+)/i;
  const match = texto.match(regex);

  if (!match) {
    addMessage('Assistente', 'Por favor use: "gastei 50 com mercado" ou "ganhei 200 com vendas"');
    return;
  }

  const valor = parseFloat(match[2].replace(',', '.'));
  const descricao = match[3];
  const data = new Date().toLocaleDateString('pt-BR');

  const dados = { data, tipo, valor, descricao };

  try {
    const res = await fetch(scriptURL, {
      method: 'POST',
      body: new URLSearchParams(dados)
    });

    if (res.ok) {
      addMessage('Assistente', `${tipo} de R$${valor.toFixed(2)} registrado: ${descricao}`);
    } else {
      addMessage('Assistente', 'Erro ao salvar. Tente novamente.');
    }
  } catch (error) {
    addMessage('Assistente', 'Erro de conexão.');
  }
}

async function gerarRelatorio(texto) {
  let periodo = 'diario';
  if (texto.includes('semanal')) periodo = 'semanal';
  else if (texto.includes('mensal')) periodo = 'mensal';

  try {
    const res = await fetch(`${scriptURL}?relatorio=${periodo}`);
    const dados = await res.json();

    let resposta = `📊 Relatório ${periodo}:\n\n`;
    resposta += `💰 Ganhos: R$ ${dados.ganhos.toFixed(2)}\n`;
    resposta += `💸 Gastos: R$ ${dados.gastos.toFixed(2)}\n`;
    resposta += `🧮 Saldo: R$ ${(dados.ganhos - dados.gastos).toFixed(2)}\n`;

    if (dados.porTipo) {
      resposta += `\n🔍 Por tipo:\n`;
      for (const tipo in dados.porTipo) {
        resposta += `• ${tipo}: R$ ${dados.porTipo[tipo].toFixed(2)}\n`;
      }
    }

    addMessage('Assistente', resposta);
  } catch (err) {
    addMessage('Assistente', 'Erro ao gerar relatório.');
  }
}
