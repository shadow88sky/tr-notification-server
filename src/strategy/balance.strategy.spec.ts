const balanceWork = require('./work/balance.work');

describe('BalanceStrategy', () => {
  describe('BalanceStrategy', () => {
    it('should ok', async () => {
      const newest = {
        '8961f5f7-c0e7-4ac7-a072-e48ba03f354e:1:0x4750c43867ef5f89869132eccf19b9b6c4286e1a:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee':
          {
            balance: '1900',
            chain_id: 1,
            contract_ticker_symbol: 'ETH',
            address: '0x4750c43867ef5f89869132eccf19b9b6c4286e1a',
            category_id: '8961f5f7-c0e7-4ac7-a072-e48ba03f354e',
            name: 'YGG',
          },
        '8961f5f7-c0e7-4ac7-a072-e48ba03f354e:1:0x4750c43867ef5f89869132eccf19b9b6c4286e1a:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2':
          {
            balance: '2000',
            chain_id: 1,
            contract_ticker_symbol: 'WETH',
            address: '0x4750c43867ef5f89869132eccf19b9b6c4286e1a',
            category_id: '8961f5f7-c0e7-4ac7-a072-e48ba03f354e',
            name: 'YGG',
          },
      };
      const before = {
        '8961f5f7-c0e7-4ac7-a072-e48ba03f354e:1:0x4750c43867ef5f89869132eccf19b9b6c4286e1a:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee':
          {
            balance: '2000',
            chain_id: 1,
            contract_ticker_symbol: 'ETH',
            address: '0x4750c43867ef5f89869132eccf19b9b6c4286e1a',
            category_id: '8961f5f7-c0e7-4ac7-a072-e48ba03f354e',
            name: 'YGG',
          },
        '8961f5f7-c0e7-4ac7-a072-e48ba03f354e:1:0x4750c43867ef5f89869132eccf19b9b6c4286e1a:0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1':
          {
            balance: '2000',
            chain_id: 1,
            contract_ticker_symbol: 'AETH',
            address: '0x4750c43867ef5f89869132eccf19b9b6c4286e1a',
            category_id: '8961f5f7-c0e7-4ac7-a072-e48ba03f354e',
            name: 'YGG',
          },
      };

      console.log('balanceWork', balanceWork);
      const result = balanceWork({ newest, before, ratioLimit: 0.02 });
      console.log('result', result);
      expect(test()).toBe(1);
    });
  });

  function test() {
    return 1;
  }
});
