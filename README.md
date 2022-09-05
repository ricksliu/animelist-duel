# animelist-duel

A website that compares the stats of MyAnimeList users. Made with React, Spring Boot and MongoDB.

## About

The frontend is built using React, SASS and Material UI. Inputted usernames are sent to a Spring Boot MVC backend that scrapes data from various MyAnimeList pages using regex expressions. The data is also stored as MongoDB documents so future queries for the same user are much faster.

![Screenshot of Project](docs/screenshot_1.png)
