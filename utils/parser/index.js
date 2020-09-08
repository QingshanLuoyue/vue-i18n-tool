// const fs = require('fs')
// const path = require('path')
// let babelParse = require('@babel/parser')
// 遍历 AST
let traverse  = require('@babel/traverse').default
// 使用 AST 成功 原始 code
// let generate  = require('@babel/generator').default
// babel.transform 转换 原始 code 为 AST
let babel = require("@babel/core");


// 缓存当前数据，只有重启IDE才会更新数据
const instance = {}

// 处理逻辑
const getI18n = function(scriptContent, fileName) {
    // 若存在当前页面多语言对象，则直接返回
    console.log('before')
    if (instance[fileName]) {
        return instance[fileName]
    }
    console.log('after')

    // 1、读取原始 code
    // let originJs = fs.readFileSync(path.resolve(__dirname, './template/origin.js'), { encoding: 'utf8'})
    // let originJs = fs.readFileSync(path.resolve(__dirname, './template/origin-decorate.js'), { encoding: 'utf8'})
    // let { objectProperty_commonJson } = require('./template/index.js')
    let objectProperty = require('./parserModel/objectProperty.js')
    // 2、转换原始 code， 得到 AST
    // babelParse
    // let result = babelParse.parse(originJs, {
    let result = babel.transform(scriptContent, {
    // let result = babel.transform(originJs, {
        ast: true,
        filename: 'file.ts',
        presets: [
            // 转换成 ES5
            require("@babel/preset-env"),
            require("@babel/preset-typescript"),
        ],
        plugins: [
            [
                require("@babel/plugin-proposal-decorators"),
                {
                    decoratorsBeforeExport: true,
                    // legacy: true
                }
            ],
            [
                require("@babel/plugin-proposal-class-properties"),
                // { loose : true }
            ],
        ]

        // babelParse配置
        // sourceType: "module",
        // plugins: [
        //     "typescript",
        //     'decorators-legacy',
        //     "classProperties",
        // ]
    })
    // console.log('result :>> ', result);
    // Object.keys(result): [ 'metadata', 'options', 'ast', 'code', 'map', 'sourceType' ]


    // 3、遍历 AST，得到 i18n 对应的对象
    traverse(result.ast, {
        enter(path) {
            // console.log('enter :>> ', path.node);
            let node = path.node
            let res = null
            if (res = objectProperty(node)) {
                // console.log('res :>> ', res)
                instance[fileName] = res
            }
        },
        // exit(path) {
            // let node = path.node
            // if (node.type === 'CallExpression' && node.arguments && node.arguments[0] && node.arguments[0].type === 'StringLiteral') {
            //     console.log('node.arguments[0] :>>退出 ', node.arguments[0]);
            // }
            // console.log('exit :>>退出 ', path.type);
            // console.log('exit :>> 退出', path);
        // }
    })
    // console.log('result.ast :>> ', result.ast);
    return instance[fileName]
}
exports.getI18n = getI18n
// getI18n()

// 手动解析 script 中的 i18n 字段

// 解析
//     import
//     解析 i18n 中的
//         函数：箭头函数，匿名函数，具名函数
//         ...扩展符
//         ...等等

// babel
//     转换 import export 为 es5
//     require 引入，得到 i18n 对象

// vue compile sfc


// 解析 i18n
//     判断是纯对象，直接读取
//     是外部赋值，根据赋值 key 值，去 import 查找 key 值对应的路径，读取路径获取 key 对应的对象
