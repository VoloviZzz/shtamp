CREATE TABLE `achievements` ( 
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT , 
	`img` TEXT NULL DEFAULT NULL , 
	`title` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Новое достижение' , 
	`text` TEXT NULL DEFAULT NULL , 
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
	PRIMARY KEY (`id`)) ENGINE = InnoDB;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Список достижений', 'achievements-list', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

INSERT INTO `templates` (`id`, `title`, `name`, `created`) VALUES (NULL, 'Двухколоночный макет страницы', 'two-column', CURRENT_TIMESTAMP);

CREATE TABLE `callbacks` ( `id` INT UNSIGNED NOT NULL AUTO_INCREMENT , `manager_id` INT UNSIGNED NULL DEFAULT NULL COMMENT 'кто ответил на звонок' , `recipient_id` INT UNSIGNED NULL DEFAULT NULL COMMENT 'для кого предназначается звонок' , `client_number` VARCHAR(20) NOT NULL COMMENT 'номер телефона клиента' , `status` TINYINT NOT NULL DEFAULT '1' COMMENT 'статус обратного звонка: 1 - новый, 2 - обработан' , `completed` TIMESTAMP NULL DEFAULT NULL COMMENT 'время завершения обратного звонка' , `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'когда был создан' , PRIMARY KEY (`id`), INDEX (`manager_id`), INDEX (`recipient_id`)) ENGINE = InnoDB;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Список обратных звонков', 'callbacks-list', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Форма обратного звонка', 'callback-form', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

ALTER TABLE `news` CHANGE `published` `published` VARCHAR(100) NULL DEFAULT NULL;

ALTER TABLE `news` ADD `source_link` TEXT NULL DEFAULT NULL COMMENT 'ссылка на источник' AFTER `text`;

ALTER TABLE `news` ADD `subtitle` VARCHAR(255) NULL DEFAULT NULL AFTER `title`;

CREATE TABLE `partners` (
  `id` int(10) UNSIGNED ZEROFILL NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Новый партнёр',
  `text` text,
  `partners` BOOLEAN NOT NULL DEFAULT FALSE,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `partners` ADD PRIMARY KEY (`id`);

ALTER TABLE `partners` MODIFY `id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Наши партнёры', 'partners-list', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, '\"Исходный код\"', 'source-code', NULL, '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

CREATE TABLE `works` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `text` text,
  `publicate` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `works` ADD PRIMARY KEY (`id`);

ALTER TABLE `works` MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

ALTER TABLE `works` CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Работа 1';

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Наши работы', 'works-list', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);