const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const profilesDir = path.join(__dirname, '../../profiles');

function getProfile(profileId) {
    const profilePath = path.join(profilesDir, profileId + '.json');

    let profile;
    if (fs.existsSync(profilePath)) {
        profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    } else {
        profile = {};
    }

    if (!profile.rvn) profile.rvn = 0;
    if (!profile.items) profile.items = {};
    if (!profile.stats) profile.stats = {};
    if (!profile.stats.attributes) profile.stats.attributes = {};
    if (!profile.commandRevision) profile.commandRevision = 0;

    return profile;
}

function saveProfile(profileId, profile) {
    const profilePath = path.join(profilesDir, profileId + '.json');
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
}

// Builds the standard MCP response. When the client's known revision differs
// from ours, send a full profile so it resyncs; otherwise send the deltas.
function sendMcp(res, profileId, profile, baseRevision, queryRevision, applyProfileChanges) {
    if (queryRevision != baseRevision) {
        applyProfileChanges = [{
            changeType: "fullProfileUpdate",
            profile: profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: profileId,
        profileChangesBaseRevision: baseRevision,
        profileChanges: applyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
}
router.post('/fortnite/api/game/v2/profile/:accountId/client/SetItemFavoriteStatusBatch', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;
    let applyProfileChanges = [];
    let statChanged = false;

    if (Array.isArray(req.body.itemIds)) {
        for (let i = 0; i < req.body.itemIds.length; i++) {
            const itemId = req.body.itemIds[i];
            if (!itemId || !profile.items[itemId]) continue;

            profile.items[itemId].attributes.favorite = (req.body.itemFavStatus && req.body.itemFavStatus[i]) || false;

            applyProfileChanges.push({
                changeType: "itemAttrChanged",
                itemId: itemId,
                attributeName: "favorite",
                attributeValue: profile.items[itemId].attributes.favorite
            });
        }
        statChanged = true;
    }

    if (statChanged) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        saveProfile(profileId, profile);
    }

    sendMcp(res, profileId, profile, baseRevision, queryRevision, applyProfileChanges);
});
router.post('/fortnite/api/game/v2/profile/:accountId/client/SetItemFavoriteStatus', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;
    let applyProfileChanges = [];
    let statChanged = false;

    if (req.body.targetItemId && profile.items[req.body.targetItemId]) {
        profile.items[req.body.targetItemId].attributes.favorite = req.body.bFavorite || false;

        applyProfileChanges.push({
            changeType: "itemAttrChanged",
            itemId: req.body.targetItemId,
            attributeName: "favorite",
            attributeValue: profile.items[req.body.targetItemId].attributes.favorite
        });
        statChanged = true;
    }

    if (statChanged) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        saveProfile(profileId, profile);
    }

    sendMcp(res, profileId, profile, baseRevision, queryRevision, applyProfileChanges);
});

// Mark items as seen (clears the "new" badge).
router.post('/fortnite/api/game/v2/profile/:accountId/client/MarkItemSeen', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;
    let applyProfileChanges = [];
    let statChanged = false;

    if (Array.isArray(req.body.itemIds)) {
        for (let i = 0; i < req.body.itemIds.length; i++) {
            const itemId = req.body.itemIds[i];
            if (!itemId || !profile.items[itemId]) continue;

            profile.items[itemId].attributes.item_seen = true;

            applyProfileChanges.push({
                changeType: "itemAttrChanged",
                itemId: itemId,
                attributeName: "item_seen",
                attributeValue: true
            });
        }
        statChanged = true;
    }

    if (statChanged) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        saveProfile(profileId, profile);
    }

    sendMcp(res, profileId, profile, baseRevision, queryRevision, applyProfileChanges);
});

