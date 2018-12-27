ALTER TABLE `routes` ADD `allow_index` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Добавляет маршрут в sitemap' AFTER `dynamic`;
