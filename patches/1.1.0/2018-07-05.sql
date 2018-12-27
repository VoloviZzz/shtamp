ALTER TABLE `posts` ADD `similar_posts_id` VARCHAR(55) NULL DEFAULT NULL COMMENT 'Номера похожих постов' AFTER `target`;
