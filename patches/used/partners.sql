CREATE TABLE `partners` (
  `id` int(10) UNSIGNED ZEROFILL NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Новый партнёр',
  `text` text,
  `partners` BOOLEAN NOT NULL DEFAULT FALSE,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `partners` ADD PRIMARY KEY (`id`);

ALTER TABLE `partners` MODIFY `id` int(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Наши партнёры', 'partners-list', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);