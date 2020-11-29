const http = require("http");
const https = require("https");
const url = require("url");

// Info for backend
const host = "127.0.0.1";
const port = 3000;

// Returns first number in string that is surrounded by > and < as a string
function indexOfNumber(str) {
  const len = str.length;
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  // Finds start
  var start = 0;
  while (start < len) {
    if (str[start] == '>' && numbers.includes(str[start + 1])) {
      start++;
      break;
    }
    start++;
  }

  if (start != len) {
    // Finds end
    var end = start;
    while (str[end] != '<') {
      end++;
    }

    return str.slice(start, end).replace(',', '');

  } else {
    return '';
  }
}

// Finds and returns stats given HTML in string form and list of keywords
function getStats(page_html, keywords) {
  var stats = [];

  for (var i = 0; i < keywords.length; i++) {
    const num = indexOfNumber(page_html.slice(page_html.indexOf(keywords[i])));
    stats.push(num);
  }

  return stats;
}

const server = http.createServer((req, res) => {
  // Gets username from query from frontend
  const username = url.parse(req.url, true).query.username;

  // Info for request to MyAnimeList
  const options = {
    host: 'myanimelist.net',
    path: `/profile/${username}`,
    port: 443
  };

  // Sends HTTPS request to MyAnimeList
  https.get(options, (mal_res) => {
    // Gets HTML of user's page
    var page_html;
    mal_res.on('data', function (chunk) {
      page_html += chunk;
    });

    // When finished getting HTML, gets stats
    mal_res.on('end', function() {
      // Slices section with the stats
      page_html = page_html.slice(page_html.indexOf('<div class="stats anime">'), page_html.indexOf('<div class="stats manga">'));
      
      // Keywords to look for
      const keywords = [
        'Mean Score',
        'Days',
        'Episodes',
        'Total Entries',
        'Completed',
        'Watching',
        'On-Hold',
        'Rewatched',
        'Dropped',
        'Plan to Watch'
      ]

      const stats = getStats(page_html, keywords);

      // Sets headers: designates response as json, allows requests from all domains
      res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
  
      // Sends JSON-encoded string
      res.write(JSON.stringify({
        mean_score: stats[0],
        days_watched: stats[1],
        episodes_watched: stats[2],
        total_entries: stats[3],
        completed: stats[4],
        watching: stats[5],
        on_hold: stats[6],
        rewatched: stats[7],
        dropped: stats[8],
        plan_to_watch: stats[9]
      }));
      res.end();
    });

  }).on('error', (e) => {
      console.log(e.message);
  });
});

server.listen(port, host, () => {
    console.log(`http://${host}:${port}/`);
});
