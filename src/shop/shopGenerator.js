const ItemShopTags = require('./ItemShopTags');

// Fixed dates so repeated catalog requests are byte-for-byte identical.
// Non-deterministic values (random ids / new Date()) make the client think
// the shop changed on every poll, causing tiles to flicker and re-animate.
const FIRST_SEEN = "2020-01-01T00:00:00.000Z";
const IN_DATE = "2020-01-01T00:00:00.000Z";
const OUT_DATE = "9999-12-31T23:59:59.999Z";
const SALE_EXPIRATION = "9999-12-02T01:12:00Z";

// Deterministic offer id derived from the item it grants.
function buildOfferId(item) {
    if (item.offerId) return item.offerId;
    const base = item.templateId || item.name || "unknown";
    return `v2:/${base}`;
}

function generateCatalogEntry(item, section = "Featured", index = 0) {
    const meta = {
        SectionId: section,
        LayoutId: `Asteria.${index}`,
        TileSize: item.tileSize || "Small",
        AnalyticOfferGroupId: `Asteria/${section}${index}`,
        FirstSeen: FIRST_SEEN,
        inDate: IN_DATE,
        outDate: OUT_DATE
    };

    return {
        devName: item.name || item.templateId || "Unknown",
        offerId: buildOfferId(item),
        fulfillmentIds: [],
        dailyLimit: -1,
        weeklyLimit: -1,
        monthlyLimit: -1,
        categories: [],
        prices: [{
            currencyType: "MtxCurrency",
            currencySubType: "",
            regularPrice: item.price || 0,
            finalPrice: item.price || 0,
            saleExpiration: SALE_EXPIRATION,
            basePrice: item.price || 0
        }],
        meta: meta,
        matchFilter: "",
        filterWeight: 0,
        appStoreId: [],
        requirements: [{
            requirementType: "DenyOnItemOwnership",
            requiredId: item.templateId || "",
            minQuantity: 1
        }],
        offerType: "StaticPrice",
        giftInfo: {
            bIsEnabled: true,
            forcedGiftBoxTemplateId: "",
            purchaseRequirements: [],
            giftRecordIds: []
        },
        refundable: true,
        metaInfo: Object.keys(meta).map((key) => ({ key, value: meta[key] })),
        displayAssetPath: item.displayAsset || "",
        itemGrants: [{
            templateId: item.templateId || "",
            quantity: 1
        }],
        sortPriority: 0,
        catalogGroupPriority: 0
    };
}

function generateShop(items = []) {
    const dailyEntries = [];
    const weeklyEntries = [];

    items.forEach((item, index) => {
        const section = item.section || (index < 6 ? "Featured" : "Daily");
        const entry = generateCatalogEntry(item, section, index);

        if (item.section === "Weekly" || index >= 6) {
            weeklyEntries.push(entry);
        } else {
            dailyEntries.push(entry);
        }
    });

    return {
        refreshIntervalHrs: 24,
        dailyPurchaseHrs: 24,
        expiration: OUT_DATE,
        storefronts: [
            {
                name: "BRDailyStorefront",
                catalogEntries: dailyEntries
            },
            {
                name: "BRWeeklyStorefront",
                catalogEntries: weeklyEntries
            }
        ]
    };
}

module.exports = {
    generateShop,
    generateCatalogEntry
};
