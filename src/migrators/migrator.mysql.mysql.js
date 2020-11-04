/**
 * MySQL-MySQL Migrator
*/

var driver = require('./../drivers/mysql');

module.exports = {

    // Source database for this migrator
    source: 'mysql',

    // Destination database for this migrator
    destination: 'mysql',

    // Migrator program
    run: () => {

        var sql = new driver();
        sql.promptConnection();

        console.log("Connecting...");
        sql.connect().then((db) => {
            console.log(db);
        }).catch((e) => {
            console.error(e);
        });

    }

};