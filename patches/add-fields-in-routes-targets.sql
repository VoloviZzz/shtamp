ALTER TABLE `routes_targets` ADD `used_table` VARCHAR(100) NOT NULL COMMENT 'используемая таблица для этого target' AFTER `title`, ADD `code` VARCHAR(100) NOT NULL COMMENT 'название переменной для кода' AFTER `used_table`;

ALTER TABLE `routes_targets` ADD `object_target_id` VARCHAR(100) NULL DEFAULT NULL COMMENT 'target объектов (например в таблице публикаций \"новости\", \"статьи\" и т.д.)' AFTER `used_table`;

ALTER TABLE `routes_targets` ADD `url_to_object` VARCHAR(255) NULL DEFAULT NULL COMMENT 'URL на страницу объекта, если не установлен алиас' AFTER `object_target_id`;

