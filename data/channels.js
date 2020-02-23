const channels = {
    development: [
        {
            id: "CRJDTED5Z",
            name: "general",
            type: "public",
        },
        {
            id: "C919H4HEY",
            name: "dev",
            type: "private",
            active: {
                startDate: new Date("2019-12-15T15:00:00Z"),
                endDate: new Date("2029-12-15T15:00:00Z"),
            }
        }
    ],
    production: [
        {
            id: "CRH1WHLNS",
            name: "general",
            type: "public",
        },
        {
            id: "CRF1LKG9K",
            name: "game_issues",
            type: "public",
        },
        {
            id: "CRJH41YLD",
            name: "fomes-issues",
            type: "public",
        },
        {
            id: "CR6SXHLNM",
            name: "supporters_2nd",
            type: "private",
            active: {
                startDate: new Date("2019-12-15T15:00:00Z"),
                endDate: new Date("2020-02-23T14:59:99Z"),
            }
        }
    ],
};

module.exports = channels[process.env.NODE_ENV];