CREATE TABLE `meta_data` (
  `id` int(11) NOT NULL,
  `route_id` int(11) DEFAULT NULL,
  `alias_id` int(11) DEFAULT NULL,
  `target_type` varchar(55) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `title` text,
  `description` text,
  `keywords` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `meta_data`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `meta_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Установка мета-тегов', 'meta-manage', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);