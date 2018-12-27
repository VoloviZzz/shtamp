ALTER TABLE `goods_cats` ADD `priority` INT NOT NULL DEFAULT '1' COMMENT 'Порядок вывода категорий' AFTER `parent_id`;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Поиск захоронений', 'search-deads', NULL, '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);