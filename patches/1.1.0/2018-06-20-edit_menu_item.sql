ALTER TABLE `menu_items` ADD `only_admin` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Показывать пункт меню только для администаторов' AFTER `group_id`;
