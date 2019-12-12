const {RTMClient} = require('@slack/rtm-api');
const {WebClient} = require('@slack/web-api');
const config = require('../config');
const BetaTestService = require('../services/beta-tests');

const botApiToken = config.slackApiToken;
const rtm = new RTMClient(botApiToken);
const web = new WebClient(botApiToken);

rtm.on('authenticated', rtmStartData => {
    console.log('Logged in as ' + rtmStartData.self.name + ' of them '
        + rtmStartData.team.name + ', but not yet connected to a channel');
});

rtm.on('team_join', event => {
    const user = event.user;
    const greeting_message = user.profile.display_name + "님, 반갑습니다! 😍️" +
        "\n포메스 슬랙에 들어오신 것을 환영해요!🎉" +
        "\n저는 약간 모자르지만 착한 " + config.triggerName +"이에요ㅎㅎ 포메스 슬랙을 잘 사용하실 수 있게 도와드리고 있답니다! 🤘🏻" +
        "\n" +
        "\n앞으로 혹시 제가 필요하시게 되면 `" + config.triggerName + "` 이라고 불러주세요!" +
        "\n자세한 사용법은 `" + config.triggerName + " 도움말` 이라고 적어주시면 확인해보실 수 있어요!" +
        "\n" +
        "\n그럼, 포메스 슬랙에서 즐거운 시간 보내시길 바래요! 🙌🏻";

    console.log(`${user.id}(${user.profile.display_name}) joined team`);

    web.im.open({user: user.id})
        .then(result => {
            rtm.sendMessage(greeting_message, result.channel.id);
        })
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
    const groups = text.split(" ")[0].match(new RegExp(config.triggerName + "야?[^\w\d\s|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*", "gi"));
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
            "\n4️⃣ 기타 자세한 사용법은 이 링크에서 확인해주세요 : " + config.helpPageUrl ];
        rtm.sendMessage(answers[Math.floor(Math.random() * answers.length)], event.channel);
    } else if (text.includes("테스트 링크")) {
        BetaTestService.getValidBetaTestSurveyLinks()
            .then(async (betaTests) => {
                const message = "넵! 현재 진행중인 테스트의 설문 링크를 보내드릴게요! 🤘🏻" +
                    "\n이제 PC에서 편하게 피드백 작성하즈아!" +
                    "\n\n" +
                    "\n🚨 아래 주의사항만 잘 지켜주시면 감사드리겠슴다!" +
                    "\n1️⃣ 테스트 설문 링크는 여러분들께만 특별히 제공되는 것이니 *꼭 본인만 사용하시길 바래요!*" +
                    "\n2️⃣ 설문의 맨 마지막 문항의 이메일을 꼭 *포메스 가입 이메일* 로 적어주셔야 활동 기록에 카운팅이 됩니다!" +
                    "\n\n" +
                    "👇🏻 링크는 댓글을 확인해주세요 👇🏻";

                const reply = await rtm.sendMessage(message, event.channel);

                betaTests.map(betaTest => {
                    const chat = "*🕹 테스트 제목 : " + betaTest.title + "*";
                    const missionsChat = betaTest.missionItems.map(missionItem => {
                        return "👉🏻 미션 제목 : " + missionItem.title + "\n" + missionItem.action.replace("{email}", "포메스_가입_이메일을_적어주세요");
                    }).join("\n\n");
                    return chat + "\n" + missionsChat;
                }).forEach(missionLinksMessage => {
                    web.chat.postMessage({
                        text: missionLinksMessage,
                        channel: event.channel,
                        thread_ts: reply.ts,
                        as_user: true
                    });
                });
                console.log(reply);
            }).catch(async (err) => {
                console.error(err);
                const reply = await rtm.sendMessage(
                    "으헉😭 뭔가 오류가 발생한 것 같아요!" +
                    "\n담당자들한테 얼른 고쳐달라고 할게요! 조금만 기다려주세요🙏", event.channel);
                console.log(reply)
        });
    } else {
        const answers = [
            "제가 잘 모르는 내용이에요 😭",
            "뭐라구요?", "못 알아들었어요ㅠㅠ",
            "잘 모르겠어요ㅠㅠ\n제 사용법이 궁금하시면 `" + config.triggerName + " 도움말` 이라고 말씀해보세요!"
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