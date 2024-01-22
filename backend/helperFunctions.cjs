module.exports = {
    arrayToObject: (arr, val) => {
        const obj = arr.reduce((accumulator, value) => {
          return {...accumulator, [value]: val};
        }, {});
        return obj;
      }
}