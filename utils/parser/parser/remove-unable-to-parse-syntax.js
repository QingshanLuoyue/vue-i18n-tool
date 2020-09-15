// const { objectProperty_rest, exportConstI18nRest, origin_rest } = require('../js-script-template/index.js')
// const { analysis, generate } = require('../babel.js')

const filterSyntaxHandlers = {
    ObjectProperty__keyIdentifier__valueIdentifier: function(path) {
        if (path.node && path.node.type === 'ObjectProperty' && path.node.key.type === 'Identifier' && path.node.value.type === 'Identifier') {
            // 移除 对象方法
            // i18n: i18n
            path.remove()
        }
    },
    SpreadElement: function(path) {
        if (path.node && path.node.type === 'SpreadElement') {
            // 移除扩展符
            // ...rest
            path.remove()
        }
    },
    ObjectProperty_valueFunctionExpression: function(path) {
        if (path.node && path.node.type === 'ObjectProperty' && path.node.value.type === 'FunctionExpression') {
            // 移除函数
            // fun: function() {}
            path.remove()
        }
    },
    ObjectMethod: function(path) {
        if (path.node && path.node.type === 'ObjectMethod') {
            // 移除 对象方法
            // fun() {}
            path.remove()
        }
    }
}

exports.ObjectProperty__keyIdentifier__valueIdentifier = filterSyntaxHandlers.ObjectProperty__keyIdentifier__valueIdentifier

exports.SpreadElement = filterSyntaxHandlers.SpreadElement

exports.ObjectProperty_valueFunctionExpression = filterSyntaxHandlers.ObjectProperty_valueFunctionExpression

exports.ObjectMethod = filterSyntaxHandlers.ObjectMethod



// AST 处理逻辑
const enter = function(specifyFilterSyntaxs = []) {
    // console.log('node :>> ', path.node);
    return path => {
        // 若指定了过滤的语法
        // console.log('specifyFilterSyntaxs :>> ', specifyFilterSyntaxs);
        if (specifyFilterSyntaxs && specifyFilterSyntaxs.length !== 0) {
            specifyFilterSyntaxs.forEach(syntax => {
                filterSyntaxHandlers[syntax](path)
            })
        } else {
            // 没有指定过滤语法，全部过滤
            for (const key in filterSyntaxHandlers) {
                if (filterSyntaxHandlers.hasOwnProperty(key)) {
                    const handler = filterSyntaxHandlers[key]
                    handler(path)
                }
            }
        }
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
