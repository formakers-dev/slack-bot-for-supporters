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

rtm.on('message', event => {
    // Skip messages that are from a bot or my own user ID
    if ((event.subtype && event.subtype === 'bot_message') ||
        (!event.subtype && event.user === rtm.activeUserId)) {
        return;
    }

    console.log(`(channel:${event.channel}) ${event.user} said: ${event.text}`);

    const text = event.text;
    const groups = text.match(new RegExp(config.triggerName + "야?[^\w\d\s|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*", "gi"));
    // console.log(groups, workspace.triggerName);

    if (!groups || groups.length < 1) {
        return;
    }

    if (groups[0] === text) {
        const answers = ["네?", "왜요?", "부르셨나요?", "네!"];
        rtm.sendMessage(answers[Math.floor(Math.random() * answers.length)], event.channel);
        return;
    }

    if (text.includes("도움말")) {
        const answers = [
            "안녕하세요! 약간 모자르지만 착한 포메스 봇 입니다." +
            "\n포메스 봇 사용법을 알려드릴게요! 🤗" +
            "\n" +
            "\n1️⃣ 지금처럼 제가 필요하실땐 `포메스` 나 `포메스야` 라고 불러주세요." +
            "\n2️⃣ 기타 자세한 사용법은 이 링크에서 확인해주세요 : [노션링크]" ];
        rtm.sendMessage(answers[Math.floor(Math.random() * answers.length)], event.channel);
    } else {
        const answers = [
            "제가 잘 모르는 내용이에요 😭",
            "뭐라구요?", "못 알아들었어요ㅠㅠ",
            "잘 모르겠어요ㅠㅠ\n제 사용법이 궁금하시면 `포메스 도움말` 이라고 말씀해보세요!"
        ];
        rtm.sendMessage(answers[Math.floor(Math.random() * answers.length)], event.channel);
    }
});

const listen = (req, res) => {
    if (!rtm.connected) {
        rtm.start();
        res.send(config.triggerName + " 출동! 🚨");
        console.log("[RTM listen] start");
    } else {
        res.send(config.triggerName + "는 이미 연결되어있어요! ☺️");
    }
};

module.exports = {listen};