-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/11/2023 às 21:09
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
  `data_agendamento` date DEFAULT NULL,
  `horario` time DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `barbearia_id` int(11) DEFAULT NULL,
  `servico_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `agendamentos`
--

INSERT INTO `agendamentos` (`id`, `data_agendamento`, `horario`, `user_id`, `barbearia_id`, `servico_id`) VALUES
(54, '2023-11-09', '15:00:00', NULL, 1, 6),
(55, '2023-11-09', '17:00:00', NULL, 1, 10);

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
  `endereco` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Despejando dados para a tabela `barbearia`
--

INSERT INTO `barbearia` (`id`, `name`, `email`, `usuario`, `senha`, `img`, `status`, `endereco`) VALUES
(1, 'Barbearia Blinders', 'barbearia.blinders@gmail.com', 'barbearia.blinders', '123', '', 'Aberto', 'Rua São Marcos, 58/Maracanã, Santarém/PA'),
(5, 'Barbearia Peaky', 'barbearia.peaky@gmail.com', 'barbearia.peaky', '1234', '', 'Fechado', ''),
(9, 'Barbearia Shelby', 'barbearia.shelby@gmail.com', 'barbearia.shelby', '12', '', 'Aberto', ''),
(10, 'Barbearia Huppes', 'huppes.babearia@gmail.com', 'barbearia,huppes', '', '', 'Fechada', ''),
(11, 'Barbearia Silver', '', '', '', '', 'Aberto', ''),
(12, 'Barbearia Huppes', 'huppes.babearia@gmail.com', 'barbearia,huppes', '', '', 'Fechada', ''),
(13, 'Barbearia Silver', '', '', '', '', 'Aberto', ''),
(14, 'Barbearia Magnus', '', '', '', '', 'Aberto', ''),
(15, 'Barbearia Oliver', '', '', '', '', 'Fechado', ''),
(16, 'Barbearia Magnus', '', '', '', '', 'Aberto', ''),
(17, 'Barbearia Oliver', '', '', '', '', 'Fechado', '');

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
(20, '1', '1', '1', '', ''),
(21, '2', '2', '2', '', '');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de tabela `barbearia`
--
ALTER TABLE `barbearia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de tabela `servico`
--
ALTER TABLE `servico`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
