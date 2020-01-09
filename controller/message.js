const BetaTestService = require('../services/beta-tests');

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
    getHellos,
    getSurveyLinks
};
