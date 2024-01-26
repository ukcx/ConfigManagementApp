let processSet = new Set();
module.exports = {
    processSet: processSet,
    getProcessString: (key) => {
        return `${key}`;
    },
    checkAndAddToProcessSet: (processString) => {
        if(processSet.has(processString)) {
          return false;
        }
        else{
          processSet.add(processString);
          return true;
        }
    },
    removeFromProcessSet: (processString) => {
        processSet.delete(processString);
    }
};