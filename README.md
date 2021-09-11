# animelist-duel

The premise was simple: Who's wasted more time watching Japanese cartoons?

The solution? A website that pits your anime-watching stats head-to-head with another user by pulling data from the website MyAnimeList.

## Info:

The frontend was built using React, SASS and Material UI.

Inputted usernames are sent to a Spring Boot MVC backend that scrapes data from various MyAnimeList pages using regex expressions.

The data is also stored as MongoDB documents so future queries for the same user are much faster.

![Screenshot of Website](docs/screenshot_1.png)
