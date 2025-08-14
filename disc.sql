CREATE DATABASE plataforma_disc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE plataforma_disc;

-- tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    regiao VARCHAR(100),
    profissao VARCHAR(100) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE usuarios ADD COLUMN senha_hash VARCHAR(255) NOT NULL AFTER profissao;

-- tabela de respostas
CREATE TABLE respostas_disc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pergunta_numero INT NOT NULL,
    resposta CHAR(1) NOT NULL, 
    data_resposta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- tabela de resultados
CREATE TABLE resultado_disc (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    pontuacao_d INT DEFAULT 0,
    pontuacao_i INT DEFAULT 0,
    pontuacao_s INT DEFAULT 0,
    pontuacao_c INT DEFAULT 0,
    perfil VARCHAR(10), 
    data_resultado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

ALTER TABLE respostas_disc
ADD COLUMN letra_original CHAR(1) AFTER pergunta_numero;

ALTER TABLE respostas_disc ADD COLUMN session_id VARCHAR(100);
ALTER TABLE resultado_disc ADD COLUMN session_id VARCHAR(255);



ALTER TABLE respostas_disc MODIFY usuario_id INT NULL;
ALTER TABLE resultado_disc MODIFY usuario_id INT NULL;
ALTER TABLE usuarios MODIFY profissao VARCHAR(100) DEFAULT 'Não informado';
