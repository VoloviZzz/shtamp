INSERT INTO `components` (`title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`) VALUES
('Список постов', 'posts-list', 2, 0, 0, NULL, NULL, NULL);

INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES
 (NULL, 'Отображение поста', 'post-view', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);

ALTER TABLE `fragments` ADD `settings` TEXT NULL DEFAULT NULL COMMENT 'Настройки фрагмента' AFTER `block_id`;

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL DEFAULT 'Новая публикация',
  `subtitle` varchar(255) DEFAULT NULL,
  `text` text,
  `source_link` text COMMENT 'ссылка на источник',
  `main_photo` varchar(255) NOT NULL DEFAULT '/img/image-not-found.jpg',
  `counter_views` int(11) NOT NULL DEFAULT '0',
  `public` int(11) NOT NULL DEFAULT '0' COMMENT 'Отображается публикация на сайте или нет',
  `published` varchar(100) DEFAULT NULL,
  `creator` int(11) NOT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `posts` ADD `target` VARCHAR(255) NOT NULL COMMENT 'Цель поста: новости, документы, статьи и т.п.' AFTER `source_link`;

ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `posts`
	MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

CREATE TABLE `post_targets` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `post_targets`
  ADD PRIMARY KEY (`id`);
  
ALTER TABLE `post_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
