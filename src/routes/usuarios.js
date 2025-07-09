const express = require('express');
const router = express.Router();
const db = require('../config/db');

// rota para cadastrar usuário
router.post('/', (req, res) => {
    const { nome, email, regiao, profissao } = req.body;

    if (!nome || !email || !profissao) {
        return res.status(400).json({ error: 'Nome , email e profissao são obrigatórios' });
    }

    // query para inserir usuário no banco
    const query = 'INSERT INTO usuarios (nome, email, regiao, profissao) VALUES (?, ?, ?, ? )';

    db.query(query, [nome, email, regiao || null, profissao], (err, result) => {
        if (err) {
            console.error(err);
            // Verifica erro de email duplicado
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Email já cadastrado' });
            }
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
    });
});

module.exports = router;
