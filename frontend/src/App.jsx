import { useState, useEffect } from 'react'

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [chamados, setChamados] = useState([]);

  // Estados para o Formulário (O que o usuário digita)
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("");

  async function carregarTudo() {
    const resUser = await fetch('http://localhost:3001/usuarios');
    const resChamados = await fetch('http://localhost:3001/chamados');
    setUsuarios(await resUser.json());
    setChamados(await resChamados.json());
  }

  useEffect(() => { carregarTudo(); }, []);

  // Cria Usuário (Simplificado para ganhar tempo)
  async function criarUsuario() {
    await fetch('http://localhost:3001/usuarios', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nome: `Usuário ${Math.floor(Math.random() * 100)}`,
        email: `email${Date.now()}@teste.com`,
        senha: "123",
        perfil: "SOLICITANTE"
      })
    });
    carregarTudo();
  }

  // Enviar o Formulário de Chamado
  async function handleSubmit(event) {
    event.preventDefault(); // Não deixa a tela recarregar
    
    if (!usuarioSelecionado) return alert("Selecione um usuário na lista!");
    if (!titulo) return alert("Digite um título!");

    await fetch('http://localhost:3001/chamados', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        titulo,
        descricao,
        patrimonioId: "PAT-GENERICO",
        solicitanteId: usuarioSelecionado
      })
    });
    
    // Limpa os campos e recarrega
    setTitulo("");
    setDescricao("");
    carregarTudo();
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', display: 'flex', gap: '40px' }}>
      
      {/* ESQUERDA: LISTA DE USUÁRIOS (Para selecionar QUEM está pedindo) */}
      <div style={{ width: '300px' }}>
        <h3>1º Selecione o Usuário 👇</h3>
        <button onClick={criarUsuario} style={{marginBottom: '10px'}}>+ Criar Usuário Random</button>
        
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd' }}>
          {usuarios.map(u => (
            <div 
              key={u.id} 
              onClick={() => setUsuarioSelecionado(u.id)}
              style={{ 
                padding: '10px', 
                cursor: 'pointer',
                background: usuarioSelecionado === u.id ? '#d1e7dd' : 'white', // Fica verde se selecionado
                borderBottom: '1px solid #eee'
              }}
            >
              <strong>{u.nome}</strong> <br/>
              <small>{u.email}</small>
            </div>
          ))}
        </div>
      </div>

      {/* DIREITA: FORMULÁRIO E LISTA DE CHAMADOS */}
      <div style={{ flex: 1 }}>
        <h3>2º Preencha o Chamado 📝</h3>
        <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>O que aconteceu?</label><br/>
            <input 
              type="text" 
              value={titulo} 
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ex: Monitor queimou"
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label>Detalhes:</label><br/>
            <textarea 
              value={descricao} 
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descreva melhor..."
              style={{ width: '100%', padding: '8px', height: '60px' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '10px 20px', background: '#0d6efd', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Abrir Chamado
          </button>
        </form>

        <h3>Chamados Recentes</h3>
        {chamados.map(c => (
          <div key={c.id} style={{ borderLeft: '4px solid #0d6efd', padding: '10px', marginBottom: '10px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <strong>{c.titulo}</strong> — <small>{c.patrimonioId}</small><br/>
            {c.descricao}<br/>
            <small style={{ color: 'gray' }}>Aberto por: {c.solicitante.nome}</small>
          </div>
        ))}
      </div>

    </div>
  )
}

export default App