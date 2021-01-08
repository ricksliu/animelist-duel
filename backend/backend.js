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
let mysqlConnectionPool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'covid2020',
  database: 'mal_profiles',
  timezone: 'UTC'
});

// Returns first substring surrounded by two chars
// 'source' is the raw HTML, 'substring' is a substring to start searching from
function scrapeString(source, substring, startChar, endChar, nonEmpty=false, numeric=true) {
  if (source.indexOf(substring) < 0) {
    return '';
  }

  const str = source.slice(source.indexOf(substring) + substring.length);
  const len = str.length;
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  
  // Finds start
  let start = 0;
  while (start < len) {
    start++;
    if (str[start - 1] == startChar && (!nonEmpty || str[start] != endChar) && (!numeric || numbers.includes(str[start]))) {
      break;
    }
  }
  
  if (start < len) {
    // Finds end
    let end = start;
    while (str[end] != endChar) {
      end++;
    }
    return str.slice(start, end).replace(',', '');
  
  } else {
    return '';
  }
}

// Returns the date in a string consistent with the MySQL TIMESTAMP datatype
function getDateTIMESTAMP() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function getInfo(req, res) {
  const username = url.parse(req.url, true).query.username.toLowerCase();
  console.log(`\nRecieved request 'get' for user '${username}'.`);

  // Tries to get data from database
  mysqlConnectionPool.query(
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
      if (e) {
        console.log(`Failed to get data for user '${username}' from databases. (${e})`);
        getNewInfo(req, res);

      } else if (results.length == 0) {
        console.log(`Failed to find data for user '${username}' in databases.`);
        getNewInfo(req, res);

      } else {
        // Sends response
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          user_id: results[0].user_id,
          last_updated: results[0].date.toISOString().slice(0, 19).replace('T', ' ') + ' UTC',
          username: username,
          user_image: results[0].user_image,
          mean_score: results[0].mean_score.toFixed(2).replace(/^0+/, ''),  // Removes leading zeroes, keeps 2 decimals
          days_watched: results[0].days_watched.toFixed(1).replace(/^0+/, ''),  // Removes leading zeroes, keeps 1 decimal
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
}

function getNewInfo(req, res) {
  const username = url.parse(req.url, true).query.username.toLowerCase();
  console.log(`\nRecieved request 'update' for user '${username}'.`);

  const options = {
    host: 'myanimelist.net',
    path: `/profile/${username}`,
    port: 443
  };

  // Sends HTTPS request to MyAnimeList
  https.get(options, (malRes) => {
    // Gets HTML of user's profile page
    let pageSource;
    malRes.on('data', function (chunk) {
      pageSource += chunk;
    });

    malRes.on('end', function() {
      // Scrapes for info
      const scrapingInfo = [
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
      const info = scrapingInfo.map(i => scrapeString(pageSource, ...i));

      // If user does not exist, sends blank string as user_id
      if (info[0] == '') {
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          user_id: ''
        }));
        res.end();
        console.log(`Failed to find data for user '${username}' from MyAnimeList. Sent empty response.`);
      
      } else {
        // Sends response
        const date = getDateTIMESTAMP();
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
        mysqlConnectionPool.query(
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
        mysqlConnectionPool.query(
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
    console.log(`Failed to send HTTPS request to MyAnimeList. Sent empty response. (${e})`);
  });
}

function getScoreDiffs(req, res) {
  let usernames = [url.parse(req.url, true).query.username1.toLowerCase(), url.parse(req.url, true).query.username2.toLowerCase()];
  let flip = 0;  // Used to make sure info is sent back to frontend in right order
  if (usernames[0] > usernames[1]) {
    usernames = usernames.reverse();
    flip = 1;
  }
  console.log(`\nRecieved request for 'score diffs' for users '${usernames[0]}' and '${usernames[1]}'.`);

  // If same user, sends empty response
  if (usernames[0] == usernames[1]) {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      results: []
    }));
    res.end();
    console.log(`Sent empty response.`);
  }

  // Tries to get data from database
  mysqlConnectionPool.query(
    `SELECT title, title_image, score_1 AS score_${1 + flip}, score_2 AS score_${2 - flip}, score_difference
    FROM score_differences
    WHERE username_1 = '${usernames[0]}' AND username_2 = '${usernames[1]}' AND date = (
      SELECT MAX(date)
      FROM score_differences
      WHERE username_1 = '${usernames[0]}' AND username_2 = '${usernames[1]}'
    ) ORDER BY ABS(score_1 - score_2) DESC`,

    (e, results, fields) => {
      if (e) {
        console.log(`Failed to get score difference data from databases. (${e})`);
        getNewScoreDiffs(req, res);

      } else if (results.length == 0) {
        console.log('Failed to find score difference data in databases.');
        getNewScoreDiffs(req, res);
        
      } else {
        // Sends response
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          results: results.slice(0, 5)
        }));
        res.end();
        console.log(`Sent response with score difference data from databases.`);
      }
    }
  );
}

// Used by 'getNewScoreDiffs()'; 'f' is a callback function
function getAnimeImage(id, callback) {
  const options = {
    host: 'myanimelist.net',
    path: `/anime/${id}`,
    port: 443
  };

  // Sends HTTPS request to MyAnimeList
  https.get(options, (malRes) => {
    // Gets HTML of page
    let pageSource;
    malRes.on('data', function (chunk) {
      pageSource += chunk;
    });

    malRes.on('end', function() {
      const link = scrapeString(pageSource, '<img class="lazyload" data-src=', '"', '"', false, false);
      console.log(`Found link to image for entry '${id}' on MyAnimeList.`);
      callback(link);
    });

  }).on('error', (e) => {
    console.log(`Failed to send HTTPS request to MyAnimeList. (${e})`);
    callback('');
  });
}

