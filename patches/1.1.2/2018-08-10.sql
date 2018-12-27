ALTER TABLE `goods_pos` ADD `recycled` INT NOT NULL DEFAULT '0' COMMENT 'Утилизированный или нет' AFTER `contract_price`;
ALTER TABLE `goods_pos` CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;
