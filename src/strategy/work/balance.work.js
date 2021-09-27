// module.exports = ({ a, b }) => {
//   console.log('calculate');
//   return a + b;
// };

const _ = require('lodash');

module.exports = ({ newest, before }) => {
  const set = new Set();

  _.forIn(newest, (_, key) => {
    set.add(key);
  });

  _.forIn(before, (_, key) => {
    set.add(key);
  });

  console.log('set', set);

  // _.each([...set], x => console.log(x));

  _.each([...set], (item) => {
    console.log('item', item);

    let ratio = 0;
    if (!before[item] || before[item] === '0') {
      ratio = _.get(newest, item, 0) * 100 + '%';
    } else {
      ratio =
        ((_.get(newest, item, 0) - _.get(before, item, 0)) / before[item]) *
          100 +
        '%';
    }

    console.log('ratio', ratio);
    return ratio;
  });
};
