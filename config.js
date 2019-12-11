const config = {
    slackApiToken: process.env.SLACK_API_TOKEN,
    port: 8080,
    messages: {
        greeting: process.env.SLACK_MESSAGE_GREETING
    }
};

module.exports = config;