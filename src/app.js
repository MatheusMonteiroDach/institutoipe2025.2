const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');

const usuariosRoutes = require('./routes/usuarios');
const respostasRoutes = require('./routes/respostas');
const resultadoRoutes = require('./routes/resultado');
const authRoutes = require('./routes/auth');
const vincularRoute = require('./routes/vincular');

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public (subindo um nível)
app.use(express.static(path.join(__dirname, '../public')));

// ROTAS prefixadas com /api
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/respostas', respostasRoutes);
app.use('/api/resultado', resultadoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vincular', vincularRoute);

// Fallback para o front-end (sem pattern para evitar erro no Express 5)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
