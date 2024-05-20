const {drawTree} = require('./tree');
describe('tree module', () => {
    test('should draw tree from simple obj', () => {
        expect(drawTree({name: 'first'})).toBe('*first'+'\n');
    });
    test('should draw tree from obj with childs', () => {
        expect(drawTree({name: 'first', items: [{name: 'child'}, {name: 'child2'}]})).toBe('#first'+'\n'+'├ *child'+'\n'+'└ *child2'+'\n');
    });
    test('should work with not supported obj', () => {
        expect(drawTree(null)).toBe('');
        expect(drawTree({})).toBe('');
        expect(drawTree('')).toBe('');
        expect(drawTree({name: 'first', items:[{}]})).toBe('#first'+'\n');
    });
});
