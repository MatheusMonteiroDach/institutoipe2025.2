const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const router = express.Router();
const JWT_SECRET = 'seu_token_super_secreto';

// Cadastro de usuário
router.post('/register', async (req, res) => {
    const { nome, email, regiao, profissao, senha } = req.body;

    // Agora só nome, email e senha são obrigatórios
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Preencha nome, email e senha' });
    }

    // Valores padrão se não forem enviados
    const regiaoFinal = regiao && regiao.trim() !== '' ? regiao : null;
    const profissaoFinal = profissao && profissao.trim() !== '' ? profissao : 'Não informado';

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const query = `
            INSERT INTO usuarios (nome, email, regiao, profissao, senha_hash)
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(query, [nome, email, regiaoFinal, profissaoFinal, senhaHash], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Email já está em uso' });
                }
                console.error(err);
                return res.status(500).json({ error: 'Erro ao cadastrar usuário' });
            }

            res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar senha' });
    }
});

// Login
router.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'Informe email e senha' });
    }

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor' });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const usuario = results[0];
        const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaConfere) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome, profissao: usuario.profissao, regiao: usuario.regiao },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
    });
});

module.exports = router;
