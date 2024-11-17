# Project 3: Go game project

Classic multiplayer game of go / weiqi.

<img width="1711" alt="image" src="https://github.com/user-attachments/assets/5be09daa-0c17-4953-aea7-837da1da8930">


## Features

- Players take turn to place a piece on a board in a classic game of GO/ WeiQi
- Log in to view ongoing games, make move, and save progress.
- The home page shows a dashboard of outstanding games, ended games, and key game statistics.
- Dynamic board rendering: Players can choose a board of their choice (5x5, 9x9, 13x13, 17x17, 19x19, 21x21)
- 'Replay mode' to show move history: the onscreen board will show every move made by both players in sequence.

## Technologies

- Frontend: HTML, CSS, JS, DOM, AJAX
- Backend: PostgreSQL, Express, Sequelize
- Deployment: Heroku, Webpack
- Version Control: Git

## Thoughts

- First time experimenting with client-side JS/AJAX requests - has made the UX much better.
- Key game logic was outsourced to an npm package - this enabled me to focus on other key aspects: UI, user Auth, AJAX, dynamic CSS.
- Dynamic rendering of different board sizes made possible through my custom built css library.
- MVC model and sequelize has provided a much better structure for development.
- Key concepts: Management of game state; Client-side JS for enhanced UX; MVC; Sequelize; Webpack
- Business focus: What kind of information does the user need to see at a glance? What features will help the user read the situation and make informed decisions?

## Development

```
npm install
npm run seed
npm run watch
npm start
```

Open localhost:3004 in browser.

You can login using the following:

```
// User 1
username: yettie
password: nsMAC8cgG

// User 2
username: tybi
password: tybipassword
```

If you are experiencing issues with outdated webpack bundling, update the html / css loaders:

```
npm install html-webpack-plugin --save-dev
npm install postcss css-loader mini-css-extract-plugin --save-dev
```
