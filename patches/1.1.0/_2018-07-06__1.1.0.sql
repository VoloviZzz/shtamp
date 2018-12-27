ALTER TABLE `post_categories` ADD `target_id` INT(11) NOT NULL AFTER `id`;


INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Админка книги памяти', 'memory-book-admin', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);
ALTER TABLE `goods_pos` ADD `contract_price` TINYINT(1) NOT NULL DEFAULT '1' COMMENT 'Договорная цена?';



ALTER TABLE `goods_cats` ADD `public` BOOLEAN NULL DEFAULT FALSE AFTER `level`;


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
  
  
CREATE TABLE `questions_targets` (
  `id` int(11) NOT NULL,
  `title` varchar(75) DEFAULT 'Новая категория'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `questions_targets`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `questions_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `questions` ADD `target` INT NULL DEFAULT NULL COMMENT 'Цель вопросов: для всей компании и дополнительно к ней страницу вопрос-ответ для конкретного сотрудника' AFTER `id`;
ALTER TABLE `questions` CHANGE `target` `target` INT(11) NULL DEFAULT '0' COMMENT 'Цель вопросов: для всей компании и дополнительно к ней страницу вопрос-ответ для конкретного сотрудника';
UPDATE `questions` SET `target` = '0';



ALTER TABLE `posts` ADD `similar_posts_id` VARCHAR(55) NULL DEFAULT NULL COMMENT 'Номера похожих постов' AFTER `target`;



ALTER TABLE `goods_pos` ADD `service` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Является ли позиция сервисом' AFTER `price`;
