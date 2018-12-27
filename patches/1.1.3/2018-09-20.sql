ALTER TABLE `slides` ADD `title` TEXT NULL DEFAULT NULL AFTER `image`, ADD `subtitle` TEXT NULL DEFAULT NULL AFTER `title`, ADD `text` TEXT NULL DEFAULT NULL AFTER `subtitle`;
ALTER TABLE `menu_items` ADD `priority` INT NULL DEFAULT '1';
