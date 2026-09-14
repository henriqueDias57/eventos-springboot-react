-- ============================================================================
-- SCRIPT DML (DADOS INICIAIS / SEED DATA)
-- Sistema de Gerenciamento de Eventos e Inscrições
-- ============================================================================

INSERT INTO tb_categoria (nome, descricao) VALUES
('Tecnologia e Inovação', 'Workshops, hackathons e palestras sobre desenvolvimento de software, IA e infraestrutura.'),
('Negócios e Empreendedorismo', 'Seminários de gestão, pitches de startups e networking corporativo.'),
('Cultura e Arte', 'Exposições, feiras de livros, festivais de música e apresentações teatrais.');

INSERT INTO tb_evento (titulo, descricao, data_evento, local_evento, preco, categoria_id) VALUES
('Summit de Inteligência Artificial 2026', 'Conferência sobre LLMs, Agentes IA e Visão Computacional.', '2026-10-15 09:00:00', 'Centro de Convenções Tech, SP', 150.00, 1),
('Workshop Spring Boot & Cloud Native', 'Curso prático hands-on de criação de APIs REST com Spring Boot 3.', '2026-11-05 14:00:00', 'Auditório Principal da Faculdade', 50.00, 1),
('Feira Regional de Startups', 'Encontro de investidores-anjo e startups emergentes.', '2026-11-20 10:00:00', 'Pavilhão de Exposições Central', 0.00, 2),
('Festival de Música Independente', 'Apresentação de bandas e artistas locais.', '2026-12-01 18:00:00', 'Parque da Cidade', 30.00, 3);

INSERT INTO tb_inscricao (nome_participante, email_participante, data_inscricao, status, evento_id) VALUES
('Ana Silva', 'ana.silva@email.com', '2026-09-10 10:30:00', 'CONFIRMADA', 1),
('Carlos Eduardo', 'carlos.eduardo@email.com', '2026-09-11 11:15:00', 'CONFIRMADA', 1),
('Beatriz Oliveira', 'beatriz.oliveira@email.com', '2026-09-12 14:20:00', 'CONFIRMADA', 2),
('Daniel Souza', 'daniel.souza@email.com', '2026-09-13 09:00:00', 'PENDENTE', 2),
('Fernanda Lima', 'fernanda.lima@email.com', '2026-09-14 16:45:00', 'CONFIRMADA', 3),
('Gabriel Santos', 'gabriel.santos@email.com', '2026-09-14 17:10:00', 'CANCELADA', 4);
