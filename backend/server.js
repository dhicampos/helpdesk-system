require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// --- ROTA 1: CRIAR USUÁRIO ---
app.post('/usuarios', async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;
    
    // Cria o usuário no banco
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha, perfil }
    });
    
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário (Email já existe?)" });
  }
});

// --- ROTA 2: LISTAR USUÁRIOS ---
app.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

// --- ROTA 3: CRIAR CHAMADO ---
app.post('/chamados', async (req, res) => {
  try {
    const { titulo, descricao, patrimonioId, solicitanteId } = req.body;

    // Cria o chamado CONECTANDO ao usuário que pediu (Relacionamento)
    const chamado = await prisma.chamado.create({
      data: {
        titulo,
        descricao,
        patrimonioId,
        solicitante: { connect: { id: Number(solicitanteId) } } // Aqui acontece a mágica do vínculo
      }
    });

    res.json(chamado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao abrir chamado" });
  }
});

// --- ROTA 4: LISTAR CHAMADOS (Com os dados de quem pediu) ---
app.get('/chamados', async (req, res) => {
  const chamados = await prisma.chamado.findMany({
    include: {
      solicitante: true // Traz os dados do usuário dono do chamado (JOIN)
    }
  });
  res.json(chamados);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Helpdesk rodando na porta ${PORT}`);
});