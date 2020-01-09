const config = require('../config');
const BetaTestService = require('../services/beta-tests');

const answer_thanks =  ["별말씀을요 :-D", "헤헤 더 열시미 히겠다멍!", "뿌듯하다멍! 🐶", "헤헤 감사해여", "ㅎㅎ 감사하다멍! 🐶"];
const answer_happy = [ "히히히 조으다멍!", "헤헤헤 😆", "신난다멍!!! :fast-parrot:"];

// Return Type : String Array
const getSimpleAnswer = (inputMessage) => {
    if (inputMessage.match(/안[녕뇽늉]/g)) {
        return [
            "안녕하새오! 포메스 애오! 왈왈! 🐶\n아직 조금 모자르지만 차캐오! 앞으로 더 잘할개오! 왈왈!",
            "네! 안녕하세요! 🐶", "🐶 안녕하새오!", "🐶 멍멍! 반갑다멍!", ":wave: 안녕!", "안뇽! :wave:"
        ];
    } else if (inputMessage.match(/고마워[요]?/) || inputMessage.match(/고맙[다|습니다|슴다]?/) || inputMessage.match(/[감사|ㄱㅅ]/)) {
        return [ "내가 더 고맙다멍! 🐶" ].concat(answer_thanks);
    } else if (inputMessage.match(/미안[해]?[요]?/) || inputMessage.match(/쏘리/)) {
        return [ "괜찮다멍! 🐶", "내가 더 미인하다멍! 🐶" ];
    } else if (inputMessage.match(/[귀|기]여[워|웡|우|어][요]?/) || inputMessage.match(/[귀|기][욥|엽|요미]/)) {
        return answer_thanks.concat(answer_happy);
    } else {
        return [
            "제가 잘 모르는 내용이에요 😭",
            "뭐라구요?", "못 알아들었어요ㅠㅠ",
            "잘 모르겠어요ㅠㅠ\n제 사용법이 궁금하시면 `" + config.triggerName + " 도움말` 이라고 말씀해보세요!"
        ];
    }
};

const getGreeting = (name) => {
    return name + "님, 반갑습니다! 😍️" +
        "\n포메스 슬랙에 들어오신 것을 환영해요!🎉" +
        "\n저는 약간 모자르지만 착한 " + config.triggerName +"이에요ㅎㅎ 포메스 슬랙을 잘 사용하실 수 있게 도와드리고 있답니다! 🤘🏻" +
        "\n" +
        "\n앞으로 혹시 제가 필요하시게 되면 `" + config.triggerName + "` 이라고 불러주세요!" +
        "\n자세한 사용법은 `" + config.triggerName + " 도움말` 이라고 적어주시면 확인해보실 수 있어요!" +
        "\n" +
        "\n그럼, 포메스 슬랙에서 즐거운 시간 보내시길 바래요! 🙌🏻"
};

const getSurveyLinks = () => {
    return BetaTestService.getValidBetaTestSurveyLinks()
        .then(betaTests => {
            const message = "넵! 현재 진행중인 테스트의 설문 링크를 보내드릴게요! 🤘🏻" +
                "\n이제 PC에서 편하게 피드백 작성하즈아!" +
                "\n\n" +
                "\n🚨 아래 주의사항만 잘 지켜주시면 감사드리겠슴다!" +
                "\n1️⃣ 테스트 설문 링크는 여러분들께만 특별히 제공되는 것이니 *꼭 본인만 사용하시길 바래요!*" +
                "\n2️⃣ 설문의 맨 마지막 문항의 이메일을 꼭 *포메스 가입 이메일* 로 적어주셔야 활동 기록에 카운팅이 됩니다!" +
                "\n\n" +
                "👇🏻 링크는 댓글을 확인해주세요 👇🏻";
            const comments = getMissions(betaTests);

            return Promise.resolve({
                message: message,
                comments: comments,
            });
        });
};

const getMissions = (betaTests) => {
    return betaTests.map(betaTest => {
        const chat = "*🕹 테스트 제목 : " + betaTest.title + "*";
        const missionsChat = betaTest.missionItems.map(missionItem => {
            return "👉🏻 미션 : <" + missionItem.action.replace("{email}", "포메스_가입_이메일을_적어주세요") + "|" + missionItem.title + ">";
        }).join("\n\n");
        return chat + "\n" + missionsChat;
    })
};

module.exports = {
    getSimpleAnswer,
    getGreeting,
    getSurveyLinks
};
