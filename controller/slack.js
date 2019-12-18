const {WebClient} = require('@slack/web-api');
const config = require('../config');

const botApiToken = config.slackApiToken;
const web = new WebClient(botApiToken);

const getMembersInChannel = async (req, res) => {
    let channelList = await web.conversations.list();
    let channelInfos = channelList.channels.filter(channel => channel.name === req.params.channel);

    if (channelInfos.length !== 1) {
        channelList = await web.conversations.list({ types: "private_channel"});
        channelInfos = channelList.channels.filter(channel => channel.name === req.params.channel);

        if (channelInfos.length !== 1) {
            res.sendStatus(412);
            return;
        }
    }

    const getMemberInfo = (userInfo) => {
        return {
            email: userInfo.user.profile.email,
            full_name: userInfo.user.profile.real_name,
            display_name: userInfo.user.profile.display_name,
            is_app_user: userInfo.user.is_app_user,
            is_bot: userInfo.user.is_bot,
            is_admin: userInfo.user.is_admin,
            is_owner: userInfo.user.is_admin,
            is_primary_owner: userInfo.user.is_primary_owner,
        }
    };

    const allMembers = [];
    const channelInfo = channelInfos[0];
    const memberIds = await web.conversations.members({ channel: channelInfo.id });

    // await를 쓰기 위해 어쩔 수 없이 이터레이터 돌림ㅠㅠ 더 좋은 방안 있음 좋겠당...
    for(let i = 0; i < memberIds.members.length; i++) {
        const userInfo = await web.users.info({ user: memberIds.members[i] });
        const memberInfo = await getMemberInfo(userInfo);
        allMembers.push(memberInfo);
    }

    const members = allMembers
        .filter(user => !user.is_app_user && !user.is_bot && !user.is_admin && !user.is_owner && !user.is_primary_owner)
        .map(user => user.email + "," + user.full_name + "," + user.display_name);

    // 한글 잘 보이게 하기 위해
    const BOM = "\uFEFF";
    members.unshift(BOM + "email,full_name,display_name");

    res.setHeader('Content-disposition', 'attachment;filename="' + req.params.channel + '-members.csv"');
    res.setHeader('Content-type', "text/csv;charset=utf-8");
    res.send(members.join("\r\n"));
};


module.exports = { getMembersInChannel };