const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verificarToken = require('../middlewares/authMiddleware');

// salvar respostas DISC
router.post('/', (req, res) => {
    const { respostas, sessionId } = req.body;
    const usuario_id = req.usuario?.id || null;// Envio anônimo por enquanto

    if (!Array.isArray(respostas) || !sessionId) {
        return res.status(400).json({ error: 'Respostas e sessionId são obrigatórios.' });
    }

    // Validação das perguntas
    const perguntasValidas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const numerosEnviados = respostas.map(r => r.pergunta_numero);
    const todasValidas = numerosEnviados.every(num => perguntasValidas.includes(num));
    if (!todasValidas) {
        return res.status(400).json({ error: 'Respostas contêm perguntas inválidas.' });
    }

    // Validação das letras DISC
    const letrasValidas = ['D', 'I', 'S', 'C'];
    const respostasValidas = respostas.every(r =>
        letrasValidas.includes(r.resposta.toUpperCase())
    );
    if (!respostasValidas) {
        return res.status(400).json({ error: 'Respostas devem conter apenas D, I, S ou C.' });
    }

    // Contar pontuação DISC e preparar dados para inserção
    const contagem = { D: 0, I: 0, S: 0, C: 0 };
    const values = respostas.map(r => {
        const letraDISC = r.resposta.toUpperCase();
        contagem[letraDISC]++;
        return [usuario_id, r.pergunta_numero, letraDISC, letraDISC, sessionId];
    });

    // Inserir respostas no banco
    const query = `INSERT INTO respostas_disc 
      (usuario_id, pergunta_numero, resposta, letra_original, session_id)
      VALUES ?`;

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Erro ao salvar respostas:', err);
            return res.status(500).json({ error: 'Erro ao salvar respostas no banco' });
        }

        // Calcular perfil dominante
        const max = Math.max(...Object.values(contagem));
        const perfilDominante = Object.entries(contagem)
            .filter(([_, v]) => v === max)
            .map(([k]) => k)
            .join('/');

        // Inserir resultado DISC no banco
        const queryResultado = `
            INSERT INTO resultado_disc
            (usuario_id, pontuacao_d, pontuacao_i, pontuacao_s, pontuacao_c, perfil, session_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(queryResultado, [
            usuario_id,           // null no início
            contagem.D,
            contagem.I,
            contagem.S,
            contagem.C,
            perfilDominante,
            sessionId
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
