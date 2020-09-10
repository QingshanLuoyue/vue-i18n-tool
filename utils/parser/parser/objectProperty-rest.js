// const { objectProperty_rest, exportConstI18nRest, origin_rest } = require('../js-script-template/index.js')
// const { analysis, generate } = require('../babel.js')

// AST 处理逻辑
const enter = function(path) {
    let node = path.node
    // console.log('node :>> ', node);
    if (node.type === 'SpreadElement') {
        // 移除扩展符
        // ...rest
        path.remove()
    }
    if (node.type === 'ObjectProperty' && node.value.type === 'FunctionExpression') {
        // 移除函数
        // fun: function() {}
        path.remove()
    }
    if (node.type === 'ObjectMethod') {
        // 移除 对象方法
        // fun() {}
        path.remove()
    }
}


// // 测试
// let { ast } = analysis(exportConstI18nRest, [
//     {
//         enter
//     }
// ])
// // 再次生成，对比原始 code，是否有删除无法处理语法
// let str = generate(ast)
// console.log('str :>> ', str)

module.exports = enter