// Equip a cosmetic into a locker slot (Chapter 1 / early-version favorites system).
router.post('/fortnite/api/game/v2/profile/:accountId/client/EquipBattleRoyaleCustomization', (req, res) => {
    const profileId = "athena";
    const profile = getProfile(profileId);

    if (!Array.isArray(profile.stats.attributes.favorite_dance)) {
        profile.stats.attributes.favorite_dance = ["", "", "", "", "", ""];
    }
    if (!Array.isArray(profile.stats.attributes.favorite_itemwraps)) {
        profile.stats.attributes.favorite_itemwraps = ["", "", "", "", "", "", ""];
    }

    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;
    let applyProfileChanges = [];
    let statChanged = false;
    let variantChanged = false;
    const itemToSlot = req.body.itemToSlot;
    try {
        const variantStr = JSON.stringify(req.body.variantUpdates || []);
        if (variantStr.includes("active") && itemToSlot && profile.items[itemToSlot]) {
            const itemAttrs = profile.items[itemToSlot].attributes;
            if (!Array.isArray(itemAttrs.variants) || itemAttrs.variants.length === 0) {
                itemAttrs.variants = req.body.variantUpdates || [];
            }
            for (let i in itemAttrs.variants) {
                try {
                    if (itemAttrs.variants[i].channel.toLowerCase() === req.body.variantUpdates[i].channel.toLowerCase()) {
                        itemAttrs.variants[i].active = req.body.variantUpdates[i].active || "";
                    }
                } catch (err) {}
            }
            variantChanged = true;
        }
    } catch (err) {}

    if (req.body.slotName) {
        switch (req.body.slotName) {
            case "Character":
            case "Backpack":
            case "Pickaxe":
            case "Glider":
            case "SkyDiveContrail":
            case "MusicPack":
            case "LoadingScreen":
                profile.stats.attributes[`favorite_${req.body.slotName.toLowerCase()}`] = itemToSlot || "";
                statChanged = true;
                break;

            case "Dance": {
                const indexWithinSlot = req.body.indexWithinSlot || 0;
                if (Math.sign(indexWithinSlot) >= 0) {
                    profile.stats.attributes.favorite_dance[indexWithinSlot] = itemToSlot || "";
                }
                statChanged = true;
                break;
            }

            case "ItemWrap": {
                const indexWithinSlot = req.body.indexWithinSlot || 0;
                if (Math.sign(indexWithinSlot) === -1) {
                    for (let i = 0; i < 7; i++) {
                        profile.stats.attributes.favorite_itemwraps[i] = itemToSlot || "";
                    }
                } else {
                    profile.stats.attributes.favorite_itemwraps[indexWithinSlot] = itemToSlot || "";
                }
                statChanged = true;
                break;
            }
        }
    }

    if (statChanged) {
        let category = `favorite_${(req.body.slotName || "character").toLowerCase()}`;
        if (category === "favorite_itemwrap") category += "s";

        profile.rvn += 1;
        profile.commandRevision += 1;

        applyProfileChanges.push({
            changeType: "statModified",
            name: category,
            value: profile.stats.attributes[category]
        });

        if (variantChanged && itemToSlot && profile.items[itemToSlot]) {
            applyProfileChanges.push({
                changeType: "itemAttrChanged",
                itemId: itemToSlot,
                attributeName: "variants",
                attributeValue: profile.items[itemToSlot].attributes.variants
            });
        }

        saveProfile(profileId, profile);
    }

    sendMcp(res, "athena", profile, baseRevision, queryRevision, applyProfileChanges);
});

// Set the lobby banner icon/color (Chapter 1 system).
router.post('/fortnite/api/game/v2/profile/:accountId/client/SetBattleRoyaleBanner', (req, res) => {
    const profileId = "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;
    let applyProfileChanges = [];
    let statChanged = false;

    if (req.body.homebaseBannerIconId && req.body.homebaseBannerColorId) {
        profile.stats.attributes.banner_icon = req.body.homebaseBannerIconId;
        profile.stats.attributes.banner_color = req.body.homebaseBannerColorId;
        statChanged = true;
    }

    if (statChanged) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        applyProfileChanges.push({
            changeType: "statModified",
            name: "banner_icon",
            value: profile.stats.attributes.banner_icon
        });
        applyProfileChanges.push({
            changeType: "statModified",
            name: "banner_color",
            value: profile.stats.attributes.banner_color
        });

        saveProfile(profileId, profile);
    }

    sendMcp(res, "athena", profile, baseRevision, queryRevision, applyProfileChanges);
});

