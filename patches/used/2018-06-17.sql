CREATE TABLE `post_categories` ( 
	`id` INT NOT NULL AUTO_INCREMENT , 
	`title` VARCHAR(100) NOT NULL , 
	`count` INT NOT NULL DEFAULT '0' ,
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY (`id`)
) ENGINE = InnoDB;

UPDATE posts p
	LEFT JOIN post_targets pt ON p.target = pt.title
SET p.target = pt.id;

ALTER TABLE `posts` CHANGE `cat` `cat` INT(11) UNSIGNED NULL DEFAULT NULL;

ALTER TABLE `routes` ADD `active_menu_item` INT NULL DEFAULT NULL COMMENT 'Подсветка активного пункта меню' AFTER `menu_id`;
