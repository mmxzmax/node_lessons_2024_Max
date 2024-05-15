const { processText } = require('./streams');


(async ()=>{
    await processText('/data/text1');
    await processText('/data/text2');
    await processText('/data/text3');
    await processText('/data/text4');
})();
