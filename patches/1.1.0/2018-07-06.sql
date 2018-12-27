ALTER TABLE `goods_pos` ADD `service` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Является ли позиция сервисом' AFTER `price`;
