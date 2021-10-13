const Decimal = require('decimal.js');
const _ = require('lodash');

module.exports = ({ newest, before, ratioLimit }) => {
  const set = new Set();

  _.forIn(newest, (_, key) => {
    set.add(key);
  });

  _.forIn(before, (_, key) => {
    set.add(key);
  });

  //

  // _.each([...set], x =>

  let result = [];
  _.each([...set], (item) => {
    //

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

    //
    // console.log(
    //   'Decimal.abs(ratio).gte(Decimal.abs(0.02))',
    //   Decimal.abs(ratio).gte(Decimal.abs(0.02)),
    // );
    // return ratio;
    //

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
        name: _.get(before, `${item}.name`) || _.get(newest, `${item}.name`),
        ratio: ratio === 0 ? 0 : ratio.toFixed(2) * 100 + '%',
        time_at: new Date().valueOf(),
      });
    }
  });

  return result;
};
