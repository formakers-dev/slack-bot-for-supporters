const config = {
    port: process.env.PORT || 80,
    slackApiToken: process.env.SLACK_API_TOKEN,
    dbUrl: process.env.MONGO_URL,
    triggerName: '포메스봇',
    helpPageUrl: 'https://www.notion.so/formakers/6a23f042541742cda658a1ef1ad38138'
};

module.exports = config;