const fs = require('fs')
const path = require('path')
const { generate, analysis } = require('../babel');

// let { objectProperty_import } = require('../js-script-template/index.js')
let removeUnableToParseSyntax = require('./remove-unable-to-parse-syntax.js')

let importName = ''
let importUrl = ''

const hitEnter = function(path) {
    let node = path.node
    // console.log('hitEnter node :>> ', node);
    if (node.type === 'ObjectProperty' && node.key.name === 'i18n' && node.value.type === 'Identifier') {
        importName = node.value.name
        return true
    }
}
const getImportUrl = function(path) {
    let node = path.node
    if (node.type === 'ImportDeclaration') {
        for (const specifier of node.specifiers) {
            if (specifier.local.name === importName) {
                importUrl = node.source.value
                return
            }
        }
    }
}

const getI18n = function(fileName) {
    let i18nObj = null
    let avalableUrl = path.resolve(path.dirname(fileName), importUrl)
    // console.log('fileName :>> ', fileName)
    // console.log('importUrl :>> ', importUrl)
    // console.log('avalableUrl :>> ', avalableUrl)
    let finalUrl = ''
    if (fs.existsSync(avalableUrl)) {
        let x  = fs.statSync(avalableUrl)
        if (x.isDirectory()) {
            finalUrl = `${avalableUrl}${path.normalize('/index.js')}`
        } else {
            finalUrl = avalableUrl
        }
    } else {
        finalUrl = `${avalableUrl}.js`
    }
    // console.log('finalUrl :>> ', finalUrl);
    let importContent = fs.readFileSync(finalUrl, { encoding: 'utf8'})
    // console.log('importContent :>> ', importContent)

    analysis(importContent, [
        {
            // 预处理调不能处理的语法
            enter: removeUnableToParseSyntax()
        },
        {
            enter(path) {
                let node = path.node
                // const i18n = {} 形式
                if (node.type === 'VariableDeclarator' && node.id.name === importName) {
                    let originStringCode = generate(node)
                    // console.log('importContent importName :>> ', importName)
                    // console.log('importContent string code :>> ', originStringCode)

                    eval(`i18nObj = ${originStringCode.code}`)
                    // console.log('importContent i18nObj :>> ', i18nObj)
                    i18nObj.__filepath = finalUrl
                    return
                }
            }
        }
    ])
    if (!i18nObj) {
        // 若不是  const i18n = {} 形式
        // 而是
        // export default  {
        //     zhCHS: {}
        // }
        analysis(importContent, [
            {
                // 预处理调不能处理的语法
                enter: removeUnableToParseSyntax
            },
            {
                enter(path) {
                    let node = path.node
                    if (node.type === 'ExportDefaultDeclaration') {
                        let originStringCode = generate(node.declaration)
                        // console.log('ExportDefaultDeclaration string code :>> ', originStringCode)
                        eval(`i18nObj = ${originStringCode.code}`)
                        // console.log('ExportDefaultDeclaration i18nObj :>> ', i18nObj)
                        i18nObj.__filepath = finalUrl

                        return i18nObj
                    }
                }
            }
        ])
    }
    return i18nObj
}


// // 测试
// analysis(objectProperty_import, [
//     {
//         enter: hitEnter
//     },
//     {
//         enter: getImportUrl
//     }
// ])
// console.log('importUrl :>> ', importUrl)

// getI18n('d:/webpacksdf')



module.exports = {
    hitEnter,
    getImportUrl,
    getI18n
}
