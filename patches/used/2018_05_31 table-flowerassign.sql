-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Май 30 2018 г., 01:47
-- Версия сервера: 8.0.11
-- Версия PHP: 5.6.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `kpru_public`
--

-- --------------------------------------------------------

--
-- Структура таблицы `flowerassign`
--

CREATE TABLE `flowerassign` (
  `id` int(11) NOT NULL,
  `pers` int(11) UNSIGNED NOT NULL,
  `mods` int(10) UNSIGNED NOT NULL,
  `client` int(11) UNSIGNED NOT NULL,
  `count` int(4) UNSIGNED DEFAULT '1',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `invoice` int(11) UNSIGNED DEFAULT NULL,
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '0',
  `emp` int(11) DEFAULT NULL COMMENT 'Сотрудник, завершивший возложение',
  `done_date` date DEFAULT NULL COMMENT 'Дата выполнения'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='Размещенные некрологи';

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `flowerassign`
--
ALTER TABLE `flowerassign`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `grave` (`pers`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `flowerassign`
--
ALTER TABLE `flowerassign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
