ALTER TABLE `goods_pos` ADD `pos_id` INT NULL DEFAULT NULL COMMENT 'pos_id в программе' AFTER `main_photo`, ADD `mod_id` INT NULL DEFAULT NULL COMMENT 'mod_id в программе' AFTER `pos_id`;
ALTER TABLE `goods_pos` ADD `crm_id` INT NULL DEFAULT NULL COMMENT 'Номер подключения (crm) откуда пришли товары' AFTER `main_photo`;
