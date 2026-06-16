const ItemShopTags = require('./ItemShopTags');
const { v4: uuidv4 } = require('uuid');

function generateCatalogEntry(item, section = "Featured") {
    return {
        devName: item.name || "Unknown",
        offerId: item.offerId || uuidv4(),
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
            saleExpiration: "9999-12-02T01:12:00Z",
            basePrice: item.price || 0
        }],
        meta: {
            SectionId: section,
            LayoutId: "Asteria.99",
            TileSize: item.tileSize || "Small",
            FirstSeen: new Date().toISOString(),
            inDate: new Date().toISOString(),
            outDate: "9999-12-31T23:59:59.999Z"
        },
        matchFilter: "",
        filterWeight: 0,
        appStoreId: [],
        requirements: [],
        offerType: "StaticPrice",
        giftInfo: {
            bIsEnabled: true,
            forcedGiftBoxTemplateId: "",
            purchaseRequirements: [],
            giftRecordIds: []
        },
        refundable: true,
        metaInfo: [],
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
        const entry = generateCatalogEntry(item, item.section || (index < 6 ? "Featured" : "Daily"));
        
        if (item.section === "Weekly" || index >= 6) {
            weeklyEntries.push(entry);
        } else {
            dailyEntries.push(entry);
        }
    });

    return {
        storefronts: [
            {
                name: "BRDailyStorefront",
                catalogEntries: dailyEntries
            },
            {
                name: "BRWeeklyStorefront",
                catalogEntries: weeklyEntries
            }
        ],
        refreshIntervalHrs: 24
    };
}

module.exports = {
    generateShop,
    generateCatalogEntry
};
