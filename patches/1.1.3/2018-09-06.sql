ALTER TABLE `clients` ADD `avatar` TEXT NULL DEFAULT NULL AFTER `mail`;

CREATE TABLE `reviews_target` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Новая категория отзывов',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `reviews_target`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `reviews_target`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Карта', 'map', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);