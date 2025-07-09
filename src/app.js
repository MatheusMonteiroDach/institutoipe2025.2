const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const usuariosRoutes = require('./routes/usuarios');
const respostasRoutes = require('./routes/respostas');
const resultadoRoutes = require('./routes/resultado');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// ROTAS prefixadas com /api
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/respostas', respostasRoutes);
app.use('/api/resultado', resultadoRoutes);
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.send('API DISC funcionando!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
