CREATE TABLE `routes_targets` (
  `id` int(11) NOT NULL,
  `title` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `routes_targets`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `routes_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

  ALTER TABLE `routes` ADD `target_id` INT NULL DEFAULT NULL COMMENT 'Какую цель преследует маршрут' AFTER `menu_id`;