const express = require('express');
const router = express.Router();
const db = require('../config/db');

// rota para cadastrar usuário
router.post('/', (req, res) => {
    const { nome, email, regiao, profissao } = req.body;

    if (!nome || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios' });
    }

    const profissaoFinal = profissao && profissao.trim() !== '' ? profissao : 'Não informado';

    // query para inserir usuário no banco
    const query = 'INSERT INTO usuarios (nome, email, regiao, profissao) VALUES (?, ?, ?, ? )';

    db.query(query, [nome, email, regiao || null, profissaoFinal], (err, result) => {
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
