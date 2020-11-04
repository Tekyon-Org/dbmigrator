/**
 * MySQL Driver
*/

var prompt = require('inquirer');
var mysql = require('mysql');
var {inqErrorHandler} = require('./../errorHandler');

class MySQLDriver {

    /**
     * @constructor
    */
    constructor() {
        this.connection = null;
        this.auth = {
            name: null,
            host: null,
            user: null,
            password: null,
            port: null
        };
    }

    /**
     * Requests connection information
    */
    promptConnection() {
        prompt.prompt([
            {
                type: 'input',
                name: 'host',
                message: 'Enter your MySQL database Host',
                default: 'localhost',
            },
            {
                type: 'number',
                name: 'port',
                message: 'Enter your MySQL database Port',
                default: 3306,
            },
            {
                type: 'input',
                name: 'user',
                message: 'Enter your MySQL database User name (must have access to the database)',
                default: 'root',
            },
            {
                type: 'password',
                name: 'password',
                mask: true,
                message: 'Enter your MySQL database User password'
            },
            {
                type: 'input',
                name: 'name',
                message: 'Enter your MySQL database name',
                default: 'johnnys-pizzas',
            },
        ]).then(answers => {
            this.auth = answers;
        }).catch(inqErrorHandler);
    };

    /**
     * Connects to the MySQL database
    */
    connect() {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                host: this.auth.host,
                user: this.auth.user,
                port: this.auth.port,
                password: this.auth.password,
                database: this.auth.name
            });
            var t = this;
            this.connection.connect(function(err) {
                if (err) {
                    console.error('Error connecting to MySQL: ' + err.stack);
                    reject('Error connecting to MySQL: ' + err.stack);
                    return;
                }
                resolve(t.connection);
            });
        });
    }

    /**
     * Disconnects from the MySQL database
    */
    disconnect() {
        this.connection.end();
    }

};

// Identifies the driver, must be unique
MySQLDriver.name = 'mysql';

// Display label of the driver
MySQLDriver.label = 'MySQL';

module.exports = MySQLDriver;