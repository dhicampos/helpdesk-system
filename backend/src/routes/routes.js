const express = require('express');
const router = express.Router();

// Importa os Controllers
const AuthController = require('../controllers/AuthController');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // (Temporário, depois vamos mover para Controllers dedicados)

// --- ROTAS DE AUTENTICAÇÃO ---
router.post('/usuarios', AuthController.registrar);
router.post('/login', AuthController.login);

// --- ROTAS DE CHAMADOS (Ainda sem controller dedicado, mantendo funcionalidade) ---
// Vamos refatorar isso na próxima aula, mas mantemos aqui para o Front não quebrar
router.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.usuario.findMany({ 
    select: { id: true, nome: true, email: true, perfil: true } // Não retorna a senha!
  });
  res.json(usuarios);
});

router.get('/chamados', async (req, res) => {
  const chamados = await prisma.chamado.findMany({ include: { solicitante: true } });
  res.json(chamados);
});

router.post('/chamados', async (req, res) => {
  try {
    const { titulo, descricao, patrimonioId, solicitanteId } = req.body;
    const chamado = await prisma.chamado.create({
      data: { titulo, descricao, patrimonioId, solicitante: { connect: { id: Number(solicitanteId) } } }
    });
    res.json(chamado);
  } catch (err) { res.status(500).json({error: "Erro"}); }
});

module.exports = router;