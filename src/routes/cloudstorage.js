const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cloudStorageDir = path.join(__dirname, '../../cloudstorage');

if (!fs.existsSync(cloudStorageDir)) {
    fs.mkdirSync(cloudStorageDir, { recursive: true });
}

router.get('/fortnite/api/cloudstorage/system', (req, res) => {
    const systemDir = path.join(cloudStorageDir, 'system');
    if (!fs.existsSync(systemDir)) {
        fs.mkdirSync(systemDir, { recursive: true });
    }
    
    const files = [];
    try {
        const fileNames = fs.readdirSync(systemDir);
        fileNames.forEach(fileName => {
            const filePath = path.join(systemDir, fileName);
            const stats = fs.statSync(filePath);
            files.push({
                uniqueFilename: fileName,
                filename: fileName,
                hash: stats.size.toString(),
                hash256: stats.size.toString(),
                length: stats.size,
                contentType: "application/octet-stream",
                uploaded: stats.mtime.toISOString(),
                storageType: "System",
                doNotCache: false
            });
        });
    } catch (err) {}
    
    res.json(files);
});

router.get('/fortnite/api/cloudstorage/system/config', (req, res) => {
    res.json({
        "LastUpdated": new Date().toISOString(),
        "AppVersions": {}
    });
});

router.get('/fortnite/api/cloudstorage/user/:accountId', (req, res) => {
    const userDir = path.join(cloudStorageDir, req.params.accountId);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }
    
    const files = [];
    try {
        const fileNames = fs.readdirSync(userDir);
        fileNames.forEach(fileName => {
            const filePath = path.join(userDir, fileName);
            const stats = fs.statSync(filePath);
            files.push({
                uniqueFilename: fileName,
                filename: fileName,
                hash: stats.size.toString(),
                hash256: stats.size.toString(),
                length: stats.size,
                contentType: "application/octet-stream",
                uploaded: stats.mtime.toISOString(),
                storageType: "User",
                doNotCache: false
            });
        });
    } catch (err) {}
    
    res.json(files);
});

router.get('/fortnite/api/cloudstorage/user/:accountId/:fileName', (req, res) => {
    const userDir = path.join(cloudStorageDir, req.params.accountId);
    const filePath = path.join(userDir, req.params.fileName);
    
    if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        res.json({
            uniqueFilename: req.params.fileName,
            filename: req.params.fileName,
            hash: stats.size.toString(),
            hash256: stats.size.toString(),
            length: stats.size,
            contentType: "application/octet-stream",
            uploaded: stats.mtime.toISOString(),
            storageType: "User",
            doNotCache: false
        });
    } else {
        res.json({});
    }
});

router.put('/fortnite/api/cloudstorage/user/:accountId/:fileName', (req, res) => {
    const userDir = path.join(cloudStorageDir, req.params.accountId);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }
    
    const filePath = path.join(userDir, req.params.fileName);
    fs.writeFileSync(filePath, JSON.stringify(req.body));
    
    const stats = fs.statSync(filePath);
    res.json({
        uniqueFilename: req.params.fileName,
        filename: req.params.fileName,
        hash: stats.size.toString(),
        hash256: stats.size.toString(),
        length: stats.size,
        contentType: "application/octet-stream",
        uploaded: stats.mtime.toISOString(),
        storageType: "User",
        doNotCache: false
    });
});

router.delete('/fortnite/api/cloudstorage/user/:accountId/:fileName', (req, res) => {
    const userDir = path.join(cloudStorageDir, req.params.accountId);
    const filePath = path.join(userDir, req.params.fileName);
    
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    
    res.json({});
});

module.exports = router;
