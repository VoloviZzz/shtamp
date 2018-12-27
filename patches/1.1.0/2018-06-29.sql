INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Отображение Агента', 'agents-view', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

CREATE TABLE `agents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `phones` varchar(255) DEFAULT NULL,
  `text` text,
  `main_photo` varchar(455) DEFAULT NULL,
  `public` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `agents` ADD `contact_phone` VARCHAR(30) NULL DEFAULT NULL COMMENT 'Номер телефона для отправки смс' AFTER `phones`;

ALTER TABLE `agents`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `agents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;