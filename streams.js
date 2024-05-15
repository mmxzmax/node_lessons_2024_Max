const {pipeline} = require('node:stream/promises');
const fs = require('node:fs');
const {Transform} = require('node:stream')
const path = require('node:path');

const SEPARATOR = /\s|\W/gm

class TextSplitTransform extends Transform {
    lastPart = '';

    _transform(chunk, encoding, callback) {
        const resArray = [];
        const str = chunk.toString();
        try {
            const words = str.split(SEPARATOR);
            if (this.lastPart !== '') { // проверяем наличие обрезанных слов в следующем чанке и востанавливаем их с помощь кешированного значения
                if (/^\W/.test(str)) {
                    resArray.push(this.lastPart);
                    resArray.push(...words);
                } else {
                    resArray.push(...words);
                    resArray[0] = this.lastPart + resArray[0];
                }
                this.lastPart = '';
            } else {
                resArray.push(...words);
            }
            this.lastPart = resArray.pop(); //кешируем последнее слово в чанке
            callback(null, resArray.filter(item => item !== '').map(str => str?.toLowerCase()).join('|'));
        } catch (err) {
            callback(err);
        }
    }
}

async function processText(fileName) {
    const data = new Map()
    const filePath = path.join(__dirname, fileName);
    const fileBase = path.basename(fileName);
    const resultPath = path.join(path.dirname(filePath), `result_for_${fileBase}`);
    await pipeline(
        fs.createReadStream(filePath, {encoding: 'utf8'}),
        new TextSplitTransform(),
        async function* (source) {
            source.setEncoding('utf8');
            for await (const chunk of source) {
                const arr = chunk.toString().split('|').filter(item => item !== '');
                arr.forEach(str => {
                    const item = data.get(str);
                    data.set(str, item ? item + 1 : 1);
                });
            }
            yield `[${[...data.entries()].sort().map(item => item[1]).join(',')}]`;
        },
        fs.createWriteStream(resultPath, {encoding: 'utf8'})
    );
    console.log(`file: ${fileBase} Success Processed`);
}


module.exports = {
    processText
}
