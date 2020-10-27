// const { ObjectProperty_Identifier_template } = require('../js-script-template/index.js')
const {
    analysis,
    generate
} = require('../babel.js')

const removeUnableToParseSyntax = require('./remove-unable-to-parse-syntax.js')

const enter = function(path, fileName, keyName = 'i18n') {
    let node = path.node
    // console.log('node :>> ', node);
    // if (node.type === 'ExportDefaultDeclaration') {
    //     let originStringCode = generate(node.declaration)
    //     console.log('i18n string code :>> ', originStringCode)
    // }
    if (node.type === 'ObjectProperty' && node.key.name === keyName && node.value.type === 'ObjectExpression') {
        let originString = generate(node.value)
        let originStringCode = `var i18n = ${originString.code}`
        // console.log('i18n string code :>> ', originString)

        // 去除 i18n 对象中的不支持的语法
        let { ast } = analysis(originStringCode, [{
            enter: removeUnableToParseSyntax()
        }])

        let next = generate(ast)
        // console.log('i18n next code :>> ', next)


        let obj = null
        eval(`${next.code}\n obj = i18n`)

        if (obj) {
            obj.__filepath = fileName
        }
        // console.log('obj :>> ', obj)
        return obj
    } else {
        return null
    }
}

// // 测试
// analysis(ObjectProperty_Identifier_template, [
//     {
//         enter
//     }
// ])

module.exports = enter
