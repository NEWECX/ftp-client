# FTP Client for Automation of Ritani Vendor Feed Uploading

## How to install

    npm install @ritani/ftp-client

## How to use

## Step 1. create .env file in project directory

cat ./.env

    FTP_HOST=ftp.ritani.com
    FTP_USER=...
    FTP_PASSWORD=...

FTP_USER and FTP_PASSWORD are provided by Ritani.

## Step 2. in code

    const { login, logout, put, close } = require('@ritani/ftp-client');

    await login();

    const csv_filepath = 'absolute path to the feed csv file';

    if (await put(local_filepath)) {
        console.log('ftp upload done!');
    } else {
        console.log('ftp upload failed');
    }

    await logout();
    
    close();
