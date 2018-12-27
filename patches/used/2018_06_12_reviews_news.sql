
ALTER TABLE `reviews` ADD `contact` INT UNSIGNED NULL DEFAULT NULL COMMENT 'Контакт' AFTER `published`;

ALTER TABLE `reviews`
	ADD `by_client_retail_id` INT UNSIGNED NULL DEFAULT NULL COMMENT 'id клиента в рознице' AFTER `by_client_req`,
	ADD `by_client_name` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT 'Имя клиента' AFTER `by_client_retail_id`;

	
	
	
ALTER TABLE `news` ADD `cat` VARCHAR(32) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL AFTER `published`, ADD `video` TEXT CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL AFTER `cat`;

ALTER TABLE `news` CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Новая новость';