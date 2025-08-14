const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta public
console.log("Registrando rota estática: /public");
app.use(express.static(path.join(__dirname, '../public')));

// ROTAS prefixadas com /api
try {
    console.log("Registrando rota: /api/usuarios");
    const usuariosRoutes = require('./routes/usuarios');
    app.use('/api/usuarios', usuariosRoutes);
} catch (err) {
    console.error("❌ Erro ao registrar /api/usuarios:", err);
}

try {
    console.log("Registrando rota: /api/respostas");
    const respostasRoutes = require('./routes/respostas');
    app.use('/api/respostas', respostasRoutes);
} catch (err) {
    console.error("❌ Erro ao registrar /api/respostas:", err);
}

try {
    console.log("Registrando rota: /api/resultado");
    const resultadoRoutes = require('./routes/resultado');
    app.use('/api/resultado', resultadoRoutes);
} catch (err) {
    console.error("❌ Erro ao registrar /api/resultado:", err);
}

try {
    console.log("Registrando rota: /api/auth");
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);
} catch (err) {
    console.error("❌ Erro ao registrar /api/auth:", err);
}

try {
    console.log("Registrando rota: /api/vincular");
    const vincularRoute = require('./routes/vincular');
    app.use('/api/vincular', vincularRoute);
} catch (err) {
    console.error("❌ Erro ao registrar /api/vincular:", err);
}

// Rota de fallback para o front-end
try {
    console.log("Registrando rota de fallback *");
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
} catch (err) {
    console.error("❌ Erro na rota de fallback:", err);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
