CREATE TABLE `questions_categories` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `questions_categories`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `questions_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `questions_categories` ADD `target_id` INT NULL DEFAULT NULL AFTER `id`;
ALTER TABLE `questions_categories` CHANGE `target_id` `target_id` INT(11) NULL DEFAULT '0';

INSERT INTO questions_categories (title) SELECT question as title FROM questions WHERE type = 'category';
