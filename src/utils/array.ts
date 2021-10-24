/**
 *
 * @param array
 * @param subGroupLength
 * @returns
 * @example
 * var Array = [1,2,3,4,5,6,7,8,9,10,11,12];;
 * var groupedArray = group(Array, 6);
 * 得到的groupedArray 数组为：
 * groupedArray[[1,2,3,4,5,6],[7,8,9,10,11,12]]
 * 
 */
export function group(array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
}
