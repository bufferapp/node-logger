/* eslint-env mocha */
/* eslint padded-blocks: 0 max-len: 0 */
const { assert } = require('chai');
const {
  removeTokensFromQuery,
  removeTokensFromUrl,
} = require('../lib/utils');

describe('utils', () => {

  describe('removeTokensFromQuery', () => {

    it('should remove sensitive tokens from a given query object', () => {
      assert.deepEqual(removeTokensFromQuery({ access_token: '1234' }), { access_token: '*' });
      assert.deepEqual(removeTokensFromQuery({ token: '5678' }), { token: '*' });
    });

    it('should not touch non token params', () => {
      assert.deepEqual(removeTokensFromQuery({ access_token: '1234', id: 100 }), { access_token: '*', id: 100 });
      assert.deepEqual(removeTokensFromQuery({ token: '5678', client_id: 'ABCD' }), { token: '*', client_id: 'ABCD' });
    });

  });

  describe('removeTokensFromUrl', () => {

    it('should remove sensitive tokens from a given url', () => {
      assert.equal(removeTokensFromUrl('http://api.test.com/something?access_token=1234'),
        'http://api.test.com/something?access_token=*');
      assert.equal(removeTokensFromUrl('http://api.test.com/ok.json?my_token=ABCD'),
        'http://api.test.com/ok.json?my_token=*');
    });

    it('should not remove non-sensitive params from the query string', () => {
      assert.equal(removeTokensFromUrl('http://api.test.com/something?access_token=1234&url=http%3A%2F%2Ftoken.com'),
        'http://api.test.com/something?access_token=*&url=http%3A%2F%2Ftoken.com');
      assert.equal(removeTokensFromUrl('http://api.test.com/ok.json?token=1234&client_id=987654321'),
        'http://api.test.com/ok.json?token=*&client_id=987654321');
    });

    it('should do nothing to urls without tokens', () => {
      assert.equal(removeTokensFromUrl('http://test.com/?url=http%3A%2F%2Fok.com'),
        'http://test.com/?url=http%3A%2F%2Fok.com');
      assert.equal(removeTokensFromUrl('http://test.com/ok/path'),
        'http://test.com/ok/path');
    });

  });

});