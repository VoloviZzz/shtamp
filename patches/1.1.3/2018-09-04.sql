CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `image` text,
  `priority` int(11) NOT NULL DEFAULT '1',
  `fragment_id` int(11) NOT NULL,
  `published` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
