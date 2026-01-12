import { useState, useEffect } from 'react'

function App() {
  const [mensagens, setMensagens] = useState([]);

  async function carregarDados() {
    try {
      const resposta = await fetch('http://localhost:3001/teste');
      const dados = await resposta.json();
      // Proteção: Só atualiza se tiver dados, e limita a exibir os últimos 50
      if (Array.isArray(dados)) {
        setMensagens(dados.slice(-50).reverse()); 
      }
    } catch (erro) {
      console.error("Erro backend:", erro);
    }
  }

  async function criarDado() {
    try {
      await fetch('http://localhost:3001/teste', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({})
      });
      carregarDados();
    } catch (erro) {
      alert("Erro ao criar!");
    }
  }

  // O SEGREDO ESTÁ AQUI NOS COLCHETES: []
  useEffect(() => {
    carregarDados();
  }, []); 

  return (
    <div style={{ padding: '20px' }}>
      <h1>Teste Seguro</h1>
      <button onClick={criarDado}>➕ Novo Item</button>
      <ul>
        {mensagens.map((item) => (
          <li key={item.id}>#{item.id} - {item.mensagem}</li>
        ))}
      </ul>
    </div>
  )
}

export default App