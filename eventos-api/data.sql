-- ============================================================================
-- SCRIPT DML IDEMPOTENTE (DADOS INICIAIS / SEED DATA)
-- Sistema de Gerenciamento de Eventos e Inscrições
-- Executa sem duplicar registros em reinicializações com mode=always
-- ============================================================================

-- Categorias iniciais
INSERT INTO tb_categoria (nome, descricao)
SELECT 'Tecnologia e Inovação', 'Workshops, hackathons e palestras sobre desenvolvimento de software, IA e infraestrutura.'
WHERE NOT EXISTS (SELECT 1 FROM tb_categoria WHERE nome = 'Tecnologia e Inovação');

INSERT INTO tb_categoria (nome, descricao)
SELECT 'Negócios e Empreendedorismo', 'Seminários de gestão, pitches de startups e networking corporativo.'
WHERE NOT EXISTS (SELECT 1 FROM tb_categoria WHERE nome = 'Negócios e Empreendedorismo');

INSERT INTO tb_categoria (nome, descricao)
SELECT 'Cultura e Arte', 'Exposições, feiras de livros, festivais de música e apresentações teatrais.'
WHERE NOT EXISTS (SELECT 1 FROM tb_categoria WHERE nome = 'Cultura e Arte');

-- Eventos iniciais
INSERT INTO tb_evento (titulo, descricao, data_evento, local_evento, preco, categoria_id)
SELECT 'Summit de Inteligência Artificial 2026', 'Conferência sobre LLMs, Agentes IA e Visão Computacional.', '2026-10-15 09:00:00', 'Centro de Convenções Tech, SP', 150.00, c.id
FROM tb_categoria c
WHERE c.nome = 'Tecnologia e Inovação'
  AND NOT EXISTS (SELECT 1 FROM tb_evento WHERE titulo = 'Summit de Inteligência Artificial 2026');

INSERT INTO tb_evento (titulo, descricao, data_evento, local_evento, preco, categoria_id)
SELECT 'Workshop Spring Boot & Cloud Native', 'Curso prático hands-on de criação de APIs REST com Spring Boot 3.', '2026-11-05 14:00:00', 'Auditório Principal da Faculdade', 50.00, c.id
FROM tb_categoria c
WHERE c.nome = 'Tecnologia e Inovação'
  AND NOT EXISTS (SELECT 1 FROM tb_evento WHERE titulo = 'Workshop Spring Boot & Cloud Native');

INSERT INTO tb_evento (titulo, descricao, data_evento, local_evento, preco, categoria_id)
SELECT 'Feira Regional de Startups', 'Encontro de investidores-anjo e startups emergentes.', '2026-11-20 10:00:00', 'Pavilhão de Exposições Central', 0.00, c.id
FROM tb_categoria c
WHERE c.nome = 'Negócios e Empreendedorismo'
  AND NOT EXISTS (SELECT 1 FROM tb_evento WHERE titulo = 'Feira Regional de Startups');

INSERT INTO tb_evento (titulo, descricao, data_evento, local_evento, preco, categoria_id)
SELECT 'Festival de Música Independente', 'Apresentação de bandas e artistas locais.', '2026-12-01 18:00:00', 'Parque da Cidade', 30.00, c.id
FROM tb_categoria c
WHERE c.nome = 'Cultura e Arte'
  AND NOT EXISTS (SELECT 1 FROM tb_evento WHERE titulo = 'Festival de Música Independente');

-- Inscrições iniciais
INSERT INTO tb_inscricao (nome_participante, email_participante, data_inscricao, status, evento_id)
SELECT 'Ana Silva', 'ana.silva@email.com', '2026-09-10 10:30:00', 'CONFIRMADA', e.id
FROM tb_evento e
WHERE e.titulo = 'Summit de Inteligência Artificial 2026'
  AND NOT EXISTS (SELECT 1 FROM tb_inscricao i WHERE i.email_participante = 'ana.silva@email.com' AND i.evento_id = e.id);

INSERT INTO tb_inscricao (nome_participante, email_participante, data_inscricao, status, evento_id)
SELECT 'Carlos Eduardo', 'carlos.eduardo@email.com', '2026-09-11 11:15:00', 'CONFIRMADA', e.id
FROM tb_evento e
WHERE e.titulo = 'Summit de Inteligência Artificial 2026'
  AND NOT EXISTS (SELECT 1 FROM tb_inscricao i WHERE i.email_participante = 'carlos.eduardo@email.com' AND i.evento_id = e.id);

INSERT INTO tb_inscricao (nome_participante, email_participante, data_inscricao, status, evento_id)
SELECT 'Beatriz Oliveira', 'beatriz.oliveira@email.com', '2026-09-12 14:20:00', 'CONFIRMADA', e.id
FROM tb_evento e
WHERE e.titulo = 'Workshop Spring Boot & Cloud Native'
  AND NOT EXISTS (SELECT 1 FROM tb_inscricao i WHERE i.email_participante = 'beatriz.oliveira@email.com' AND i.evento_id = e.id);

INSERT INTO tb_inscricao (nome_participante, email_participante, data_inscricao, status, evento_id)
SELECT 'Daniel Souza', 'daniel.souza@email.com', '2026-09-13 09:00:00', 'PENDENTE', e.id
FROM tb_evento e
WHERE e.titulo = 'Workshop Spring Boot & Cloud Native'
  AND NOT EXISTS (SELECT 1 FROM tb_inscricao i WHERE i.email_participante = 'daniel.souza@email.com' AND i.evento_id = e.id);

INSERT INTO tb_inscricao (nome_participante, email_participante, data_inscricao, status, evento_id)
SELECT 'Fernanda Lima', 'fernanda.lima@email.com', '2026-09-14 16:45:00', 'CONFIRMADA', e.id
FROM tb_evento e
WHERE e.titulo = 'Feira Regional de Startups'
  AND NOT EXISTS (SELECT 1 FROM tb_inscricao i WHERE i.email_participante = 'fernanda.lima@email.com' AND i.evento_id = e.id);

INSERT INTO tb_inscricao (nome_participante, email_participante, data_inscricao, status, evento_id)
SELECT 'Gabriel Santos', 'gabriel.santos@email.com', '2026-09-14 17:10:00', 'CANCELADA', e.id
FROM tb_evento e
WHERE e.titulo = 'Festival de Música Independente'
  AND NOT EXISTS (SELECT 1 FROM tb_inscricao i WHERE i.email_participante = 'gabriel.santos@email.com' AND i.evento_id = e.id);
