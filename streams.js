const {pipeline} = require('node:stream/promises');
const fs = require('node:fs');
const {Transform} = require('node:stream')
const path = require('node:path');

const SEPARATOR = /\s|\W/gm

class TextSplitTransform extends Transform {
    _transform(chunk, encoding, callback) {
        const str = chunk.toString();
        try {
            const words = str.replace(SEPARATOR, '|').replace(/\|\|/gm, '|');
            callback(null, words);
        } catch (err) {
            callback(err);
        }
    }
}

class TextCounterTransform extends Transform {
    _transform(chunk, encoding, callback) {
        const data = JSON.parse(chunk.toString());
        try {
            callback(null, `[${[...data.reduce((acc, word) => {
                const item = acc.get(word);
                acc.set(word, item ? item + 1 : 1);
                return acc
            }, new Map()).entries()].map(item => item[1]).join(',')}]`);
        } catch (err) {
            callback(err);
        }
    }
}

async function processText(fileName) {
    const filePath = path.join(__dirname, fileName);
    const fileBase = path.basename(fileName);
    const resultPath = path.join(path.dirname(filePath), `result_for_${fileBase}`);
    await pipeline(
        fs.createReadStream(filePath, {encoding: 'utf8'}),
        new TextSplitTransform(),
        async function* (source) {
            let text = '';
            source.setEncoding('utf8');
            for await (const chunk of source) {
                text += chunk.toString();
            }
            yield JSON.stringify(text.split('|').filter(word => word !== '').sort());
        },
        new TextCounterTransform(),
        fs.createWriteStream(resultPath, {encoding: 'utf8'})
    );
    console.log(`file: ${fileBase} Success Processed`);
}


module.exports = {
    processText
}
