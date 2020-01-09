const Agenda = require('agenda');
const {WebClient} = require('@slack/web-api');
const config = require('../config');
const BetaTestService = require('../services/beta-tests');
const MessageController = require('../controller/message');

const web = new WebClient(config.slackApiToken);

const agenda = new Agenda({
    db: {
        address: config.agendaDbUrl,
        collection: 'fomes-slack-jobs',
    }
});

agenda.define('notify opened betatests', async job => {
    console.log('[job] notify opened betatests');

    MessageController.getOpenedBetaTests()
        .then(async (openedBetaTestsMsg) => {
            const result = await web.chat.postMessage({
                text: openedBetaTestsMsg.message,
                channel: process.env.FORMAKERS_DEV_CHANNEL_ID,
                as_user: true
            });

            openedBetaTestsMsg.comments.forEach(comment => {
                web.chat.postMessage({
                    text: comment,
                    channel: result.channel,
                    thread_ts: result.ts,
                    as_user: true
                });
            });
        }).catch(err =>  console.error(err));
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

    agenda.on('ready', async () => {
        console.log('agenda start!');

        await agenda.start();
        // await agenda.now('notify opened betatests');
        // agenda.cancel({})
        //     .then(numRemoved => {
        //         console.log(`${numRemoved} jobs removed`);
        //         return agenda.start();
        //     })
        //     .catch(err => console.error(err));
    });
};

module.exports = {init};