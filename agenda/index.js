const Agenda = require('agenda');
const {WebClient} = require('@slack/web-api');
const config = require('../config');
const MessageController = require('../controller/message');

const web = new WebClient(config.slackApiToken);

const agenda = new Agenda({
    db: {
        address: config.agendaDbUrl,
        collection: 'fomes-slack-jobs',
    }
});

agenda.on('ready', () => {
    console.log('agenda start!');

    agenda.start();
});

agenda.define('notify weekly dashboard', job => {
    console.log('[job] notify weekly dashboard\ndata=', JSON.stringify(job.attrs.data));

    const jobData = job.attrs.data;
    const metadata = jobData.data;

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
                agenda.every(metadata.when, jobData.name, {
                    name: jobData.name,
                    data: {
                        when: metadata.when,
                            channel: metadata.channel,
                        activityName: metadata.activityName,
                        groupName: metadata.groupName,
                        currentWeek: metadata.currentWeek + 1,
                        closeWeek: metadata.closeWeek,
                        isNotifyToAll: metadata.isNotifyToAll,
                        isShareBetaTests: metadata.currentWeek !== metadata.closeWeek,
                    }
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
};

const scheduleJob = (jobData) => {
    let result;
    if (jobData.type === 'interval') {
        result = agenda.every(jobData.when, jobData.name, jobData);
    } else {
        result = agenda.schedule(jobData.when, jobData.name, jobData);
    }
    console.log(result)
};

module.exports = {
    init,
    scheduleJob
};