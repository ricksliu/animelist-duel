const http = require('http');
const https = require('https');
const url = require('url');
const mysql = require('mysql');

// Info for backend
const host = '127.0.0.1';
const port = 3000;

// Headers used for HTTP responses; designates response as JSON, allows requests from all domains
const headers = {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'};

// Info for (pool of) connections to MySQL database
let mysql_connection_pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'covid2020',
  database: 'mal_profiles',
  timezone: 'UTC'
});

// Info used for scraping data from MyAnimeList
const scraping_info = [
  ['userimages', '/', '.'],
  ['Mean Score', '>', '<'],
  ['Days', '>', '<'],
  ['Episodes', '>', '<'],
  ['Total Entries', '>', '<'],
  ['Completed', '>', '<'],
  ['Watching', '>', '<'],
  ['On-Hold', '>', '<'],
  ['Rewatched', '>', '<'],
  ['Dropped', '>', '<'],
  ['Plan to Watch', '>', '<']
]

// Returns first substring surrounded by the two chars in 'surrounding_chars'
// 'source' is the raw HTML, 'substring' is a substring to start searching from
function scrapeNumber(source, substring, start_char, end_char) {
  const str = source.slice(source.indexOf(substring));
  const len = str.length;
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  
  // Finds start
  let start = 0;
  while (start < len) {
    if (str[start] == start_char && numbers.includes(str[start + 1])) {
      start++;
      break;
    }
    start++;
  }
  
  if (start != len) {
    // Finds end
    let end = start;
    while (str[end] != end_char) {
      end++;
    }
    return str.slice(start, end).replace(',', '');
  
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
    mysql_connection_pool.query(
      `SELECT *
      FROM (
        SELECT *
        FROM profiles
        WHERE username = '${username}'
      ) p JOIN (
        SELECT *
        FROM profile_stats
        WHERE user_id = (
          SELECT MIN(user_id)
          FROM profiles
          WHERE username = '${username}'
        )
      ) ps ON p.user_id = ps.user_id
      ORDER BY id DESC`,
      (e, results, fields) => {
        // If error or could not find matching username in database, sends blank string as user_id
        if (e || results.length == 0) {
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            user_id: ''
          }));
          res.end();

          if (e) {
            console.log(`Failed to get data for user '${username}' from databases. (${e})`);
          } else {
            console.log(`Failed to find data for user '${username}' in databases.`);
          }

        } else {
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            user_id: results[0].user_id,
            last_updated: results[0].date.toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
            username: username,
            user_image: results[0].user_image,
            mean_score: results[0].mean_score.toFixed(2).replace(/^0+/, ''),  // Removes extra zeroes; 2 decimals
            days_watched: results[0].days_watched.toFixed(1).replace(/^0+/, ''),  // Removes extra zeroes; 1 decimal
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
          console.log(`Sent response with data for user '${username}' from databases.`);
        }
      }
    );

  // If frontend requested new data from MyAnimeList
  } else if (request == 'update') {
    const options = {
      host: 'myanimelist.net',
      path: `/profile/${username}`,
      port: 443
    };

    // Sends HTTPS request to MyAnimeList
    https.get(options, (mal_res) => {
      // Gets HTML of user's profile page as string
      let page_source;
      mal_res.on('data', function (chunk) {
        page_source += chunk;
      });

      // When finished
      mal_res.on('end', function() {
        const info = scraping_info.map(i => scrapeNumber(page_source, ...i));

        // If user does not exist, sends blank string as user_id
        if (info[0] == '') {
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            user_id: ''
          }));
          res.end();
          console.log(`Failed to find data for user '${username}' from MyAnimeList.`);
        
        } else {
          // Formats date to a string consistent with the MySQL TIMESTAMP datatype
          const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

          res.writeHead(200, headers);
          res.write(JSON.stringify({
            user_id: info[0],
            last_updated: date + ' UTC',
            username: username,
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

          // Tries to update 'profile' database
          mysql_connection_pool.query(
            `REPLACE INTO profiles (
              user_id,
              last_updated,
              username,
              user_image
            ) VALUES (
              ${info[0]},
              ${mysql.escape(date)},
              ${mysql.escape(username)},
              'https://cdn.myanimelist.net/images/userimages/${info[0]}.jpg'
            )`,
            (e, results, fields) => {
              if (e) {
                console.log(`Failed to update profile for user '${username}' in database 'profiles'. (${e})`);
              } else {
                console.log(`Updated profile for user '${username}' in database 'profiles'.`);
              }
            }
          );

          // Tries to insert into 'profile_stats' database
          mysql_connection_pool.query(
            `INSERT INTO profile_stats (
              date,
              user_id,
              mean_score, 
              days_watched,
              episodes_watched,
              total_entries,
              completed,
              watching,
              on_hold,
              rewatched,
              dropped,
              plan_to_watch
            ) VALUES (
              ${mysql.escape(date)},
              ${info[0]},
              ${info[1]}, 
              ${info[2]},
              ${info[3]},
              ${info[4]},
              ${info[5]},
              ${info[6]}, 
              ${info[7]},
              ${info[8]},
              ${info[9]},
              ${info[10]}
            )`,
            (e, results, fields) => {
              if (e) {
                console.log(`Failed to insert stats for user '${username}' into database 'profile_stats'. (${e})`);
              } else {
                console.log(`Inserted stats for user '${username}' into database 'profile_stats'.`);
              }
            }
          );
        }
      });

    // If could not send HTTPS request to MyAnimeList, sends blank string as user_id
    }).on('error', (e) => {
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        user_id: ''
      }));
      res.end();
      console.log(`Failed to send HTTPS request to MyAnimeList. (${e})`);
    });
  }
});

server.listen(port, host, () => {
    console.log(`Online: http://${host}:${port}/`);
});