module.exports = {

    // Handler for Inquirer errors
    inqErrorHandler: function(err) {
        if(error.isTtyError) {
            console.error("There was an error printing to this shell: " + error);
        } else {
            console.error("An error ocurred: " + error);
        }

        process.exit();
    }
};