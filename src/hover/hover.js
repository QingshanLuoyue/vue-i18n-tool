const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

const { resolveI18nObject, resolveImportI18nPath, getRootDir } = require('./utils')

/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
function provideHover(document, position, token) {
    const fileName = document.fileName // 文件路径
    const workDir = path.dirname(fileName) // 文件父级目录
    const range = document.getWordRangeAtPosition(position, /\$t\(\'[^).]+\'\)/) || [{ line: 0, character: 0 }] // 鼠标悬停范围
    const word = document.getText(range) // 通过鼠标悬停范围，截取单词
    console.log('document:>> ', document)
    console.log('word:>> ', word)
    console.log('token:>> ', token)

    if (/\.vue$/.test(fileName)) {
        console.log('进入 provideHover 方法')
        let whilteList = ['open-account-hk']
        let projectDir = getRootDir(workDir, whilteList)

        // 读取当前文件内容
        let content = fs.readFileSync(fileName, { encoding: 'utf-8' })

        // 获取 script 中的内容
        let matchScriptContent = content.match(/<script>((.|\n|\t|\r)+)<\/script>/)
        // console.log('matchScriptContent :>> ', matchScriptContent)
        if (matchScriptContent) {
            content = matchScriptContent[1]
        }

        let finalObj = {}
        let i18nObject = ''
        let i18nPath = ''
        if ((i18nObject = resolveI18nObject(content))) {
            finalObj = i18nObject
        } else if ((i18nPath = resolveImportI18nPath(content, workDir))) {
            finalObj = i18nPath
        }
        let w = word.match(/\$t\('(.+)'\)/)[1]
        console.log('项目根目录:>> ', projectDir, '\n\n')
        return new vscode.Hover(`${finalObj.zhCHS[w]}`)
    }
}

module.exports = function (context) {
    // 注册鼠标悬停提示
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('vue', {
            provideHover,
        })
    )
}
