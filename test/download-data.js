'use strict';  

const fs = require('fs');
const node_path = require('path');
const http_client = require('@ritani/http-client');
const extract = require('extract-zip')

async function download_data() {
    const data_filepath = node_path.join(__dirname, 'data');
    if (fs.existsSync(data_filepath)) {
        console.log('data folder already exists');
        return;
    }
    const local_filepath = node_path.join(__dirname, 'data.zip');
    if (!fs.existsSync(local_filepath)) {
        const url = 'https://assets.newecx.com/template/data.zip';
        const options = {method: 'get', url, local_filepath};
        const response = await http_client(options);
        if (response.status !== 200) {
            console.log('failed to get data.zip');
            return;
        }
    }
    if (fs.existsSync(local_filepath)) {
        try {
            await extract(local_filepath, { dir: __dirname })
            const parent_data_dir = node_path.join(node_path.dirname(__dirname), 'data');
            if (!fs.existsSync(parent_data_dir)) {
                fs.mkdirSync(parent_data_dir);
            }
            const parent_data_csv_file = node_path.join(parent_data_dir, 'inventory.csv');
            if (!fs.existsSync(parent_data_csv_file)) {
                fs.copyFileSync(node_path.join(__dirname, 'data', 'inventory.csv'), parent_data_csv_file)
            }
            fs.unlinkSync(local_filepath);
        } catch (err) {
            console.error(err);
        }
    } else {
        console.log('failed to download data.zip');
    }
}

module.exports = download_data;