// Set the locker banner (Chapter 2 locker-item system).
router.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerBanner', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;
    let applyProfileChanges = [];
    let statChanged = false;

    const lockerItem = req.body.lockerItem;
    if (req.body.bannerIconTemplateName && req.body.bannerColorTemplateName && lockerItem && profile.items[lockerItem]) {
        profile.items[lockerItem].attributes.banner_icon_template = req.body.bannerIconTemplateName;
        profile.items[lockerItem].attributes.banner_color_template = req.body.bannerColorTemplateName;

        applyProfileChanges.push({
            changeType: "itemAttrChanged",
            itemId: lockerItem,
            attributeName: "banner_icon_template",
            attributeValue: profile.items[lockerItem].attributes.banner_icon_template
        });
        applyProfileChanges.push({
            changeType: "itemAttrChanged",
            itemId: lockerItem,
            attributeName: "banner_color_template",
            attributeValue: profile.items[lockerItem].attributes.banner_color_template
        });
        statChanged = true;
    }

    if (statChanged) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        saveProfile(profileId, profile);
    }

    sendMcp(res, profileId, profile, baseRevision, queryRevision, applyProfileChanges);
});

// Equip a cosmetic into a locker slot (Chapter 2 locker-item system).
router.post('/fortnite/api/game/v2/profile/:accountId/client/SetCosmeticLockerSlot', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;
    let applyProfileChanges = [];
    let statChanged = false;

    const lockerItem = req.body.lockerItem;
    const itemToSlot = req.body.itemToSlot;
    const lockerOk = lockerItem && profile.items[lockerItem] &&
        profile.items[lockerItem].attributes &&
        profile.items[lockerItem].attributes.locker_slots_data &&
        profile.items[lockerItem].attributes.locker_slots_data.slots;

    // Apply variant (style) changes to the equipped item.
    try {
        const variantStr = JSON.stringify(req.body.variantUpdates || []);
        if (variantStr.includes("active") && itemToSlot && profile.items[itemToSlot]) {
            const itemAttrs = profile.items[itemToSlot].attributes;
            if (!Array.isArray(itemAttrs.variants)) itemAttrs.variants = [];

            for (let v in req.body.variantUpdates) {
                let found = false;
                for (let existing in itemAttrs.variants) {
                    if (req.body.variantUpdates[v].channel === itemAttrs.variants[existing].channel) {
                        itemAttrs.variants[existing].active = req.body.variantUpdates[v].active;
                        found = true;
                        break;
                    }
                }
                if (!found) itemAttrs.variants.push(req.body.variantUpdates[v]);
            }

            applyProfileChanges.push({
                changeType: "itemAttrChanged",
                itemId: itemToSlot,
                attributeName: "variants",
                attributeValue: itemAttrs.variants
            });
            statChanged = true;
        }
    } catch (err) {}

    if (req.body.category && lockerOk) {
        const slots = profile.items[lockerItem].attributes.locker_slots_data.slots;
        switch (req.body.category) {
            case "Character":
            case "Backpack":
            case "Pickaxe":
            case "Glider":
            case "SkyDiveContrail":
            case "MusicPack":
            case "LoadingScreen":
                if (slots[req.body.category]) {
                    slots[req.body.category].items = [itemToSlot || ""];
                    statChanged = true;
                }
                break;

            case "Dance": {
                const idx = req.body.slotIndex || 0;
                if (slots.Dance && Math.sign(idx) >= 0) {
                    slots.Dance.items[idx] = itemToSlot || "";
                    statChanged = true;
                }
                break;
            }

            case "ItemWrap": {
                const idx = req.body.slotIndex || 0;
                if (slots.ItemWrap) {
                    if (Math.sign(idx) === -1) {
                        for (let i = 0; i < 7; i++) slots.ItemWrap.items[i] = itemToSlot || "";
                    } else {
                        slots.ItemWrap.items[idx] = itemToSlot || "";
                    }
                    statChanged = true;
                }
                break;
            }
        }

        if (statChanged) {
            applyProfileChanges.push({
                changeType: "itemAttrChanged",
                itemId: lockerItem,
                attributeName: "locker_slots_data",
                attributeValue: profile.items[lockerItem].attributes.locker_slots_data
            });
        }
    }

    if (statChanged) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        saveProfile(profileId, profile);
    }

    sendMcp(res, profileId, profile, baseRevision, queryRevision, applyProfileChanges);
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/*', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;

    sendMcp(res, profileId, profile, baseRevision, queryRevision, []);
});

router.post('/fortnite/api/game/v2/profile/:accountId/dedicated_server/*', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;

    sendMcp(res, profileId, profile, baseRevision, queryRevision, []);
});

module.exports = router;
