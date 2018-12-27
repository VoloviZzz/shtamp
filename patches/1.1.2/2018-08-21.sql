UPDATE `routes` SET url = CONCAT(url, '/:params') WHERE dynamic = 1;
DROP TRIGGER IF EXISTS `add_views_count_to_visit`;

ALTER TABLE `routes_aliases`
  DROP `target`,
  DROP `target_id`;

  ALTER TABLE `routes_aliases` ADD `alias` VARCHAR(255) NULL DEFAULT NULL AFTER `route_id`;
  ALTER TABLE `routes_aliases` ADD `params` VARCHAR(255) NULL DEFAULT NULL AFTER `title`;