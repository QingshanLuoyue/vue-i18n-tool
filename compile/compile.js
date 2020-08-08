const fs = require('fs')
const path = require('path')


// let babelParse = require('@babel/parser')
let traverse  = require('@babel/traverse').default
let generate  = require('@babel/generator').default
let babel = require("@babel/core");

let originJs = fs.readFileSync(path.resolve(__dirname, './origin.js'), { encoding: 'utf8'})
// let vueExport = `
// import i18n from './compile-txt/xxx.json'
// // import user from './compile-txt/only-export.txt'
// export default {
//     i18n: {
//         en: {
//             x: 1
//         }
//     }
// }
// `
let result = babel.transform(vueExport, {
    ast: true,
    presets: [
        require("@babel/preset-env")
    ]
})
// console.log('result :>> ', result.ast);
// 转换 AST
// let pcode = babelParse.parse(tran, {
// let pcode = babelParse.parse(vueExport)
// console.log('pcode :>> ', JSON.stringify(pcode, null, 2));

// 遍历 AST
traverse(result.ast, {
    enter(path) {
        // console.log('enter :>> ', path.node);
        let node = path.node
        if (node.type === 'CallExpression' && node.arguments && node.arguments[0] && node.arguments[0].type === 'StringLiteral') {
            console.log('node.arguments[0] :>> ', node.arguments[0]);
            // node.arguments[0].value = 'test.js'
        }
        // path.node.source && (path.node.source.value = 'test.js')
        // console.log('path :>> ', JSON.stringify(path.node), null, 2);
    },
    exit(path) {
        let node = path.node
        if (node.type === 'CallExpression' && node.arguments && node.arguments[0] && node.arguments[0].type === 'StringLiteral') {
            console.log('node.arguments[0] :>>退出 ', node.arguments[0]);
        }
        // console.log('exit :>>退出 ', path.type);
        // console.log('exit :>> 退出', path);
    }
})
// console.log('result.ast :>> ', result.ast);

let output = generate(result.ast)


console.log('output :>> ', output);


fs.writeFileSync(path.resolve(__dirname, './export.js'), output.code)


let exportObj = require('./export')
console.log('exportObj :>> ', exportObj);







// let esprima = require('esprima')
// let estraverse = require('estraverse')
// let escodegen = require('escodegen')

// let originJs = fs.readFileSync(path.resolve(__dirname, './origin.js'), { encoding: 'utf8'})
// console.log('originJs :>> ', originJs);
// let jsOrigin = `
// var _vue = _interopRequireDefault(require("vue"));

// function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// var a = {
//   i18n: {
//     en: {
//       eee: 1,
//     },
//   }
// };`

// let AST = esprima.parseScript(`${jsOrigin}`)

// console.log('AST :>> ', JSON.stringify(AST, null, 4));


// estraverse.traverse(AST, {
//     enter(node) {
//         console.log('enter :>> ', node.type);
//     },
//     leave(node) {
//         console.log('leave :>> ', node.type);
//     }
// })


// let actionJs = escodegen.generate(AST)
// console.log('actionJs :>> ', actionJs);
