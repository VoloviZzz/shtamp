CREATE TABLE `questions_targets` (
  `id` int(11) NOT NULL,
  `title` varchar(75) DEFAULT 'Новая категория'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `questions_targets` ADD PRIMARY KEY (`id`);

ALTER TABLE `questions_targets` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `questions` ADD `target` INT NULL DEFAULT NULL COMMENT 'Цель вопросов: для всей компании и дополнительно к ней страницу вопрос-ответ для конкретного сотрудника' AFTER `id`;
ALTER TABLE `questions` CHANGE `target` `target` INT(11) NULL DEFAULT '0' COMMENT 'Цель вопросов: для всей компании и дополнительно к ней страницу вопрос-ответ для конкретного сотрудника';
UPDATE `questions` SET `target` = '0';




CREATE TABLE `questions_targets` (`id` int(11) NOT NULL, `title` varchar(75) DEFAULT 'Новая категория')
