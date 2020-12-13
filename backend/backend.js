const http = require('http');
const https = require('https');
const url = require('url');
const mysql = require('mysql');

// Info for backend server
const host = '127.0.0.1';
const port = 3000;

// Info for pool of connections to MySQL database
var mysql_connection_pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'covid2020',
  database: 'mal_profiles',
  timezone: 'UTC'
});

// Returns first substring that is surrounded by 'start_char' and 'end_char'
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
  // Gets info from query of HTTP request sent from frontend
  const username = url.parse(req.url, true).query.username.toLowerCase();
  const request = url.parse(req.url, true).query.request;
  console.log(`\nRecieved HTTP request for user '${username}' with request '${request}'.`);

  // If frontend requested data from database
  if (request == 'get') {
    // Tries to get data from database
    mysql_connection_pool.query(`SELECT * FROM mal_profile_data WHERE username = '${username}'`, (e, results, fields) => {
      // If error or could not find matching username in database, sends response with empty user_id
      if (e || results.length == 0) {
        // Sets response's headers; designates response as JSON, allows requests from all domains
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        // Sends JSON-encoded string
        res.write(JSON.stringify({
          user_id: ''
        }));
        res.end();

        if (e) {
          console.log(`Failed to get data for user '${username}' from database. (${e})`);
        } else {
          console.log(`Failed to find user '${username}' in database.`);
        }

      // Else, sends response with data
      } else {
        // Sets response's headers; designates response as JSON, allows requests from all domains
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        // Sends JSON-encoded string
        res.write(JSON.stringify({
          username: username,
          user_id: results[0].user_id,
          last_updated: results[0].last_updated.toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
          user_image: results[0].user_image,
          mean_score: results[0].mean_score.replace(/^0+/, ''),  // Removes leading zeroes
          days_watched: results[0].days_watched.replace(/^0+/, ''),  // Removes leading zeroes
          episodes_watched: results[0].episodes_watched,
          total_entries: results[0].total_entries,
          completed: results[0].completed,
          watching: results[0].watching,
          on_hold: results[0].on_hold,
          rewatched: results[0].rewatched,
          dropped: results[0].dropped,
          plan_to_watch: results[0].plan_to_watch
        }));
        res.end();

        console.log(`Sent response with data for user '${username}' from database.`);
      }
    });

  // If frontend requested new data from MyAnimeList
  } else if (request == 'update') {
    // Info for HTTPS request to MyAnimeList
    const options = {
      host: 'myanimelist.net',
      path: `/profile/${username}`,
      port: 443
    };

    // Sends HTTPS request to MyAnimeList
    https.get(options, (mal_res) => {
      // Gets HTML of user's profile page as string
      var page_html;
      mal_res.on('data', function (chunk) {
        page_html += chunk;
      });

      // When finished getting HTML
      mal_res.on('end', function() {
        // Arguments passed into firstString function
        const pre_info = [
          ['userimages', '/', '.', true, true],
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

        // Retrieved info is stored here
        var info = [];
        // Gets info
        for (var i = 0; i < pre_info.length; i++) {
          info.push(firstString(page_html.slice(page_html.indexOf(pre_info[i][0])), ...(pre_info[i].slice(1))));
        }
        // Formats date to a string consistent with the MySQL TIMESTAMP datatype
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Sets response's headers; designates response as JSON, allows requests from all domains
        res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
        // Sends JSON-encoded string
        res.write(JSON.stringify({
          username: username,
          user_id: info[0],
          last_updated: date + ' UTC',
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

        console.log(`Sent response with data for user '${username}' from MyAnimeList.`);

        // Tries to update database with new data
        // mysql.escape() adds single quotes automatically
        mysql_connection_pool.query(
          `REPLACE INTO mal_profile_data (
            username, user_id, last_updated, user_image, mean_score, 
            days_watched, episodes_watched, total_entries, completed, watching, 
            on_hold, rewatched, dropped, plan_to_watch
          ) VALUES (
            ${mysql.escape(username)}, ${info[0]}, ${mysql.escape(date)}, 'https://cdn.myanimelist.net/images/userimages/${info[0]}.jpg', ${info[1]}, 
            ${info[2]}, ${info[3]}, ${info[4]}, ${info[5]}, ${info[6]}, 
            ${info[7]}, ${info[8]}, ${info[9]}, ${info[10]}
          )`, (e, results, fields) => {
            if (e) {
              console.log(`Failed to insert data for user '${username}' into database. (${e})`);
            } else {
              console.log(`Inserted data for user '${username}' into database.`);
            }
          }
        );
      });

    // If could not send HTTPS request to MyAnimeList, sends response with empty user_id
    }).on('error', (e) => {
      // Sets response's headers; designates response as JSON, allows requests from all domains
      res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
      // Sends JSON-encoded string
      res.write(JSON.stringify({
        user_id: ''
      }));
      res.end();

      console.log(`Failed to send HTTPS request to MyAnimeList. (${e})`);
    });
  }
});

server.listen(port, host, () => {
    console.log(`Backend Server Online: http://${host}:${port}/`);
});