const fs = require('fs');
const path = require('path');
const { GetVersionInfo } = require('../structs/functions');

const contentPagesPath = path.join(__dirname, '..', '..', 'responses', 'contentpages.json');

function loadContentPages() {
    try {
        return JSON.parse(fs.readFileSync(contentPagesPath, 'utf8'));
    } catch (err) {
        return {};
    }
}

function localizeMessages(contentpages, language) {
    const modes = ["saveTheWorldUnowned", "battleRoyale", "creative", "saveTheWorld"];
    try {
        modes.forEach(mode => {
            if (contentpages.subgameselectdata && contentpages.subgameselectdata[mode] && contentpages.subgameselectdata[mode].message) {
                const msg = contentpages.subgameselectdata[mode].message;
                if (msg.title && typeof msg.title === 'object') msg.title = msg.title[language] || msg.title.en;
                if (msg.body && typeof msg.body === 'object') msg.body = msg.body[language] || msg.body.en;
            }
        });
    } catch {}

    const newsModes = ["battleroyalenews", "savetheworldnews"];
    try {
        newsModes.forEach(mode => {
            if (contentpages[mode] && contentpages[mode].news && Array.isArray(contentpages[mode].news.messages)) {
                contentpages[mode].news.messages.forEach(msg => {
                    if (msg.title && typeof msg.title === 'object') msg.title = msg.title[language] || msg.title.en;
                    if (msg.body && typeof msg.body === 'object') msg.body = msg.body[language] || msg.body.en;
                });
            }
        });
    } catch {}
}

function setStage(contentpages, stage) {
    const bgs = contentpages?.dynamicbackgrounds?.backgrounds?.backgrounds;
    if (!Array.isArray(bgs)) return;
    bgs[0] = bgs[0] || {};
    bgs[1] = bgs[1] || {};
    bgs[0].stage = stage;
    bgs[1].stage = stage;
}

function setBackgroundImage(contentpages, url, slot = 0) {
    const bgs = contentpages?.dynamicbackgrounds?.backgrounds?.backgrounds;
    if (!Array.isArray(bgs)) return;
    bgs[slot] = bgs[slot] || {};
    bgs[slot].backgroundimage = url;
}

