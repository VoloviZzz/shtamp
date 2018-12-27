ALTER TABLE `feedback` ADD `client_id` INT NULL DEFAULT NULL AFTER `id`;

ALTER TABLE `feedback` ADD `url` VARCHAR(255) NULL DEFAULT NULL COMMENT 'url с которого пришло сообщение' AFTER `message`;

ALTER TABLE `feedback` ADD `category` VARCHAR(255) NOT NULL COMMENT 'Категория сообщений' AFTER `url`;
