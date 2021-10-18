export const tpl = `
  Treasury Notification:
    {{#each content}}
      address:{{address}}
      treasury:{{treasury}}
      chain:{{chain_id}}
      symbol:{{contract_ticker_symbol}}
      newest:{{newest}}
      before:{{before}}
      ratio:{{ratio}}
      ----------------------------------
    {{/each}}
    {{created_at}}
    {{id}}
`;
