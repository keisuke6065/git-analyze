create table git_log
(
    `date`      datetime     not null,
    file_name   varchar(255) not null,
    `module`    varchar(255)          not null,
    `extension` varchar(255)          not null
);

create index git_log_date_index
    on git_log (`date`);

create index git_log_module_index
    on git_log (`module`);

create index git_log_extension_index
    on git_log (`extension`);