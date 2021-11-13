'use strict';

const assets_config = require('./assets-config');
const configuration = require('./configuration');
const ftp_cmds = require('./ftp-cmds');
const ftp_client = require('./ftp-client');

module.exports = {
    ...assets_config,
    ...configuration,
    ...ftp_cmds,
    ...ftp_client
};