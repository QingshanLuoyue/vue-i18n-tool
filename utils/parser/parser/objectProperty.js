// const { objectProperty_commonJson, exportDefaultZhCHS } = require('../js-script-template/index.js')
const {
    // analysis,
    generate
} = require('../babel.js')

const enter = function(path, keyName = 'i18n') {
    let node = path.node
    // console.log('node :>> ', node);
    // if (node.type === 'ExportDefaultDeclaration') {
    //     let originStringCode = generate(node.declaration)
    //     console.log('i18n string code :>> ', originStringCode)
    // }
    if (node.type === 'ObjectProperty' && node.key.name === keyName && node.value.type === 'ObjectExpression') {
        let originStringCode = generate(node.value)
        // console.log('i18n string code :>> ', originStringCode)

        let obj = null
        eval(`obj = ${originStringCode.code}`)
        // console.log('obj :>> ', obj)
        return obj
    } else {
        return null
    }
}

// // 测试
// analysis(exportDefaultZhCHS, [
//     {
//         enter
//     }
// ])

module.exports = enter
