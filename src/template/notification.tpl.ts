export const tpl = `
  Treasury Notification:
    {{#each content}}
      address:{{address}}
      treasury:{{treasury}}
      chain:{{chain_id}}
      symbol:{{contract_ticker_symbol}}
      newest:{{newest}}
      before:{{newest}}
      ratio:{{ratio}}
      ----------------------------------
    {{/each}}
    {{created_at}}
    {{id}}
`;
