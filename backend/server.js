require('dotenv').config();
const express = require('express');
const cors = require('cors');

// IMPORTAÇÃO PADRÃO (Agora usamos @prisma/client direto)
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Rota de teste
app.get('/teste', async (req, res) => {
  try {
    const testes = await prisma.testeConexao.findMany();
    res.json(testes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
});

// Rota de criação
app.post('/teste', async (req, res) => {
  try {
    const novo = await prisma.testeConexao.create({
      data: { mensagem: "Node 20 funcionando! 🚀" }
    });
    res.json(novo);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar" });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});