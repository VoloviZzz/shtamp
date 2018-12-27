ALTER TABLE `routes_aliases` CHANGE `title` `title` VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;
ALTER TABLE `goods_cats` ADD `alias_id` INT NULL DEFAULT NULL AFTER `parent_id`;
ALTER TABLE `goods_pos` ADD `alias_id` INT NULL DEFAULT NULL AFTER `recycled`;
