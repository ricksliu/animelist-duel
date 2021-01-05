const mysql = require('mysql');

// Info for pool of connections to MySQL database
let mysql_connection_pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'covid2020',
  database: 'mal_profiles',
  timezone: 'UTC'
});

function deleteFakeProfiles() {
    mysql_connection_pool.query(
        `DELETE FROM profiles
        WHERE (user_id < 0)`,
        (e, results, fields) => {
            if (e) {
                console.log(`Failed to delete fake profiles from database 'profiles'. (${e})`);
            } else {
                console.log(`Deleted fake profiles from database 'profiles'.`);
            }
        }
    );

    mysql_connection_pool.query(
        `DELETE FROM profile_stats
        WHERE (user_id < 0)`,
        (e, results, fields) => {
            if (e) {
                console.log(`Failed to delete fake profiles from database 'profile_stats'. (${e})`);
            } else {
                console.log(`Deleted fake profiles from database 'profile_stats'.`);
            }
        }
    );
}

function createFakeProfiles() {
    mysql_connection_pool.query(
        `INSERT INTO profiles (
            user_id,
            last_updated,
            username,
            user_image
        ) VALUES (
            -1,
            '2020-01-01 00:00:00',
            'fakeuser1',
            'media/fakeuser1.jpg'
        )`,
        (e, results, fields) => {
            if (e) {
                console.log(`Failed to insert profile for user 'fakeuser1' in database 'profiles'. (${e})`);
            } else {
                console.log(`Inserted profile for user 'fakeuser1' in database 'profiles'.`);
            }
        }
    );

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
            '2020-01-01 00:00:00',
            -1,
            7.43,
            24.1,
            1462,
            282,
            203,
            3,
            0,
            1,
            0,
            76
        )`,
        (e, results, fields) => {
            if (e) {
            console.log(`Failed to insert stats for user 'fakeuser1' into database 'profile_stats'. (${e})`);
            } else {
            console.log(`Inserted stats for user 'fakeuser1' into database 'profile_stats'.`);
            }
        }
    );

    mysql_connection_pool.query(
        `INSERT INTO profiles (
            user_id,
            last_updated,
            username,
            user_image
        ) VALUES (
            -2,
            '2020-01-02 00:00:00',
            'fakeuser2',
            'media/fakeuser2.jpg'
        )`,
        (e, results, fields) => {
            if (e) {
                console.log(`Failed to insert profile for user 'fakeuser2' in database 'profiles'. (${e})`);
            } else {
                console.log(`Inserted profile for user 'fakeuser2' in database 'profiles'.`);
            }
        }
    );

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
            '2020-01-02 00:00:00',
            -2,
            7.65,
            33.4,
            1862,
            338,
            296,
            2,
            4,
            24,
            4,
            32
        )`,
        (e, results, fields) => {
            if (e) {
            console.log(`Failed to insert stats for user 'fakeuser2' into database 'profile_stats'. (${e})`);
            } else {
            console.log(`Inserted stats for user 'fakeuser2' into database 'profile_stats'.`);
            }
        }
    );
}

// deleteFakeProfiles();
createFakeProfiles();