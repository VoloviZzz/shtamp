ALTER TABLE `goods_cats` ADD `priority` INT NOT NULL DEFAULT '1' COMMENT 'Порядок вывода категорий' AFTER `parent_id`;
