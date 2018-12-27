ALTER TABLE `news` ADD `main_photo` VARCHAR(255) NOT NULL DEFAULT '/img/image-not-found.jpg' AFTER `text`;
ALTER TABLE `news` ADD `public` INT NOT NULL DEFAULT '0' COMMENT 'Отображается новость на сайте или нет' AFTER `counter_views`;
ALTER TABLE `news` CHANGE `published` `published` VARCHAR(100) NULL DEFAULT NULL;
ALTER TABLE `news` ADD `source_link` TEXT NULL DEFAULT NULL COMMENT 'ссылка на источник' AFTER `text`;
ALTER TABLE `news` ADD `subtitle` VARCHAR(255) NULL DEFAULT NULL AFTER `title`;
