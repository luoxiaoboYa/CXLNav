-- Add account names so users can log in with either username or email.

alter table users
  add column username varchar(80) null after id;

update users
set username = concat('user_', left(replace(id, '-', ''), 12))
where username is null;

alter table users
  modify column username varchar(80) not null;

alter table users
  add unique key uk_users_username (username);
