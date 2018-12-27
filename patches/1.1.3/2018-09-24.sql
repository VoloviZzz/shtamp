UPDATE components SET `block_id` = 2 WHERE block_id = 4;
UPDATE fragments SET `block_id` = 2 WHERE block_id = 4;
UPDATE components SET `block_id` = 2 WHERE block_id = 4;
DELETE FROM `fragments_blocks` WHERE `id` = 4;
