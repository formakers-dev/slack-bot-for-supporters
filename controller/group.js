const moment = require('moment');
const BetaTestService = require('../services/beta-tests');

const getCompletedList = (req, res) => {
  const group = req.params.group;
  let users;
  let startDate;
  let endDate;

  // 나중엔 json파일로 빼서 관리하기 (그리고 이 인원이 전체가 아님ㅋ 슬랙방 다 들어오면 업데이트하기)
  if (group === 'supporters-2nd') {
      users = require('../data/supporters-2nd').sort((a, b) => (a.nickName > b.nickName) ? 1 : -1);
      console.log(users.length);

      startDate = new Date('2019-12-16');
      endDate = new Date('2020-02-23');
  } else {
      res.send(404);
  }

  BetaTestService.getCompletedList(startDate, endDate)
      .then(betaTests => {
          const currentTime = moment.tz('Asia/Seoul').format("YYYY년 MM월 DD일 HH시 mm분 ss초");
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
              ' - ⏰ ' + currentTime +
              '<br/>' +
              '<br/><strong>* [서포터즈 수료 여부 관련 주의 사항]</strong>' +
              '<br/> 1. 불성실 응답 여부는 반영이 되지 않은 현황표입니다.' +
              '<br/> 2. 참여여부에 O로 표시되어 있으나 보상을 받지 못하셨다면, 불성실 응답자일 가능성이 있습니다. (불성실 응답 : 응답길이 30자 이하)' +
              '<br/> 3. 서포터즈 활동 종료 후 불성실 응답 여부가 반영된 최종본 표를 파일로 공유드릴 예정입니다.' +
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