function getContentPages(req) {
    const memory = GetVersionInfo(req);
    const contentpages = loadContentPages();

    let language = "en";
    try {
        if (req.headers["accept-language"]) {
            if (req.headers["accept-language"].includes("-") && req.headers["accept-language"] !== "es-419") {
                language = req.headers["accept-language"].split("-")[0];
            } else {
                language = req.headers["accept-language"];
            }
        }
    } catch {}

    localizeMessages(contentpages, language);

    // Default: season-based background
    setStage(contentpages, `season${memory.season}`);

    // --- Per-build overrides ---

    if (memory.season == 10) {
        setStage(contentpages, "defaultnotris");
        if (contentpages?.dynamicbackgrounds?.backgrounds?.backgrounds?.[1]) {
            contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "blackmonday";
        }
    }

    if (memory.season == 11) {
        if (memory.build == 11.10) setStage(contentpages, "fortnitemares");
        else if (memory.build == 11.30) setStage(contentpages, "Galileo");
        else if (memory.build == 11.31 || memory.build == 11.40) setStage(contentpages, "Winter19");
        else if (memory.build == 11.50) setStage(contentpages, "LoveAndWar");
        else setStage(contentpages, "season11");
    }

    if (memory.season == 14) {
        if (memory.build == 14.00 || memory.build == 14.10 || memory.build == 14.20 || memory.build == 14.30) {
            setStage(contentpages, "defaultnotris");
        }
        if (memory.build == 14.40 || memory.build == 14.60) {
            setStage(contentpages, "halloween2020");
        }
    }

    // Chapter 3 Season 1
    if (memory.build == 19.01) {
        setStage(contentpages, "defaultnotris");
        setBackgroundImage(contentpages, "https://cdn.discordapp.com/attachments/927739901540188200/930880158167085116/t-bp19-lobby-xmas-2048x1024-f85d2684b4af.png", 0);
        if (contentpages.subgameinfo?.battleroyale) {
            contentpages.subgameinfo.battleroyale.image = "https://cdn.discordapp.com/attachments/927739901540188200/930880421514846268/19br-wf-subgame-select-512x1024-16d8bb0f218f.jpg";
        }
        if (contentpages.specialoffervideo) contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
    }

    // Chapter 3 Season 2
    if (memory.season == 20) {
        if (memory.build == 20.40) {
            setStage(contentpages, "defaultnotris");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-bp20-40-armadillo-glowup-lobby-2048x2048-2048x2048-3b83b887cc7f.jpg", 0);
        } else {
            setStage(contentpages, "defaultnotris");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-bp20-lobby-2048x1024-d89eb522746c.png", 0);
        }
    }

    // Chapter 3 Season 3
    if (memory.season == 21) {
        setStage(contentpages, "defaultnotris");
        if (memory.build == 21.00) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/s21-lobby-background-2048x1024-2e7112b25dc3.jpg", 0);
        }
        if (memory.build == 21.10) {
            setStage(contentpages, "season2110");
        }
        if (memory.build == 21.30) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/nss-lobbybackground-2048x1024-f74a14565061.jpg", 0);
            setStage(contentpages, "season2130");
        }
    }

    // Chapter 3 Season 4
    if (memory.season == 22) {
        setStage(contentpages, "defaultnotris");
        setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-bp22-lobby-square-2048x2048-2048x2048-e4e90c6e8018.jpg", 0);
    }

    // Chapter 4 Season 1
    if (memory.season == 23) {
        setStage(contentpages, "defaultnotris");
        if (memory.build == 23.10) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-bp23-winterfest-lobby-square-2048x2048-2048x2048-277a476e5ca6.png", 0);
            if (contentpages.specialoffervideo) contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
        } else {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-bp23-lobby-2048x1024-2048x1024-26f2c1b27f63.png", 0);
        }
    }

    // Chapter 4 Season 2
    if (memory.season == 24) {
        if (memory.build == 24.00 || memory.build == 24.01) {
            setStage(contentpages, "defaultnotris");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-ch4s2-bp-lobby-4096x2048-edde08d15f7e.jpg", 0);
            if (contentpages.specialoffervideo) contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
        }
        if (memory.build == 24.20) {
            setStage(contentpages, "defaultnotris");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-ch4s2-bp-lobby-4096x2048-edde08d15f7e.jpg", 0);
            if (contentpages.specialoffervideo) contentpages.specialoffervideo.bSpecialOfferEnabled = "true";
        }
        if (memory.build == 24.30 || memory.build == 24.40) {
            if (contentpages?.dynamicbackgrounds?.backgrounds?.backgrounds?.[1]) {
                contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].stage = "defaultnotris";
                contentpages.dynamicbackgrounds.backgrounds.backgrounds[1].backgroundimage = "https://cdn2.unrealengine.com/ch4s2-lobbyupdate-4-20-2022-lifted-copy-3840x2160-d3a138f5f9e7.jpg";
            }
        }
    }

    // Chapter 4 Season 3
    if (memory.season == 25) {
        setStage(contentpages, "defaultnotris");
        if (memory.build == 25.00) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/s25-lobby-4k-4096x2048-4a832928e11f.jpg", 0);
        }
        if (memory.build == 25.10) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/fn-shop-ch4s3-04-1920x1080-785ce1d90213.png", 0);
        }
        if (memory.build == 25.11 || memory.build == 25.20 || memory.build == 25.30) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/t-s25-14dos-lobby-4096x2048-2be24969eee3.jpg", 0);
        }
    }

    // Chapter 4 Season 4 (OG)
    if (memory.season == 26) {
        setStage(contentpages, "defaultnotris");
        if (memory.build == 26.30 && memory.CL == "28509302") {
            setStage(contentpages, "season2630");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/s26-lobby-timemachine-final-2560x1440-a3ce0018e3fa.jpg", 0);
        }
        if (memory.build == 26.30 && memory.CL == "28688692") {
            setStage(contentpages, "season2630");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/s26-lobby-timemachine-final-2560x1440-a3ce0018e3fa.jpg", 0);
        }
        if (memory.build == 26.00 || memory.build == 26.10 || memory.build == 26.20) {
            setStage(contentpages, "season26");
        }
    }

    // Chapter 4 Season OG / Ch4 S5
    if (memory.season == 27) {
        setStage(contentpages, "rufus");
    }

    // Chapter 5 Season 1
    if (memory.season == 28) {
        if (memory.build == 28.00 && memory.CL == "29915848") {
            setStage(contentpages, "season2800");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/ch5s1-lobbybg-3640x2048-0974e0c3333c.jpg", 0);
        }
        if (memory.build == 28.01) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/winterfest2023-lobby-2048x1024-a8853c3a6f59.jpg", 0);
        }
        if (memory.build == 28.20) {
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/s28-tmnt-lobby-4096x2048-e6c06a310c05.jpg", 0);
        }
        if (memory.build == 28.30 && memory.CL == "31511038") {
            setStage(contentpages, "season2800");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/ch5s1-lobbybg-3640x2048-0974e0c3333c.jpg", 0);
        }
    }

    // Chapter 5 Season 2
    if (memory.season == 29) {
        if (memory.build == 29.00 && memory.CL == "32116959") {
            setStage(contentpages, "defaultnotris");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/br-lobby-ch5s2-4096x2304-a0879ccdaafc.jpg", 0);
        }
        if (memory.build == 29.40) {
            setStage(contentpages, "defaultnotris");
            setBackgroundImage(contentpages, "https://cdn2.unrealengine.com/mkart-2940-sw-fnbr-lobby-3840x2160-4f1f1486a54a.jpg", 0);
        }
    }

    return contentpages;
}

module.exports = {
    getContentPages
};
