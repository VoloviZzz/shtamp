CREATE TABLE `fragments_settings` (
  `id` int(11) NOT NULL,
  `fragment_id` int(11) NOT NULL,
  `title` text,
  `target` varchar(255) DEFAULT NULL,
  `value` text,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `fragments_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fragments_settings_ibfk_1` (`fragment_id`);


ALTER TABLE `fragments_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `fragments_settings`
  ADD CONSTRAINT `fragments_settings_ibfk_1` FOREIGN KEY (`fragment_id`) REFERENCES `fragments` (`id`) ON DELETE CASCADE;