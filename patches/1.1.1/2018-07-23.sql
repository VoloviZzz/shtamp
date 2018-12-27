INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Управление магазином', 'crm-admin', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

CREATE TABLE `connected_crm` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Новая CRM',
  `address` varchar(155) DEFAULT NULL,
  `host` varchar(55) NOT NULL,
  `port` int(11) NOT NULL,
  `token` varchar(75) DEFAULT NULL,
  `crm_id` int(11) DEFAULT NULL COMMENT 'айди соединения в программе',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '0 - ожидает проверки; 1 - отклонено; 3 - подключено',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `connected_crm`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `connected_crm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;