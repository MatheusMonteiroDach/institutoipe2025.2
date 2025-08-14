const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Vincular sessionId a um usuário existente
router.post('/', (req, res) => {
    const { sessionId, usuarioId, usuario_id } = req.body;
    const finalUsuarioId = usuarioId || usuario_id;

    if (!sessionId || !finalUsuarioId) {
        return res.status(400).json({ error: 'sessionId e usuarioId são obrigatórios' });
    }

    const atualizarRespostas = new Promise((resolve, reject) => {
        db.query(
            'UPDATE respostas_disc SET usuario_id = ? WHERE session_id = ? AND usuario_id IS NULL',
            [finalUsuarioId, sessionId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });

    const atualizarResultados = new Promise((resolve, reject) => {
        db.query(
            'UPDATE resultado_disc SET usuario_id = ? WHERE session_id = ? AND usuario_id IS NULL',
            [finalUsuarioId, sessionId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });

    Promise.all([atualizarRespostas, atualizarResultados])
        .then(() => {
            res.status(200).json({ message: 'Usuário vinculado com sucesso!' });
        })
        .catch((err) => {
            console.error('Erro ao vincular usuário:', err);
            res.status(500).json({ error: 'Erro ao vincular dados ao usuário' });
        });
});

module.exports = router;
