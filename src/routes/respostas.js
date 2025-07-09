const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verificarToken = require('../middlewares/authMiddleware');

// salvar respostas DISC
router.post('/', verificarToken, (req, res) => {
    const usuario_id = req.usuario.id;
    const { respostas } = req.body;

    // validações básicas
    if (!usuario_id || !Array.isArray(respostas) || respostas.length !== 10) {
        return res.status(400).json({ error: 'Envie exatamente 10 respostas.' });
    }

    const perguntasValidas = [1,2,3,4,5,6,7,8,9,10];
    const numerosEnviados = respostas.map(r => r.pergunta_numero);
    const todasValidas = numerosEnviados.every(num => perguntasValidas.includes(num));
    if (!todasValidas) {
        return res.status(400).json({ error: 'Respostas contêm perguntas inválidas.' });
    }

    const letrasValidas = ['A', 'B', 'C', 'D'];
    const mapaDISC = { A: 'D', B: 'I', C: 'S', D: 'C' };

    const respostasValidas = respostas.every(r => letrasValidas.includes(r.resposta.toUpperCase()));
    if (!respostasValidas) {
        return res.status(400).json({ error: 'Respostas devem ser apenas A, B, C ou D.' });
    }

    // contar pontuação DISC
    const contagem = { D: 0, I: 0, S: 0, C: 0 };
    const values = [];

    respostas.forEach(r => {
        const letraRaw = r.resposta.toUpperCase();
        const letraDISC = mapaDISC[letraRaw];

        contagem[letraDISC]++;
        values.push([
            usuario_id,
            r.pergunta_numero,
            letraDISC  // armazenamos a letra DISC já convertida
        ]);
    });

    const queryInsert = 'INSERT INTO respostas_disc (usuario_id, pergunta_numero, resposta) VALUES ?';

    db.query(queryInsert, [values], (err, result) => {
        if (err) {
            console.error('Erro ao salvar respostas:', err);

            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    error: 'Uma ou mais respostas já foram registradas para esse usuário.',
                    detalhe: 'Não é permitido responder a mesma pergunta duas vezes.'
                });
            }

            return res.status(500).json({ error: 'Erro ao salvar respostas no banco' });
        }

        // Calcular perfil dominante
        const max = Math.max(...Object.values(contagem));
        const perfilDominante = Object.entries(contagem)
            .filter(([_, v]) => v === max)
            .map(([k]) => k)
            .join('/');

        const queryResultado = `
            INSERT INTO resultado_disc 
            (usuario_id, pontuacao_d, pontuacao_i, pontuacao_s, pontuacao_c, perfil)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(queryResultado, [
            usuario_id,
            contagem.D,
            contagem.I,
            contagem.S,
            contagem.C,
            perfilDominante
        ], (err2) => {
            if (err2) {
                console.error('Erro ao salvar resultado:', err2);
                return res.status(500).json({ error: 'Erro ao salvar resultado no banco' });
            }

            res.status(201).json({
                message: 'Respostas e resultado salvos',
                resultado: {
                    pontuacoes: contagem,
                    perfil: perfilDominante
                }
            });
        });
    });
});

module.exports = router;
