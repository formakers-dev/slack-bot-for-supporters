const config = {
    slackApiToken: process.env.SLACK_API_TOKEN,
    triggerName: '포메스',
    port: 8080,
    messages: {
        greeting: process.env.SLACK_MESSAGE_GREETING
    }
};

module.exports = config;