CREATE TABLE `uploaded_files` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(255) NOT NULL , `original_name` VARCHAR(255) NOT NULL , `path` TEXT NOT NULL , `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB COMMENT = 'загруженные файлы';
ALTER TABLE `uploaded_files` ADD `url` TEXT NOT NULL AFTER `path`;
