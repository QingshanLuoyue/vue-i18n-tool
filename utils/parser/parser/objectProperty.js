// const { objectProperty_commonJson } = require('../js-script-template/index.js')
const {
    // analysis,
    generate
} = require('../babel.js')

const enter = function(path) {
    let node = path.node
    if (node.type === 'ObjectProperty' && node.key.name === 'i18n' && node.value.type === 'ObjectExpression') {
        let originStringCode = generate(node.value)
        console.log('i18n string code :>> ', originStringCode)

        let obj = null
        eval(`obj = ${originStringCode.code}`)
        console.log('obj :>> ', obj)
        return obj
    } else {
        return null
    }
}

// // 测试
// analysis(objectProperty_commonJson, [
//     {
//         enter
//     }
// ])

module.exports = enter
