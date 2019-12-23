const Agenda = require('agenda');
const config = require('../config');

const agenda = new Agenda({
    db: {
        address: config.agendaDbUrl,
        collection: 'fomes-slack-jobs',
    }
});

const init = () => {
    const gracefulExit = cause => {
        agenda.stop()
            .then(() => {
                console.log(`agenda stopped by ${cause}!`);
                process.exit();
            })
    };

    ['exit', 'SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
        process.on(signal, gracefulExit);
    });

    process.on('uncaughtException', err => {
        console.error('Uncaught Exception:', err);
        gracefulExit('uncaught exception');
    });

    agenda.on('ready', () => {
        console.log('agenda start!');

        // agenda.cancel({})
        //     .then(numRemoved => {
        //         console.log(`${numRemoved} jobs removed`);
        //         return agenda.start();
        //     })
        //     .catch(err => console.error(err));
    });
};

module.exports = {init};