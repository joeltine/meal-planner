create schema meal_planner_dev collate utf8_general_ci;

create schema meal_planner collate utf8_general_ci;

CREATE USER IF NOT EXISTS 'mp-dev'@'192.168.1.%' IDENTIFIED BY 'changeme';

grant delete, insert, select, trigger, update on meal_planner_dev.* to 'mp-dev'@'192.168.1.%';

grant delete, insert, select, trigger, update on meal_planner.* to 'mp-dev'@'192.168.1.%';
