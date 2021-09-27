const Decimal = require('Decimal.js');
const _ = require('lodash');

module.exports = ({ newest, before, ratioLimit }) => {
  const set = new Set();

  _.forIn(newest, (_, key) => {
    set.add(key);
  });

  _.forIn(before, (_, key) => {
    set.add(key);
  });

  // console.log('set', set);

  // _.each([...set], x => console.log(x));

  let result = [];
  _.each([...set], (item) => {
    // console.log('item', item);

    let ratio = 0;
    if (
      !before[item] ||
      _.get(before, `${item}.balance`) === '0' ||
      _.get(before, `${item}.balance`) === 0
    ) {
      ratio = _.get(newest, `${item}.balance`, 0);
    } else {
      ratio =
        (_.get(newest, `${item}.balance`, 0) -
          _.get(before, `${item}.balance`, 0)) /
        _.get(before, `${item}.balance`);
    }

    // console.log('ratio', ratio);
    // console.log(
    //   'Decimal.abs(ratio).gte(Decimal.abs(0.02))',
    //   Decimal.abs(ratio).gte(Decimal.abs(0.02)),
    // );
    // return ratio;
    console.log('ratio', ratio);

    if (Decimal.abs(ratio).gte(Decimal.abs(ratioLimit))) {
      result.push({
        category_id:
          _.get(before, `${item}.category_id`) ||
          _.get(newest, `${item}.category_id`),
        address:
          _.get(before, `${item}.address`) || _.get(newest, `${item}.address`),
        chain_id:
          _.get(before, `${item}.chain_id`) ||
          _.get(newest, `${item}.chain_id`),
        contract_ticker_symbol:
          _.get(before, `${item}.contract_ticker_symbol`) ||
          _.get(newest, `${item}.contract_ticker_symbol`),
        newest: _.get(newest, `${item}.balance`, 0),
        before: _.get(before, `${item}.balance`, 0),
        ratio: ratio === 0 ? 0 : ratio.toFixed(2) * 100 + '%',
      });
    }
  });

  return result;
};
