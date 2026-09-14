-- ============================================================================
-- SCRIPT DDL COMPATÍVEL COM POSTGRESQL & H2 (REVISADO E AUDITADO)
-- Projeto Acadêmico de Banco de Dados: Sistema de Gerenciamento de Eventos
-- ============================================================================

DROP TABLE IF EXISTS tb_inscricao CASCADE;
DROP TABLE IF EXISTS tb_evento CASCADE;
DROP TABLE IF EXISTS tb_categoria CASCADE;

-- 1. Tabela Categoria
CREATE TABLE tb_categoria (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT
);

-- 2. Tabela Evento (Relacionamento 1:N com Categoria)
CREATE TABLE tb_evento (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    data_evento TIMESTAMP NOT NULL,
    local_evento VARCHAR(200) NOT NULL,
    preco NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    categoria_id BIGINT NOT NULL,
    CONSTRAINT fk_evento_categoria FOREIGN KEY (categoria_id) REFERENCES tb_categoria (id) ON DELETE CASCADE
);

-- 3. Tabela Inscricao (Relacionamento 1:N com Evento)
CREATE TABLE tb_inscricao (
    id BIGSERIAL PRIMARY KEY,
    nome_participante VARCHAR(150) NOT NULL,
    email_participante VARCHAR(150) NOT NULL,
    data_inscricao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMADA',
    evento_id BIGINT NOT NULL,
    CONSTRAINT fk_inscricao_evento FOREIGN KEY (evento_id) REFERENCES tb_evento (id) ON DELETE CASCADE
);

-- ============================================================================
-- ÍNDICES DE DESEMPENHO (AUDITORIA DE BANCO DE DADOS)
-- Otimização para JOINs e consultas agregadas via Native Query
-- ============================================================================
CREATE INDEX idx_evento_categoria ON tb_evento (categoria_id);
CREATE INDEX idx_inscricao_evento ON tb_inscricao (evento_id);
CREATE INDEX idx_inscricao_email ON tb_inscricao (email_participante);
