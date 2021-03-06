const mongoose = require('mongoose');
const BetaTests = require('../models/beta-tests');

const getValidBetaTestSurveyLinks = () => {
    const currentTime = new Date();

    return BetaTests.aggregate([
        {
            $match: {
                openDate: { $lte: currentTime },
                closeDate: { $gte: currentTime },
                status: { $ne: "test" },
            }
        }, { $unwind: "$missions"}, { $unwind: "$missions.items" },
        {
            $match: {
                $and : [
                    { "missions.items.type" : { $ne : "play" } },
                    { "missions.items.type" : { $ne : "hidden" } }
                ]
            }
        },
        {
            $project: {
                title : "$title",
                missionItemTitle : "$missions.items.title",
                missionItemAction : "$missions.items.action"
            }
        }, {
            $group: {
                _id : "$title",
                title: { $first: "$title" },
                missionItems: {
                    $push : {
                        title: "$missionItemTitle",
                        action: "$missionItemAction"
                    }
                }
            }
        }
    ]);
};

const getValidBetaTests = () => {
    const currentTime = new Date();

    return BetaTests.find({
            openDate: {$lte: currentTime},
            closeDate: {$gte: currentTime},
            status: {$ne: "test"},
        },
        {
            _id: true,
            title: true,
            closeDate: true
        })
};

const getCompletedList = (startDate, endDate) => {
    return BetaTests.aggregate([
        { $match: {$and: [
                    { closeDate: { $gte: startDate } },
                    { openDate: { $lte: endDate } },
                    { title: {$regex: '게임 테스트'} },
                    { status: { $ne: "test" } },
                ] }
        },
        { $unwind: "$missions" },
        { $unwind: "$missions.items"},
        {
            $group: {
                _id: "$_id",
                title: {$first: "$title"},
                closeDate: {$first: "$closeDate"},
                completedUserIds: {$push: "$missions.items.completedUserIds"}
            }
        },
        { $sort: { closeDate: 1, _id: 1 } }
    ])
};

module.exports = {
    getValidBetaTestSurveyLinks,
    getCompletedList,
    getValidBetaTests,
};