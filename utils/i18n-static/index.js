const babel = require('@babel/core')

const staticI18n = function(dir) {
    let content = babel.transformFileSync(dir, {
        presets: [
            require('@babel/preset-env')
        ]
    })
    // console.log('content :>> ', content.code)


    let i18nObj = null
    eval(`${content.code}\n i18nObj = zhCHS`)

    // console.log('chs :>> ', i18nObj);
    return i18nObj
}
exports.getStaticI18n = staticI18n
