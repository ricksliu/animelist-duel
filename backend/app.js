const http = require("http");
const url = require("url");
const jikanjs = require("jikanjs");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
    var query = url.parse(req.url, true).query;

    jikanjs.loadUser(query.username).then((user) => {
        // Sets headers: designates response as json, allows requests from all domains
        res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});

        // Sends JSON-encoded string
        res.write(JSON.stringify({
            user_id: user.user_id,
            username: user.username,
            image_url: user.image_url,
            joined: user.joined,
            
            mean_score: user.anime_stats.mean_score,
            days_watched: user.anime_stats.days_watched,
            episodes_watched: user.anime_stats.episodes_watched,
            total_entries: user.anime_stats.total_entries,
            completed: user.anime_stats.completed,
            watching: user.anime_stats.watching,
            on_hold: user.anime_stats.on_hold,
            dropped: user.anime_stats.dropped,
            plan_to_watch: user.anime_stats.plan_to_watch,
            rewatched: user.anime_stats.rewatched
        }));
        res.end();

    }).catch((err) => {
        console.error(err);
    });
});

server.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}/`);
});
