module.exports = {
    arrayToObject: (arr, val, randomize) => {
        const obj = arr.reduce((accumulator, value) => {
          if(randomize){
            // Randomize the value (for testing purposes)
            val = Math.floor(Math.random() * 1000);
          }
          return {...accumulator, [value]: val};
        }, {});
        return obj;
    },
    trimObjectValues: (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = obj[key].trim();
            }
        }
        return obj;
    }
}