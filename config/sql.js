const config = {
    server: 'localhost',
    database: 'mmsdb',
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
};
const POLLING_INTERVAL = 3000;

module.exports = {
    config,
    POLLING_INTERVAL
};