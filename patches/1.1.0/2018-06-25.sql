INSERT INTO `components` (`id`, `title`, `ctrl`, `block_id`, `static`, `once`, `styles`, `scripts`, `default_config`, `created`) VALUES (NULL, 'Админка книги памяти', 'memory-book-admin', '2', '0', '0', NULL, NULL, NULL, CURRENT_TIMESTAMP);
ALTER TABLE `goods_pos` CHANGE `contract_price` `contract_price` TINYINT(1) NOT NULL DEFAULT '1' COMMENT 'Договорная цена?';
