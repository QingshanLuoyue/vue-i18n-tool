// let babelParse = require('@babel/parser')
// // 遍历 AST
// let traverse  = require('@babel/traverse').default
// // 使用 AST 成功 原始 code
let generate  = require('@babel/generator').default
// // babel.transform 转换 原始 code 为 AST
// let babel = require("@babel/core");

// // 处理逻辑

// // 1、读取原始 code
// let { objectProperty_commonJson } = require('../template/index.js')

// // 2、转换原始 code， 得到 AST
// let result = babel.transform(objectProperty_commonJson, {
//     ast: true,
//     // presets: [
//     //     转换成 ES5
//     //     require("@babel/preset-env")
//     // ]
// })
// // Object.keys(result): [ 'metadata', 'options', 'ast', 'code', 'map', 'sourceType' ]

// // 3、遍历 AST，得到 i18n 对应的对象
// traverse(result.ast, {
//     enter(path) {
//         let node = path.node
//         if (node.type === 'ObjectProperty' && node.key.name === 'i18n' && node.value.type === 'ObjectExpression') {
//             let originStringCode = generate(node.value)
//             console.log('originStringCode :>> ', originStringCode)

//             let obj = {}
//             eval(`obj = ${originStringCode.code}`)
//             console.log('obj :>> ', obj)
//             // return obj
//         }
//     },
//     // exit(path) {
//     //     console.log('path :>> ', path)
//     // }
// })
// console.log('result.ast :>> ', result.ast);
// node:>>>  Node {
//     type: 'ObjectProperty',
//     start: 22,
//     end: 162,
//     loc: SourceLocation {
//         start: Position { line: 3, column: 4 },
//         end: Position { line: 13, column: 5 }
//     },
//     method: false,
//     key: Node {
//         type: 'Identifier',
//         start: 22,
//         end: 26,
//         loc: SourceLocation {
//         start: [Position],
//         end: [Position],
//         identifierName: 'i18n'
//         },
//         name: 'i18n',
//         leadingComments: undefined,
//         innerComments: undefined,
//         trailingComments: undefined
//     },
//     computed: false,
//     shorthand: false,
//     value: Node {
//         type: 'ObjectExpression',
//         start: 28,
//         end: 162,
//         loc: SourceLocation { start: [Position], end: [Position] },
//         properties: [ [Node], [Node], [Node] ],
//         leadingComments: undefined,
//         innerComments: undefined,
//         trailingComments: undefined
//     },
//     leadingComments: undefined,
//     innerComments: undefined,
//     trailingComments: undefined
// }

// 处理普通定义方法
// 如：
// export default {
//     i18n: {
//         zh: {
//             x: 1
//         }
//     }
// }
module.exports = function(node) {
    if (node.type === 'ObjectProperty' && node.key.name === 'i18n' && node.value.type === 'ObjectExpression') {
        let originStringCode = generate(node.value)
        // console.log('i18n string code :>> ', originStringCode)

        let obj = {}
        eval(`obj = ${originStringCode.code}`)
        // console.log('obj :>> ', obj)
        return obj
    } else {
        return null
    }
}
