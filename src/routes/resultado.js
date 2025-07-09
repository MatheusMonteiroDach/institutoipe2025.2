const express = require('express');
const router = express.Router();
const db = require('../config/db');

// rota para buscar o resultado DISC de um usuário
router.get('/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;

    const query = `
    SELECT pontuacao_d, pontuacao_i, pontuacao_s, pontuacao_c, perfil, data_resultado
    FROM resultado_disc
    WHERE usuario_id = ?
    ORDER BY data_resultado DESC
    LIMIT 1
  `;

    db.query(query, [usuario_id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar resultado DISC:', err);
            return res.status(500).json({ error: 'Erro ao buscar resultado' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'resultado DISC não encontrado para este usuário' });
        }

        res.json({ usuario_id, ...results[0] });
    });
});

module.exports = router;