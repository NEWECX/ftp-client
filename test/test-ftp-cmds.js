'use strict';

const os = require('os');
const fs = require('fs');
const chai = require('chai');
const node_path = require('path');

const {
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
} = require('../src/ftp-cmds')

const expect = chai.expect;

// to run all tests start with test-
// npm test
// OR
// stage_env=test mocha --timeout 3000 --reporter spec test/test-ftp-cmds

describe('Test ftp-cmds', () => {

    it('test login pwd list logout', async () => {
        const logged_in = await login();
        expect(logged_in).equals(true);
        const cwd = await pwd();
        //console.log('cwd', cwd);
        expect(cwd).equals('/');
        const result = await list(cwd);
        //console.log('list result', result);
        expect(result.length).greaterThan(1);
        await logout();
    });

    it('test get', async () => {
        const logged_in = await login();
        expect(logged_in).equals(true);
        const local_filepath = node_path.join(os.tmpdir(), 'log.txt');
        if (fs.existsSync(local_filepath)) {
            fs.unlinkSync(local_filepath);
        }
        const result = await get('/log.txt', local_filepath);
        //console.log('result', result);
        expect(result).equals(local_filepath);
        expect(fs.existsSync(local_filepath)).equals(true);
        await logout();
    });

    it('test put', async () => {
        const logged_in = await login();
        expect(logged_in).equals(true);
        const local_filepath = node_path.join(__dirname, 'data', 'inventory.csv');
        const result = await put(local_filepath, '/inventory.csv');
        //console.log('result', result);
        expect(result).equals(true);
        const list_result = await list('/');
        expect(list_result.findIndex(x => x.name === 'inventory.csv')).not.equal(-1);
        await logout();
    });

    it('test put without dest_path', async () => {
        const logged_in = await login();
        expect(logged_in).equals(true);
        const local_filepath = node_path.join(__dirname, 'data', 'inventory.csv');
        const result = await put(local_filepath);
        //console.log('result', result);
        expect(result).equals(true);
        const list_result = await list('/');
        expect(list_result.findIndex(x => x.name === 'inventory.csv')).not.equal(-1);
        await logout();
    });

    it('test cwd', async () => {
        const logged_in = await login();
        expect(logged_in).equals(true);
        const result = await cwd('/assets');
        expect(result).equals(true);
        const result2 = await pwd();
        expect(result2).equals('/assets');
        await logout();
    });

    it('test mkdir', async () => {
        const logged_in = await login();
        expect(logged_in).equals(true);
        await cwd('/assets');
        const result = await mkdir('GIA-123456789');
        expect(result).equals(true);
        const result2 = await list('/assets');
        expect(result2.findIndex(x => x.name === 'GIA-123456789')).not.equal(-1);
        const result3 = await rm('GIA-123456789'); // not allow to remove folder
        //console.log('result3', result3);
        expect(result3).equals(false);
        const result4 = await list('/assets');
        expect(result4.findIndex(x => x.name === 'GIA-123456789')).not.equal(-1);
        await logout();
    });

    it('test rm, cd_up', async () => {
        const logged_in = await login();
        expect(logged_in).equals(true);
        await cwd('/assets');
        const result = await rm('GIA-123456789'); // not allow to remove folder
        //console.log('result', result);
        expect(result).equals(false);
        const result2 = await list('/assets');
        expect(result2.findIndex(x => x.name === 'GIA-123456789')).not.equal(-1);
        const result3 = await cd_up();
        expect(result3).equals(true);
        const result4 = await pwd();
        //console.log('result4', result4);
        expect(result4).equals('/');
        await logout();
    });

    after(() => {
        close();
    });
});