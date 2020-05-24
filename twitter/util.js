// util.js
// ========
module.exports = {
    displayArrayContent: function (arrayToDisplay) {
        Object.keys(arrayToDisplay).forEach(function(key) {
            console.log(arrayToDisplay[key]);
        });
    },
    doForAllElements: function (arrayToTreat,funct) {
        Object.keys(arrayToTreat).forEach(key => {
            arrayToTreat[key] = funct(arrayToTreat[key]);
        });
        return arrayToTreat;
    }
};