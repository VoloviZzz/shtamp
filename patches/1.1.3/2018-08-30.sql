ALTER TABLE `header_nav` ADD `parent_id` INT NOT NULL DEFAULT '0' AFTER `href`;
INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Слайдер', 'slider', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);
