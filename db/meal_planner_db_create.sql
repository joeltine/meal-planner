-- DDL file to rebuild DB schemas from scratch.

create table if not exists ingredients
(
    id         int unsigned auto_increment
        primary key,
    name       varchar(255)                not null comment 'Human readable name of ingredient.',
    api_id     int unsigned                null,
    aisle      json default (json_array()) null,
    categories json default (json_array()) null,
    image      varchar(255)                null
);

create fulltext index ingredients_name_fulltext_index
    on ingredients (name);

create table if not exists recipes
(
    id            int unsigned auto_increment
        primary key,
    name          varchar(255)                not null comment 'Human readable recipe name.',
    instructions  text                        not null comment 'Full recipe preparation instructions',
    description   text                        null comment 'Long-form recipe description.',
    external_link varchar(2048)               null,
    prep_time_min int                         not null,
    cook_time_min int                         not null,
    categories    json default (json_array()) not null
);

create table if not exists units
(
    id   int unsigned auto_increment
        primary key,
    name varchar(255) not null
);

create table if not exists ingredient_lists
(
    id                      int unsigned auto_increment
        primary key,
    recipe_id               int unsigned not null,
    ingredient_id           int unsigned not null,
    unit_id                 int unsigned not null,
    quantity                double       not null,
    ingredient_display_name varchar(255) null comment 'Ingredient name as given exactly from the recipe. E.g., could be "carrots, julienned" where the underlying ingredient_id is just "carrots".',
    constraint ingredient_id_relation
        foreign key (ingredient_id) references ingredients (id)
            on update cascade on delete cascade,
    constraint recipe_id_relation
        foreign key (recipe_id) references recipes (id)
            on update cascade on delete cascade,
    constraint unit_id_relation
        foreign key (unit_id) references units (id)
            on update cascade on delete cascade
);

create table if not exists recipe_types
(
    id   int auto_increment
        primary key,
    name varchar(64) not null,
    constraint recipe_types_id_uindex
        unique (id)
);

create table if not exists meal_types
(
    id   int auto_increment
        primary key,
    name varchar(64) not null,
    constraint meal_types_id_uindex
        unique (id)
);

create table if not exists recipe_categories
(
    id   int auto_increment
        primary key,
    name varchar(64) not null,
    constraint recipe_categories_id_uindex
        unique (id)
);

create table if not exists recipe_category_associations
(
    id                 int auto_increment,
    recipe_category_id int          not null,
    recipe_id          int unsigned not null,
    constraint recipe_category_associations_pk
        primary key (id),
    constraint recipe_category_associations_recipe_categories_id_fk
        foreign key (recipe_category_id) references recipe_categories (id)
            on update cascade on delete cascade,
    constraint recipe_category_associations_recipes_id_fk
        foreign key (recipe_id) references recipes (id)
            on update cascade on delete cascade
);

create unique index recipe_category_associations_id_uindex
    on recipe_category_associations (id);

create table if not exists meal_type_associations
(
    id           int auto_increment,
    meal_type_id int          not null,
    recipe_id    int unsigned not null,
    constraint meal_type_associations_pk
        primary key (id),
    constraint meal_type_associations_meal_types_id_fk
        foreign key (meal_type_id) references meal_types (id)
            on update cascade on delete cascade,
    constraint meal_type_associations_recipes_id_fk
        foreign key (recipe_id) references recipes (id)
            on update cascade on delete cascade
);

create unique index meal_type_associations_id_uindex
    on meal_type_associations (id);

create table if not exists recipe_type_associations
(
    id             int auto_increment,
    recipe_type_id int          not null,
    recipe_id      int unsigned not null,
    constraint recipe_type_associations_pk
        primary key (id),
    constraint recipe_type_associations_recipe_types_id_fk
        foreign key (recipe_type_id) references recipe_types (id)
            on update cascade on delete cascade,
    constraint recipe_type_associations_recipes_id_fk
        foreign key (recipe_id) references recipes (id)
            on update cascade on delete cascade
);

create unique index recipe_type_associations_id_uindex
    on recipe_type_associations (id);