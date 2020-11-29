const http = require("http");
const https = require("https");
const url = require("url");

// Info for backend
const host = "127.0.0.1";
const port = 3000;

// Returns first substring in string that is surrounded by 'start_char' and 'end_char'
//'numeric' forces substring to start with a number
// 'format' removes certain special characters
function firstString(str, start_char, end_char, numeric=false, format=false) {  
  const len = str.length;
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  // Finds start
  var start = 0;
  while (start < len) {
    if (str[start] == start_char && (!numeric || numbers.includes(str[start + 1]))) {
      start++;
      break;
    }
    start++;
  }

  if (start != len) {
    // Finds end
    var end = start;
    while (str[end] != end_char) {
      end++;
    }

    if (format) {
      return str.slice(start, end).replace(',', '');
    } else {
      return str.slice(start, end);
    }

  } else {
    return '';
  }
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
      const pre_info = [
        ['userimages', '/', ".", true, true],
        ['Mean Score', '>', '<', true, true],
        ['Days', '>', '<', true, true],
        ['Episodes', '>', '<', true, true],
        ['Total Entries', '>', '<', true, true],
        ['Completed', '>', '<', true, true],
        ['Watching', '>', '<', true, true],
        ['On-Hold', '>', '<', true, true],
        ['Rewatched', '>', '<', true, true],
        ['Dropped', '>', '<', true, true],
        ['Plan to Watch', '>', '<', true, true]
      ]

      // Stores info
      var info = [];

      for (var i = 0; i < pre_info.length; i++) {
        info.push(firstString(page_html.slice(page_html.indexOf(pre_info[i][0])), pre_info[i][1], pre_info[i][2], pre_info[i][3], pre_info[i][4]));
      }

      // Sets headers: designates response as json, allows requests from all domains
      res.writeHead(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
  
      // Sends JSON-encoded string
      res.write(JSON.stringify({
        username: username,
        user_id: info[0],
        user_image: `https://cdn.myanimelist.net/images/userimages/${info[0]}.jpg`,
        mean_score: info[1],
        days_watched: info[2],
        episodes_watched: info[3],
        total_entries: info[4],
        completed: info[5],
        watching: info[6],
        on_hold: info[7],
        rewatched: info[8],
        dropped: info[9],
        plan_to_watch: info[10]
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
