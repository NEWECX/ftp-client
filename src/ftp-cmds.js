'use strict';

const fs = require('fs');
const node_path = require('path');
const Client = require("ftp")
const configuration = require('./configuration');

module.exports = {
    login,
    logout,
    close,
    list,
    get,
    put,
    cwd,
    pwd,
    mkdir,
    rm,
    cd_up,
};

let client = null;

function login(callback, config = configuration.get_ftp_config()) {
    return new Promise(resolve => {
        if (client) {
            close();
        }
        client = new Client();
        client.connect(config);
        client.on('end', () => {
            resolve();
            //console.log('connection ended');
        });
        client.on('ready', () => {
            callback();
        });
    });
}

function logout() {
    return new Promise(resolve => {
        client.logout((err) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

function list(path) {
    return new Promise(resolve => {
        client.listSafe(path, (err, list) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(list);
            }
        })
    });
}

function get(path, local_filepath) {
    if (!local_filepath) {
        const filename = node_path.basename(path);
        local_filepath = node_path.join(__dirname, filename); 
    }
    return new Promise(resolve => {
        client.get(path, (err, rs) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                const ws = fs.createWriteStream(local_filepath);
                rs.pipe(ws);
                rs.on('end', () => {
                    resolve(local_filepath);
                })
            }
        })
    });
}

function put(local_filepath, dest_path) {
    if (!dest_path) {
        const filename = node_path.basename(local_filepath);
        dest_path = filename; 
    }
    return new Promise(resolve => {
        client.put(local_filepath, dest_path, (err) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

function mkdir(path) {
    return new Promise(resolve => {
        client.mkdir(path, true, (err) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

function rm(path) {
    return new Promise(resolve => {
        client.delete(path, (err) => {
            if (err) {
                //console.error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

function cd_up() {
    return new Promise(resolve => {
        client.cdup((err) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}


function pwd() {
    return new Promise(resolve => {
        client.pwd((err, current_dir) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(current_dir);
            }
        })
    });
}

function cwd(path) {
    return new Promise(resolve => {
        client.cwd(path, (err) => {
            if (err) {
                console.error(err);
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}

function close() {
    if (client) {
        client.end();
        client.destroy();
        client = null;
    }
}