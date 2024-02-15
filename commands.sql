CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text  NOT NULL,
    title text  NOT NULL,
    likes int default 0
);

insert into blogs (author, url, title) values ('Amir Khan', 'no url', 'some article');
insert into blogs (author, url, title) values ('University of Helsinki', 'no url', 'some article');