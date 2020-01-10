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

agenda.define('notify weekly dashboard', job => {
    console.log('[job] notify weekly dashboard\ndata=', JSON.stringify(job.attrs.data));

    const metadata = job.attrs.data;

    MessageController.getWeeklyDashboard(metadata.activityName, metadata.groupName,
        metadata.currentWeek, metadata.closeWeek, metadata.isNotifyToAll, metadata.isShareBetaTests)
        .then(resultMessage => {
            console.log(resultMessage.messageBlocks);

            web.chat.postMessage({
                text: resultMessage.title,
                blocks: resultMessage.messageBlocks,
                channel: metadata.channel,
                as_user: true
            });

            job.remove();

            if (metadata.currentWeek <= metadata.closeWeek) {
                agenda.every(metadata.when, 'notify weekly dashboard', {
                    when: metadata.when,
                    channel: metadata.channel,
                    activityName: metadata.activityName,
                    groupName: metadata.groupName,
                    currentWeek: metadata.currentWeek + 1,
                    closeWeek: metadata.closeWeek,
                    isNotifyToAll: metadata.isNotifyToAll,
                    isShareBetaTests: metadata.currentWeek !== metadata.closeWeek,
                });
            }
        }).catch(err => console.error(err));
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

        agenda.start();

        // Don't worry, It is a temporary code for test :-)
        agenda.now('notify weekly dashboard', {
            when: '00 14 * * *',
            channel: 'dev-slack-bot',
            activityName: '포메스 서포터즈 2기',
            groupName: 'supporters-2nd',
            currentWeek: 2,
            closeWeek: 10,
            isNotifyToAll: false,
            isShareBetaTests: true,
        });
    });
};

module.exports = {init};