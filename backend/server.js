require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/routes'); // Importa nosso arquivo de rotas

const app = express();

app.use(express.json());
app.use(cors());

// Usa as rotas que definimos
app.use(routes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🔥 Servidor MVC rodando na porta ${PORT}`);
});