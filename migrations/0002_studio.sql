create table if not exists studio_owner (
  id integer primary key,
  owner_user_id text
);

insert into studio_owner (id, owner_user_id)
values (1, null)
on conflict (id) do nothing;

create table if not exists studio_doc (
  id integer primary key,
  draft jsonb not null,
  published jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists studio_media (
  id text primary key,
  name text not null,
  kind text not null,
  mime text not null default '',
  alt text not null default '',
  caption text not null default '',
  folder text not null default 'Atelier',
  focal_x double precision not null default 0.5,
  focal_y double precision not null default 0.5,
  zoom double precision not null default 1,
  web_data text,
  original_data text,
  external_url text,
  poster_data text,
  bytes integer not null default 0,
  width integer,
  height integer,
  composition text,
  created_at timestamptz not null default now()
);

create index if not exists studio_media_folder_idx on studio_media (folder);

create table if not exists studio_inquiries (
  id text primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists studio_revisions (
  id serial primary key,
  label text not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);
