// const fs = require('fs')
// const path = require('path')

const { analysis } = require('./babel');


// 处理逻辑
const getI18n = function(scriptContent, isTs, fileName) {
    let i18nObj = null

    // 解析方法
    let { ObjectProperty_ObjectExpression, removeUnableToParseSyntax, ObjectProperty_Identifier } = require('./parser/index')


    analysis(scriptContent, [
        {
            // 移除，无法处理的语法
            enter: removeUnableToParseSyntax([
                'SpreadElement',
                'ObjectProperty_valueFunctionExpression',
                'ObjectMethod'
            ])
        },
        {
            enter(path) {
                // console.log('enter :>> ', path.node);
                let res = null

                if (res = ObjectProperty_ObjectExpression(path, fileName)) {
                    // 去除无法识别语法

                    i18nObj = res
                    // console.log('ObjectProperty_ObjectExpression i18nObj :>> ', i18nObj)
                    return
                } else if (ObjectProperty_Identifier.hitEnter(path)) {
                    analysis(scriptContent, [
                        {
                            enter: ObjectProperty_Identifier.getImportUrl
                        }
                    ])
                    i18nObj = ObjectProperty_Identifier.getI18n(fileName)
                    // console.log('ObjectProperty_Identifier i18nObj :>> ', i18nObj)
                    return
                }
            },
        }
    ], isTs)
    return i18nObj
}
exports.getI18n = getI18n
// getI18n('', false)

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
