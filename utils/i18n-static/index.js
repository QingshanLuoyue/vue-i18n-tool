const babel = require('@babel/core')
const removeUnableToParseSyntax  = require('../parser/parser/remove-unable-to-parse-syntax.js')
const { traverse, generate }  = require('../parser/babel.js')

const staticI18n = function(filepath) {
    let result = babel.transformFileSync(filepath, {
        ast: true,
        presets: [
            require('@babel/preset-env')
        ]
    })
    traverse(result.ast, {
        enter: removeUnableToParseSyntax()
    })
    let content = generate(result.ast)
    // console.log('content :>> ', content.code)


    let i18nObj = null
    eval(`${content.code}\n i18nObj = zhCHS`)

    if (i18nObj) {
        i18nObj.__filepath = filepath
    }
    // console.log('chs :>> ', i18nObj);
    return i18nObj
}
exports.getStaticI18n = staticI18n
