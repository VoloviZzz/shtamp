INSERT INTO `routes` (`id`, `title`, `url`, `template_id`, `menu_id`, `show_title`, `use_component_title`, `access`, `dynamic`, `required`, `edit_access`, `delete_access`, `seo_keywords`, `seo_description`, `created`, `updated`) VALUES (NULL, 'Корзина', '/cart', '2', NULL, '1', '0', '1', '0', '1', '1', '1', NULL, NULL, CURRENT_TIMESTAMP, NULL);

ALTER TABLE `news` CHANGE `title` `title` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'Новая новость';

ALTER TABLE `goods_cats` ADD `title_bottom` VARCHAR(255) NULL DEFAULT NULL COMMENT 'Короткое название категории' AFTER `title`;

ALTER TABLE `goods_pos` ADD `float_price` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Плавающая цена?' AFTER `price`, ADD `contract_price` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Договорная цена?' AFTER `float_price`;

ALTER TABLE `goods_pos` DROP FOREIGN KEY goods_pos_ibfk_1;