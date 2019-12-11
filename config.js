const config = {
    port: process.env.PORT || 80,
    slackApiToken: process.env.SLACK_API_TOKEN,
    dbUrl: process.env.MONGO_URL,
    triggerName: '포메스',
};

module.exports = config;