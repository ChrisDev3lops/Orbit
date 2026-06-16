const fs = require('fs');
const path = require('path');
const { GetVersionInfo } = require('../structs/functions');

function getContentPages(req) {
    const memory = GetVersionInfo(req);
    
    let Language = "en";

    try {
        if (req.headers["accept-language"]) {
            if (req.headers["accept-language"].includes("-") && req.headers["accept-language"] != "es-419") {
                Language = req.headers["accept-language"].split("-")[0];
            } else {
                Language = req.headers["accept-language"];
            }
        }
    } catch {}

    const contentpages = {
        subgameselectdata: {
            battleRoyale: {
                message: {
                    title: { en: "Battle Royale" },
                    body: { en: "Drop in and squad up with friends" }
                }
            },
            creative: {
                message: {
                    title: { en: "Creative" },
                    body: { en: "Build your own island" }
                }
            },
            saveTheWorld: {
                message: {
                    title: { en: "Save the World" },
                    body: { en: "Defend the world" }
                }
            }
        },
        dynamicbackgrounds: {
            backgrounds: {
                backgrounds: [
                    { stage: `season${memory.season}` },
                    { stage: `season${memory.season}` }
                ]
            }
        },
        battleroyalenews: {
            news: {
                messages: []
            }
        },
        savetheworldnews: {
            news: {
                messages: []
            }
        }
    };

    const modes = ["saveTheWorldUnowned", "battleRoyale", "creative", "saveTheWorld"];

    try {
        modes.forEach(mode => {
            if (contentpages.subgameselectdata[mode]) {
                contentpages.subgameselectdata[mode].message.title = contentpages.subgameselectdata[mode].message.title[Language] || contentpages.subgameselectdata[mode].message.title.en;
                contentpages.subgameselectdata[mode].message.body = contentpages.subgameselectdata[mode].message.body[Language] || contentpages.subgameselectdata[mode].message.body.en;
            }
        });
    } catch {}

    if (memory.season == 10) {
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "defaultnotris";
        contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "blackmonday";
    }

    if (memory.season == 11) {
        if (memory.build == 11.10) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "fortnitemares";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "fortnitemares";
        } else if (memory.build == 11.30) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "Galileo";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "Galileo";
        } else if (memory.build == 11.31 || memory.build == 11.40) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "Winter19";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "Winter19";
        } else if (memory.build == 11.50) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "LoveAndWar";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "LoveAndWar";
        } else {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "season11";
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "season11";
        }
    }

    if (memory.season == 14) {
        if (memory.build == 14.00 || memory.build == 14.10 || memory.build == 14.20 || memory.build == 14.30) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[0].stage = "defaultnotris";
        }
    }

    return contentpages;
}

module.exports = {
    getContentPages
};
