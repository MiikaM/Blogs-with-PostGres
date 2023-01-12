CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Dan abramov', 'https://danabramov', 'Writing Resilient Components');
INSERT INTO blogs (author, url, title) VALUES ('Martin Fowler', 'https://martinfowler', 'Is High Quality Software Worth the Cost?');
INSERT INTO blogs (author, url, title) VALUES ('Robert C. Martin', 'https://robercmartin', 'FP vs. OO List Processing');