ALTER TABLE `user` ADD `alternative_email` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_alternativeEmail_unique` ON `user` (`alternative_email`);