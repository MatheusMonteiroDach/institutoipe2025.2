const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// -------- ROTAS API (debug) --------

// Tente descomentar uma de cada vez e subir no Railway até achar a culpada
try {
    // const usuariosRoutes = require('./routes/usuarios');
    // app.use('/api/usuarios', usuariosRoutes);
    console.log("✔ Rota usuarios carregada com sucesso");
} catch (err) {
    console.error("❌ Erro na rota usuarios:", err);
}

try {
    // const respostasRoutes = require('./routes/respostas');
    // app.use('/api/respostas', respostasRoutes);
    console.log("✔ Rota respostas carregada com sucesso");
} catch (err) {
    console.error("❌ Erro na rota respostas:", err);
}

try {
    // const resultadoRoutes = require('./routes/resultado');
    // app.use('/api/resultado', resultadoRoutes);
    console.log("✔ Rota resultado carregada com sucesso");
} catch (err) {
    console.error("❌ Erro na rota resultado:", err);
}

try {
    // const authRoutes = require('./routes/auth');
    // app.use('/api/auth', authRoutes);
    console.log("✔ Rota auth carregada com sucesso");
} catch (err) {
    console.error("❌ Erro na rota auth:", err);
}

try {
    // const vincularRoute = require('./routes/vincular');
    // app.use('/api/vincular', vincularRoute);
    console.log("✔ Rota vincular carregada com sucesso");
} catch (err) {
    console.error("❌ Erro na rota vincular:", err);
}

// Rota de fallback para SPA
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
