const BetaTestService = require('../services/beta-tests');

const getCompletedList = (req, res) => {
  const group = req.params.group;
  const users = [];
  let startDate;
  let endDate;

  // 나중엔 json파일로 빼서 관리하기 (그리고 이 인원이 전체가 아님ㅋ 슬랙방 다 들어오면 업데이트하기)
  if (group === 'supporters-2nd') {
      users.push(
          {
              "userId" : "google113972044941536463710",
              "nickName" : "FDL1760"
          },
          {
              "userId" : "google115372771128838800553",
              "nickName" : "KSS"
          },
          {
              "userId" : "google109312392918755075894",
              "nickName" : "Lostcity"
          },
          {
              "userId" : "google110363809024144370804",
              "nickName" : "ProXimA"
          },
          {
              "userId" : "google107916484537090135950",
              "nickName" : "Rojen241"
          },
          {
              "userId" : "google113266224372855626353",
              "nickName" : "Rollingbor"
          },
          {
              "userId" : "google102728503543591845010",
              "nickName" : "Slayer"
          },
          {
              "userId" : "google101372349511252725876",
              "nickName" : "Soll"
          },
          {
              "userId" : "google113662515740137785511",
              "nickName" : "Statice"
          },
          {
              "userId" : "google100919178034169235774",
              "nickName" : "Veneno"
          },
          {
              "userId" : "google112552203644143236702",
              "nickName" : "jsh"
          },
          {
              "userId" : "google118356901644056640867",
              "nickName" : "sleepin9"
          },
          {
              "userId" : "google111911669802850151532",
              "nickName" : "검정벽돌"
          },
          {
              "userId" : "google103676010125309398269",
              "nickName" : "고라니"
          },
          {
              "userId" : "google111271277115863591123",
              "nickName" : "김경준"
          },
          {
              "userId" : "google102375820846147873448",
              "nickName" : "김진돌"
          },
          {
              "userId" : "google106153616740227664942",
              "nickName" : "나냐냥냐냐"
          },
          {
              "userId" : "google105851479282303082720",
              "nickName" : "나로"
          },
          {
              "userId" : "google116845394759326255445",
              "nickName" : "달묘"
          },
          {
              "userId" : "google113863793634019411191",
              "nickName" : "달세하"
          },
          {
              "userId" : "google115183393287676694107",
              "nickName" : "담비"
          },
          {
              "userId" : "google109593172633688171033",
              "nickName" : "도와데"
          },
          {
              "userId" : "google106739651605815531329",
              "nickName" : "돈다"
          },
          {
              "userId" : "google102831507865784792838",
              "nickName" : "두데16"
          },
          {
              "userId" : "google112161244753079293285",
              "nickName" : "루나린"
          },
          {
              "userId" : "google116438112107757656320",
              "nickName" : "메론빵"
          },
          {
              "userId" : "google117691356946222966554",
              "nickName" : "박지호"
          },
          {
              "userId" : "google103460330167445750389",
              "nickName" : "발디"
          },
          {
              "userId" : "google109957898030728641633",
              "nickName" : "부기웅앵웅"
          },
          {
              "userId" : "google112371319777311492934",
              "nickName" : "수연"
          },
          {
              "userId" : "google113079321501059564407",
              "nickName" : "슈니르"
          },
          {
              "userId" : "google107167944093636986329",
              "nickName" : "시디스"
          },
          {
              "userId" : "google114200606269809521074",
              "nickName" : "시랭"
          },
          {
              "userId" : "google108356254099451893893",
              "nickName" : "아오디"
          },
          {
              "userId" : "google108086223475671539488",
              "nickName" : "양팔두"
          },
          {
              "userId" : "google114375257728327544584",
              "nickName" : "어린계란"
          },
          {
              "userId" : "google102914588620005334713",
              "nickName" : "엔들"
          },
          {
              "userId" : "google105177506283418440020",
              "nickName" : "요메메"
          },
          {
              "userId" : "google113074227900116741896",
              "nickName" : "운수대똥"
          },
          {
              "userId" : "google106425611250404287822",
              "nickName" : "웅덩이"
          },
          {
              "userId" : "google101799704684037999313",
              "nickName" : "윱니"
          },
          {
              "userId" : "google116876382374483286246",
              "nickName" : "이원혁"
          },
          {
              "userId" : "google111553763048464460651",
              "nickName" : "이재우"
          },
          {
              "userId" : "google102481825858162764943",
              "nickName" : "이즈"
          },
          {
              "userId" : "google101439126013854277039",
              "nickName" : "이한승"
          },
          {
              "userId" : "google102977617343825443587",
              "nickName" : "임태민"
          },
          {
              "userId" : "google117904189523056476099",
              "nickName" : "잉쨔"
          },
          {
              "userId" : "google109365206400001237493",
              "nickName" : "초코파이"
          },
          {
              "userId" : "google111572720713625906263",
              "nickName" : "최윤석"
          },
          {
              "userId" : "google109373787762952126528",
              "nickName" : "탐코"
          },
          {
              "userId" : "google107717988683595946615",
              "nickName" : "하마"
          },
          {
              "userId" : "google102877702454750970609",
              "nickName" : "핸니"
          }
      );

      startDate = new Date('2019-12-16');
      endDate = new Date('2020-02-23');
  } else {
      res.send(404);
  }

  BetaTestService.getCompletedList(startDate, endDate)
      .then(betaTests => {
          const currentTime = new Date();
          betaTests = betaTests.map(betaTest => {
              betaTest.completedUserIds = betaTest.completedUserIds.reduce((result, userIds) => {
                  return result.filter(ele => userIds.includes(ele));
              });
              // betaTest.completedUserIds = betaTest.completedUserIds.map(userIds => {
              //     return userIds.filter(userId => users.map(user => user.userId).includes(userId));
              // });
              return betaTest;
          });
          // res.send(betaTests);


          // 연습삼아ㅋㅋ 그냥 리액트를 붙일까...
          const titles = betaTests.map(betaTest => '<th>' + betaTest.title.replace(' 게임 테스트', '') + '</th>');
          const userCompletedList = users.map(user => {
              const result = '<tr>' + '<th>' + user.nickName + '</th>';
              return result + betaTests.map(betaTest => {
                  const isCompleted = betaTest.completedUserIds.includes(user.userId);
                  return '<td class="content' + (isCompleted ? '"' : ' x"') + '>' + (isCompleted ? 'O' : 'X') + '</td>';
              }).join('') + '</tr>'
          });
          const response = '<style>' +
              'table { border-collapse: collapse; text-align: left; line-height: 1.5; margin : 20px 10px; }' +
              'th { padding: 5px; font-weight: bold; vertical-align: top; border: 1px solid #808080; }' +
              'td { padding: 5px; vertical-align: top; border: 1px solid #808080; }' +
              'td.content { text-align: center }' +
              'td.x { background-color: #ffdede }' +
              '</style>' +
              '<body>' +
              '<strong>📝 포메스 서포터즈 2기 테스트 참여 현황</strong>' +
              ' - ⏰ ' + currentTime.getFullYear() + '년 ' + currentTime.getMonth() + '월 ' + currentTime.getDate() + '일 '
              + currentTime.getHours() + '시 ' + currentTime.getMinutes() + '분 ' + currentTime.getSeconds() + '초 기준' +
              '<table>' +
              '<thead>' +
              '<tr>' +
              '<th></th>' +
              titles.join('') +
              '</tr>' +
              '</thead>' +
              '<tbody>' +
              userCompletedList.join('') +
              '</tbody>' +
              '</table>' +
              '</body>';

          res.send(response);
      }).catch(err => res.send(err));
};

module.exports = {
    getCompletedList,
};