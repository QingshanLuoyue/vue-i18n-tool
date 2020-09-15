// const { ObjectProperty_Identifier_template } = require('../js-script-template/index.js')
const {
    analysis,
    generate
} = require('../babel.js')

const removeUnableToParseSyntax = require('./remove-unable-to-parse-syntax.js')

const enter = function(path, parentAst, keyName = 'i18n') {
    let node = path.node
    // console.log('node :>> ', node);
    // if (node.type === 'ExportDefaultDeclaration') {
    //     let originStringCode = generate(node.declaration)
    //     console.log('i18n string code :>> ', originStringCode)
    // }
    if (node.type === 'ObjectProperty' && node.key.name === keyName && node.value.type === 'ObjectExpression') {
        let originStringCode = generate(node.value)
        console.log('i18n string code :>> ', originStringCode)

        let { ast } = analysis(originStringCode, [{
            enter: removeUnableToParseSyntax()
        }])

        let next = generate(ast)
        console.log('i18n next code :>> ', next)


        let obj = null
        eval(`obj = ${originStringCode.code}`)
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
