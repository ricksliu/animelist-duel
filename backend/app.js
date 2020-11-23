const http = require("http");
const url = require("url");
const jikanjs = require("jikanjs");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
    // req.query is undefined
    var query = url.parse(req.url, true).query;

    jikanjs.loadUser(query.username).then((user) => {
        // Sets headers: designates response as json, allows requests from all domains
        res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});

        // Sends JSON-encoded string
        res.write(JSON.stringify({
            days_watched: user.anime_stats.days_watched
        }));
        res.end();

    }).catch((err) => {
        console.error(err);
    });
});

server.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}/`);
});