function getNewScoreDiffs(req, res) {
  let usernames = [url.parse(req.url, true).query.username1.toLowerCase(), url.parse(req.url, true).query.username2.toLowerCase()];
  let flip = 0;  // Used to make sure info is sent back to frontend in right order
  if (usernames[0] > usernames[1]) {
    usernames = usernames.reverse();
    flip = 1;
  }
  console.log(`\nRecieved request for new 'score diffs' for users '${usernames[0]}' and '${usernames[1]}'.`);

  // If same user, sends empty response
  if (usernames[0] == usernames[1]) {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      results: []
    }));
    res.end();
    console.log(`Sent empty response.`);
  }

  const options = {
    host: 'myanimelist.net',
    path: `/shared.php?u1=${usernames[0]}&u2=${usernames[1]}`,
    port: 443
  };

  // Sends HTTPS request to MyAnimeList
  https.get(options, (malRes) => {
    // Gets HTML of page
    let pageSource;
    malRes.on('data', function (chunk) {
      pageSource += chunk;
    });

    malRes.on('end', function() {
      let entries = [];
      // Gets scores of all shared anime entries; values may be non-numeric; loop ends when 'pageSource' has no more shared entries in it
      pageSource = pageSource.slice(pageSource.indexOf('Score Difference'));
      while (pageSource.indexOf('Mean Values') >= 0) {
        let entry = [];
        let entrySource = pageSource.slice(pageSource.indexOf('<tr>') + 4, pageSource.indexOf('</tr>'));
        // Gets ID and title of entry
        entry.push(scrapeString(entrySource, 'anime', '/', '/', true));
        entry.push(scrapeString(entrySource, 'anime', '>', '<', true, false));
        // Gets the 3 scores from the entry; loop ends when 'entrySource' has no more scores in it
        entrySource = entrySource.slice(entrySource.indexOf('</td>') + 5);
        while (entrySource.indexOf('</td>') >= 0) {
          entry.push(scrapeString(entrySource, 'align="center"', '>', '<', true, false));
          entrySource = entrySource.slice(entrySource.indexOf('</td>') + 5);  // Slices score off of entry
        }
        entries.push(entry);
        pageSource = pageSource.slice(pageSource.indexOf('</tr>') + 5);  // Slices entry off of source
      }
      // Removes first and last entries (not real entries)
      entries.shift();
      entries.pop();
      entries = entries.filter(e => e[4] != '&nbsp;');  // Removes all entries with non-existent differences (only one user rated it)
      // Sorts by largest difference
      entries.sort((a, b) => {
        if (parseInt(a[4]) == parseInt(b[4])) {
          return 0;
        } else {
          return (parseInt(a[4]) > parseInt(b[4])) ? -1 : 1;
        }
      });
      entries = entries.slice(0, 5);  // Keeps top five
      let linksObtained = 0;

      for (let i = 0; i < entries.length; i++) {
        getAnimeImage(entries[i][0], function(link) {
          entries[i].push(link);
          linksObtained++;

          // Only executed once all links have been obtained; effectively waits for all HTTPS requests in all the getAnimeImage()
          if (linksObtained == entries.length) {
            // Formats 'entries' into array of objects for sending as response
            let sentEntries = [];
            entries.forEach(e => sentEntries.push({
              'title': e[1],
              'title_image': e[5],
              'score_1': e[2 + flip],
              'score_2': e[3 - flip],
              'score_difference': e[4]
            }));

            // Sends response
            res.writeHead(200, headers);
            res.write(JSON.stringify({
              results: sentEntries
            }));
            res.end();
            console.log(`Sent response with score difference data from MyAnimeList.`);

            const date = getDateTIMESTAMP();

            // Tries to insert each entry into 'score_differences' database
            entries.forEach(e => {
              mysqlConnectionPool.query(
                `INSERT INTO score_differences (
                  date,
                  username_1,
                  username_2,
                  title_id,
                  title,
                  title_image,
                  score_1,
                  score_2,
                  score_difference
                ) VALUES (
                  ${mysql.escape(date)},
                  ${mysql.escape(usernames[0])},
                  ${mysql.escape(usernames[1])},
                  ${e[0]}, 
                  ${mysql.escape(e[1])},
                  ${mysql.escape(e[5])},
                  ${e[2]},
                  ${e[3]},
                  ${e[4]}
                )`,
                (e, results, fields) => {
                  if (e) {
                    console.log(`Failed to insert score difference data for users '${usernames[0]}' and '${usernames[1]}' into database 'score_differences'. (${e})`);
                  } else {
                    console.log(`Inserted score difference data for users '${usernames[0]}' and '${usernames[1]}' into database 'score_differences'.`);
                  }
                }
              );
            });
          }
        });
      }
    });

  // If could not send HTTPS request to MyAnimeList
  }).on('error', (e) => {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      results: []
    }));
    res.end();
    console.log(`Failed to send HTTPS request to MyAnimeList. Sent empty response. (${e})`);
  });
}

const server = http.createServer((req, res) => {
  // Gets info from query of HTTP request sent from frontend
  const request = url.parse(req.url, true).query.request;

  // If frontend requested data from databases
  if (request == 'get') {
    getInfo(req, res);

  // If frontend requested new data from MyAnimeList
  } else if (request == 'update') {
    getNewInfo(req, res);

  // If frontend requested data on score differences from databases (it is assumed that both usernames are valid)
  } else if (request == 'getdiff') {
    getScoreDiffs(req, res);

  // If frontend requested new data on score differences from MyAnimeList (it is assumed that both usernames are valid)
  } else if (request == 'updatediff') {
    getNewScoreDiffs(req, res);
  }
});

server.listen(port, host, () => {
    console.log(`Online: http://${host}:${port}/`);
});