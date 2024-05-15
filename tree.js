

const lib = {
    folder: '#',
    file: '*',
    lastChild: '└',
    child: '├',
    branch: '│'
}

const data = {
    "name": 1,
    "items": [
        {
            "name": 2,
            "items": [
                {"name": 3},
                {"name": 4},
                {
                    "name": 2,
                    "items": [{"name": 3}, {"name": 4}]
                },
            ]
        },
        {
            "name": 5,
            "items": [{"name": 6}, {"name": 7}, {"name": 8}]
        },
        {
            "name": 5,
            "items": [{"name": 6}, {"name": 7}, {"name": 8}]
        }
    ]
}

function drawLine(deep, isLast, str, branches) {
    const start = Array(deep).fill('').map((item, index) => branches[index] ? lib.branch + '  ' : '   ').join('');
    return `${start}${isLast ? lib.child : lib.lastChild} ${str}`
}

function hasChild(obj) {
    return !!obj?.items?.length
}

/**
 * функция для получения строкового представления объекта в виде дерева
 * @return {string} строка в виде дерева
 * @param object древовидный объект
 */

function drawTree(object) {
    const branches = [];
    function treeStr(obj, deep = 0) {
        const isFolder = hasChild(obj);
        let res = (isFolder ? lib.folder : lib.file) + obj?.name + '\n';
        if (isFolder) {
            obj?.items.forEach((item, index) => {
                const isLast = index < obj.items?.length - 1;
                branches[deep] = isLast;
                res += drawLine(deep, isLast, treeStr(item, deep + 1), [...branches]);
            });
        }
        return res;
    }
    return treeStr(object);
}

module.exports = {
    drawTree
}
