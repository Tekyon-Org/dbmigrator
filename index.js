/**
 * dbmigrator
 * A powerful utility to migrate one form of database to another, seamlessly.
 * @author Tekyon Open-Source
 * @version 1.0.0
*/

// Semantic Version of this release
const version = '1.0.0';

// Import required libraries
const fs = require("fs");
var mysql = require('mysql');
var sqlite3 = require('sqlite3').verbose();
var execa = require('execa');
var prompt = require('inquirer');
var listr = require('listr');
var chalk = require('chalk');
var {errorHandler} = require('./src/errorHandler');

// Stores all the available database drivers
var Drivers = [];

// Stores all the available database migrators
var Migrators = [];

// Load all the database drivers
const driverFiles = fs.readdirSync('./src/drivers').filter(file => file.endsWith('.js'));
for (const file of driverFiles) {
	const driver = require(`./src/drivers/${file}`);
    Drivers.push(driver);
}

// Load all the database migrators
const migratorFiles = fs.readdirSync('./src/migrators').filter(file => file.endsWith('.js'));
for (const file of migratorFiles) {
	const migrator = require(`./src/migrators/${file}`);
    Migrators[migrator.source+'-'+migrator.destination] = migrator;
}

// Welcome message
console.log(chalk.underline.bold.green(`\nWelcome to dbmigrator v${version}\n`));

prompt.prompt([
    {
        type: 'list',
        name: 'migrationSource',
        message: 'Which database do you want to migrate from? (source)',
        choices: Drivers.map(arr => arr.label),
        filter: function (val) {
            return val.toLowerCase();
        },
    },
    {
        type: 'list',
        name: 'migrationDestination',
        message: 'Which database do you want to migrate to? (destination)',
        choices: Drivers.map(arr => arr.label),
        filter: function (val) {
            return val.toLowerCase();
        },
    }
]).then(answers => {

    if(Migrators[answers.migrationSource + '-' + answers.migrationDestination]) {

        console.log(chalk.greenBright("\nRunning migrator...\n"));

        // Execute the migrator
        Migrators[answers.migrationSource + '-' + answers.migrationDestination].run();

    }else {
        console.error(chalk.redBright(`\nSorry, ${answers.migrationSource + '-' + answers.migrationDestination} migrator does not exist. You can submit an issue for adding this migrator.`));
    }

}).catch(errorHandler);


/*
// Fetch commandline configuration
var config = {};

// The SQLite database file name
config.sdbFile = process.argv[2];

// MySQL database name
config.mdbName = process.argv[3];

// MySQL host
config.mdbHost = process.argv[4];

// MySQL user name
config.mdbUser = process.argv[5];

// MySQL user password
config.mdbPassword = process.argv[6];

// Initialize SQLite database
var sdb = new sqlite3.Database(`./${config.sdbFile}`);

console.log("Initializing MySQL connection...");

// Connect to MySQL
var mdb = mysql.createConnection({
    host: config.mdbHost,
    user: config.mdbUser,
    port: '3306',
    password: config.mdbPassword=="null" ? "" : config.mdbPassword,
    database: config.mdbName
});

mdb.connect(function(err) {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
   
    console.info('Connected to MySQL successfully as ID ' + mdb.threadId);
    console.log("Initializing SQLite3 connection...");

    sdb.serialize(function() {
        console.info("Connected to SQLite successfully and serialized.");
        console.log("Fetching all data from SQLite database...");
        sdb.run('CREATE TABLE "userdata_new" ("id" TEXT NOT NULL, "last_relapse" INTEGER, "usertype" INTEGER, "past_streaks" TEXT, "points" INTEGER, PRIMARY KEY("id"))')
           .run('INSERT INTO userdata_new(id, last_relapse, usertype, past_streaks, points) SELECT id, last_relapse, usertype, past_streaks, points FROM userdata')
           .all("SELECT * FROM userdata_new", function(err, allRows) {

            if(err != null){
                console.log("Failed to fetch data from SQLite database: " + err);
                return;
            }

            console.info("Successfully fetched all rows from SQLite database.");

            console.log("Creating table...");

            mdb.query(
                'CREATE TABLE userdata (id BIGINT NOT NULL, last_relapse BIGINT, usertype INTEGER, past_streaks TEXT, points BIGINT, PRIMARY KEY (id))',
                (error, results) => {
                    
                    if(error) {
                        console.log("Failed to create table: " + error);
                        return;
                    }

                    console.log("Inserting data into MySQL database...");

                    mdb.query(
                        'INSERT INTO userdata (id, last_relapse, usertype, past_streaks, points) VALUES ?',
                        [allRows.map(item => [item.id, item.last_relapse, item.usertype, item.past_streaks, item.points])],
                        (error, results) => {
                            // Close database connection
                            mdb.end();

                            if(error) {
                                console.log("Failed to batch insert data into MySQL database: " + error);
                                return;
                            }

                            console.log("Dropping temporary table...");
                            sdb.run('DROP TABLE userdata_new', function(err) {
                                if(err) {
                                    console.error("Failed to drop SQLite temporary table due to: " + err);
                                }else {
                                    console.log("Dropped temorary table successfully.");
                                    console.log(results);
                                    console.log("\nSuccessfully imported data from SQLite database to MySQL database!");
                                    console.log("All hail Seyan.");
                                }

                                // Close database connection
                                sdb.close();
                            });

                        }
                    );
                }
            );

        });

    });
});
*/