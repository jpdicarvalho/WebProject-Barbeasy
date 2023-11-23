-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 23/11/2023 às 01:00
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `barbeasy_two`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `agendamentos`
--

CREATE TABLE `agendamentos` (
  `id` int(11) NOT NULL,
  `dia_agendamento` varchar(255) DEFAULT NULL,
  `horario` time DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `barbearia_id` int(11) DEFAULT NULL,
  `servico_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliacoes`
--

CREATE TABLE `avaliacoes` (
  `id` int(11) NOT NULL,
  `user_id` int(255) DEFAULT NULL,
  `barbearia_id` int(255) NOT NULL,
  `estrelas` int(255) NOT NULL,
  `comentarios` varchar(255) NOT NULL,
  `data_avaliacao` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `avaliacoes`
--

INSERT INTO `avaliacoes` (`id`, `user_id`, `barbearia_id`, `estrelas`, `comentarios`, `data_avaliacao`) VALUES
(16, NULL, 1, 5, '1º avaliação', '2023-11-13'),
(17, NULL, 1, 5, '2º avaiação', '2023-11-13'),
(18, NULL, 1, 5, '3º Avaliação', '2023-11-13'),
(19, NULL, 1, 3, '4º Avaliação', '2023-11-13'),
(20, NULL, 1, 1, '5º avaliação', '2023-11-13'),
(21, NULL, 18, 5, '1º avaliação', '2023-11-13'),
(22, NULL, 18, 5, '2º Avaliação, nota 5', '2023-11-13'),
(23, NULL, 20, 3, '1º Avaliação, nota 3', '2023-11-13'),
(24, NULL, 20, 5, '2º Avaliação, nota 5', '2023-11-13'),
(25, NULL, 1, 4, '6º avaliação, nota 4', '2023-11-15'),
(26, NULL, 1, 4, 'avaliação 7º, nota 4', '2023-11-17');

-- --------------------------------------------------------

--
-- Estrutura para tabela `barbearia`
--

CREATE TABLE `barbearia` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `usuario` varchar(20) NOT NULL,
  `senha` varchar(20) NOT NULL,
  `img` varchar(200) NOT NULL,
  `status` varchar(8) NOT NULL,
  `endereco` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `longitude` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `barbearia`
--

INSERT INTO `barbearia` (`id`, `name`, `email`, `usuario`, `senha`, `img`, `status`, `endereco`, `latitude`, `longitude`) VALUES
(1, 'Barbearia Blinders', 'barbearia.blinders@gmail.com', 'barbearia.blinders', '123', '', 'Aberta', 'R. Maracanãzinho, 106 - Nova Vitória, Santarém - PA, 68035-148, Brazil', '-2.441397829885292', '-54.74928713302272'),
(18, 'Babearia Mr. Oliver', 'mroliver.barbearia@gmail.com', 'barbearia.peaky', '12', '', 'Fechada', 'Tv. Sete de Setembro, 1721 - Centro, Santarém - PA, 68040-072, Brazil', '-2.4264499253688796', '-54.71914720485448'),
(20, 'Barbearia Peaky', 'peaky.barbearia@gmail.com', 'peaky.barbearia', '123', '', 'Aberta', 'R. Das Flores, 12 - Alvorada, Santarém - PA, 68047-075, Brazil', '-2.4589153037897358', '-54.75730980978355'),
(22, 'Barbearia Los Brutos', 'los.brutos.@gmail.com', 'los.brutos', '123', '', 'Aberta', 'Tv. Luís Barbosa, 91 - Laguinho, Santarém - PA, 68040-420', '-2.423179287417365', '-54.73422352458977');

-- --------------------------------------------------------

--
-- Estrutura para tabela `servico`
--

CREATE TABLE `servico` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `preco` varchar(10) NOT NULL,
  `barbearia_id` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `servico`
--

INSERT INTO `servico` (`id`, `name`, `preco`, `barbearia_id`) VALUES
(4, 'Corte de Cabelo Nava', '30', 5),
(6, 'Corte Degradê', '25', 1),
(8, 'Corte de Cabelo Soci', '15', 9),
(10, 'Corte Sorvete', '30', 1),
(11, 'Corte Social', '25', 1),
(12, 'Corte Navalhado', '30', 1),
(13, 'Corte Pigmentado', '25', 1);

-- --------------------------------------------------------

--
-- Estrutura para tabela `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(20) NOT NULL,
  `celular` varchar(15) NOT NULL,
  `img` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `senha`, `celular`, `img`) VALUES
(77, 'jpdicarvalho', 'joaopedrobraga.07@gmail.com', '123', '', '');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `barbearia_id` (`barbearia_id`),
  ADD KEY `servico_id` (`servico_id`);

--
-- Índices de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `barbearia`
--
ALTER TABLE `barbearia`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `servico`
--
ALTER TABLE `servico`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agendamentos`
--
ALTER TABLE `agendamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de tabela `avaliacoes`
--
ALTER TABLE `avaliacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de tabela `barbearia`
--
ALTER TABLE `barbearia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de tabela `servico`
--
ALTER TABLE `servico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `agendamentos`
--
ALTER TABLE `agendamentos`
  ADD CONSTRAINT `agendamentos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `agendamentos_ibfk_2` FOREIGN KEY (`barbearia_id`) REFERENCES `barbearia` (`id`),
  ADD CONSTRAINT `agendamentos_ibfk_3` FOREIGN KEY (`servico_id`) REFERENCES `servico` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
