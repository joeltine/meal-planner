-- DDL file to rebuild DB schemas from scratch.

create table ingredients
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

create table recipes
(
    id            int unsigned auto_increment
        primary key,
    created_at    timestamp default CURRENT_TIMESTAMP not null,
    name          varchar(255)                        not null comment 'Human readable recipe name.',
    instructions  text                                not null comment 'Full recipe preparation instructions',
    description   text                                null comment 'Long-form recipe description.',
    external_link varchar(2048)                       null,
    prep_time_min smallint                            not null,
    cook_time_min smallint                            not null,
    categories    json      default (json_array())    not null
);

create table units
(
    id         int unsigned auto_increment
        primary key,
    created_at timestamp default CURRENT_TIMESTAMP not null,
    name       varchar(255)                        not null
);

create table ingredient_lists
(
    id                      int unsigned auto_increment
        primary key,
    created_at              timestamp default CURRENT_TIMESTAMP not null,
    recipe_id               int unsigned                        not null,
    ingredient_id           int unsigned                        not null,
    unit_id                 int unsigned                        not null,
    quantity                decimal unsigned                    not null,
    ingredient_display_name varchar(255)                        null comment 'Ingredient name as given exactly from the recipe. E.g., could be "carrots, julienned" where the underlying ingredient_id is just "carrots".',
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