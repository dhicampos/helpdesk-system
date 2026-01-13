const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// Chave secreta para assinar o token (Num app real, isso vai pro .env)
const JWT_SECRET = process.env.JWT_SECRET || "minha_chave_secreta_super_segura";

module.exports = {
  // --- 1. REGISTRAR NOVO USUÁRIO ---
  async registrar(req, res) {
    try {
      const { nome, email, senha, perfil } = req.body;

      // Verifica se já existe
      const usuarioExiste = await prisma.usuario.findUnique({ where: { email } });
      if (usuarioExiste) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      // Criptografa a senha (Hash)
      const hashSenha = await bcrypt.hash(senha, 10);

      // Cria no banco
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: hashSenha, // Salva o hash, nunca a senha real!
          perfil
        }
      });

      // Remove a senha do retorno para segurança
      novoUsuario.senha = undefined;

      return res.json(novoUsuario);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao registrar usuário" });
    }
  },

  // --- 2. LOGIN (AUTENTICAÇÃO) ---
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Busca o usuário
      const usuario = await prisma.usuario.findUnique({ where: { email } });
      if (!usuario) {
        return res.status(400).json({ error: "Usuário ou senha inválidos" });
      }

      // Compara a senha enviada com o Hash do banco
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        return res.status(400).json({ error: "Usuário ou senha inválidos" });
      }

      // Se passou, gera o Token (O Crachá)
      const token = jwt.sign(
        { id: usuario.id, perfil: usuario.perfil }, // O que guardamos no crachá
        JWT_SECRET,
        { expiresIn: '1d' } // Validade de 1 dia
      );

      // Retorna dados + token
      usuario.senha = undefined;
      return res.json({ usuario, token });

    } catch (error) {
      return res.status(500).json({ error: "Erro no login" });
    }
  }
};