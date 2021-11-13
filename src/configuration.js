'use strict';

require('dotenv').config();

module.exports = {
    set_account,
    get_ftp_config,
    get_from_env
};

/*
.env
FTP_HOST=ftp.ritani.com
FTP_USER=username
FTP_PASSWORD=password
*/

let config = null;

function set_account(input) {
    config = input;
}

function get_ftp_config() {
    if (!config) {
        get_from_env();
    }
    if (config && config.ftp_host && config.ftp_user && config.ftp_password) {
        return {host: config.ftp_host, user: config.ftp_user, password: config.ftp_password, secure: true};
    }
    throw new Error('failed to get ftp_config');
}

function get_from_env() {
    config = { ftp_secure: true };
    if (process.env.FTP_HOST) {
        config.ftp_host = process.env.FTP_HOST;
    }    
    if (process.env.FTP_USER) {
        config.ftp_user = process.env.FTP_USER;
    }
    if (process.env.FTP_PASSWORD) {
        config.ftp_password = process.env.FTP_PASSWORD;
    }
}