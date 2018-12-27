CREATE TABLE `test_routes`.`achievements` ( 
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT , 
	`img` TEXT NULL DEFAULT NULL , 
	`title` VARCHAR(255) NOT NULL DEFAULT 'Новое достижение' , 
	`text` TEXT NULL DEFAULT NULL , 
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , 
	PRIMARY KEY (`id`)) ENGINE = InnoDB;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Список достижений', 'achievements-list', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

