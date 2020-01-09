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

    // TODO : 리팩토링 하자
    if (text.includes("도움말")) {
        const answers =
            "안녕하세요! 약간 모자르지만 착한 " + config.triggerName+ " 입니다." +
            "\n" + config.triggerName + " 사용법을 알려드릴게요! 🤗" +
            "\n" +
            "\n1️⃣ 지금처럼 제가 필요하실땐 `" + config.triggerName + "` 이라고 불러주세요." +
            "\n2️⃣ 현재 지원하는 명령어는 다음과 같아요 : `도움말`, `테스트 링크`" +
            "\n        저를 불러주시면서 이 명령어들을 같이 적어주시면 되어요!" +
            "\n        💬 예시 : `" + config.triggerName + "아 테스트 링크 알려줘`, " +
                                "`" + config.triggerName + " 도움말`, " +
                                "`" + config.triggerName + "~ 도움말이나 좀 가져와봐` 등..." +
            "\n3️⃣ 개인적으로 답변을 듣고싶으다면 저에게 직접 다이렉트 메세지(DM)을 보내주셔도 됩니다!" +
            "\n4️⃣ 기타 자세한 사용법은 이 링크에서 확인해주세요 : " + config.helpPageUrl;
        rtm.sendMessage(answers, event.channel);
    } else if (text.includes("테스트 링크")) {
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