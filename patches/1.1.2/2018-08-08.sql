ALTER TABLE `connected_crm` CHANGE `crm_id` `crm_id` INT(11) NULL DEFAULT NULL COMMENT 'айди соединения в программе';
ALTER TABLE `goods_pos` CHANGE `crm_id` `connect_id` INT(11) NULL DEFAULT NULL COMMENT 'Номер подключения (crm) откуда пришли товары';

ALTER TABLE `photos` ADD `connect_id` INT NULL DEFAULT NULL COMMENT 'Номер коннекта сайта с программой. нужно для различия фото, отправленных с разных программ' AFTER `path`, ADD `crm_photo_id` INT NULL DEFAULT NULL COMMENT 'id фото в программе' AFTER `connect_id`;
