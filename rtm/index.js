const {RTMClient} = require('@slack/rtm-api');
const {WebClient} = require('@slack/web-api');
const config = require('../config');
const MessageController = require('../controller/message');

const botApiToken = config.slackApiToken;
const rtm = new RTMClient(botApiToken);
const web = new WebClient(botApiToken);

rtm.on('authenticated', rtmStartData => {
    console.log('Logged in as ' + rtmStartData.self.name + ' of them '
        + rtmStartData.team.name + ', but not yet connected to a channel');
});

rtm.on('team_join', event => {
    const user = event.user;
    console.log(`${user.id}(${user.profile.display_name}) joined team!`);

    const message = MessageController.getGreeting(user.profile.display_name);

    web.im.open({user: user.id})
        .then(result => rtm.sendMessage(message, result.channel.id))
        .catch(err => console.log(err));
});

rtm.on('message', event => {
    if (!event.user) {
        return;
    }

    // Skip messages that are from a bot or my own user ID
    if ((event.subtype && event.subtype === 'bot_message') ||
        (!event.subtype && event.user === rtm.activeUserId)) {
        return;
    }

    console.log(`(channel:${event.channel}) ${event.user} said: ${event.text}`);

    const text = event.text;
    const groups = text.match(new RegExp(config.triggerName + "아?[^\w\d\s|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*", "gi"));
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
        rtm.sendMessage(MessageController.getHelp(), event.channel);
    } else if (text.match(/테스트[ ]?링크/g)) {
        MessageController.getSurveyLinks()
            .then(async surveyLinks => {
                const reply = await rtm.sendMessage(surveyLinks.message, event.channel);
                console.log(reply);

                surveyLinks.comments.forEach(comment => {
                    web.chat.postMessage({
                        text: comment,
                        channel: event.channel,
                        thread_ts: reply.ts,
                        as_user: true
                    });
                });
            })
            .catch(async (err) => {
                console.error(err);
                const reply = await rtm.sendMessage(
                    "으헉😭 뭔가 오류가 발생한 것 같아요!" +
                    "\n담당자들한테 얼른 고쳐달라고 할게요! 조금만 기다려주세요🙏", event.channel);
                console.log(reply)
            });
    // } else if (text.includes("[개발테스트] 진행중 테스트")) {
    //     // TODO : MessageController 리팩토링 필요
    //     //  사실상 지금의 메세지컨트롤러가 메세지서비스가 되구...
    //     //  api쏘는 것 자체가 컨트롤러가 되고...
    //     //  rtm은 rtm의 라우팅 같은 느낌이야
    //     // 임시 코드
    //     MessageController.getOpenedBetaTests()
    //         .then(async (openedBetaTestsMsg) => {
    //             const result = await web.chat.postMessage({
    //                 text: openedBetaTestsMsg.message,
    //                 channel: event.channel,
    //                 as_user: true
    //             });
    //
    //             openedBetaTestsMsg.comments.forEach(comment => {
    //                 web.chat.postMessage({
    //                     text: comment,
    //                     channel: result.channel,
    //                     thread_ts: result.ts,
    //                     as_user: true
    //                 });
    //             });
    //         }).catch(err =>  console.error(err));
    } else {
        const answers = MessageController.getSimpleAnswer(text);
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