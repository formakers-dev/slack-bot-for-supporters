const {RTMClient} = require('@slack/rtm-api');
const {WebClient} = require('@slack/web-api');
const config = require('../config');

const botApiToken = config.slackApiToken;
const rtm = new RTMClient(botApiToken);
const web = new WebClient(botApiToken);

rtm.on('authenticated', rtmStartData => {
    console.log('Logged in as ' + rtmStartData.self.name + ' of them '
        + rtmStartData.team.name + ', but not yet connected to a channel');
});

rtm.on('team_join', event => {
    web.im.open({user: event.user})
        .then(result => {
            rtm.sendMessage(config.messages.greeting, result.channel.id);
        })
        .catch(err => console.log(err));
});

const listen = (req, res) => {
    if (!rtm.connected) {
        rtm.start();
        res.send("포메스 출동! 🚨");
    } else {
        res.send("포메스는 이미 연결되어있어요! ☺️");
    }
};

module.exports = {listen};