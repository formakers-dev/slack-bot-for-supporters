const config = {
    slackApiToken: process.env.SLACK_API_TOKEN,
    messages: {
        greeting: process.env.SLACK_MESSAGE_GREETING
    }
};

module.exports = config;