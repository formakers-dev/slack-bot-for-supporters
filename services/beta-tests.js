const mongoose = require('mongoose');
const BetaTests = require('../models/beta-tests');

const getValidBetaTestSurveyLinks = () => {
    const currentTime = new Date();

    return BetaTests.aggregate([
        {
            $match: {
                openDate: {$lte: currentTime},
                closeDate: {$gte: currentTime},
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

module.exports = {
    getValidBetaTestSurveyLinks,
};