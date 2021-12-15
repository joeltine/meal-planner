CREATE TABLE `ingredients`
(
    `id`          int(10) unsigned NOT NULL AUTO_INCREMENT,
    `created_at`  timestamp        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `name`        varchar(255)     NOT NULL COMMENT 'Human readable name of ingredient.',
    `description` text,
    `category`    varchar(255)              DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 7084
  DEFAULT CHARSET = utf8;

CREATE TABLE `units`
(
    `id`         int(10) unsigned NOT NULL AUTO_INCREMENT,
    `created_at` timestamp        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `name`       varchar(255)     NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  AUTO_INCREMENT = 10
  DEFAULT CHARSET = utf8;
