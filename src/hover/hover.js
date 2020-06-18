const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

const { resolveI18nObject, resolveImportI18nPath } = require('./utils')

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
    const range = document.getWordRangeAtPosition(position, /\$t\(\'.+\'\)/) || [{ line: 0, character: 0 }] // 鼠标悬停范围
    const word = document.getText(range) // 通过鼠标悬停范围，截取单词
    console.log('\n\ndocument:>> ', document)
    console.log('word:>> ', word)
    console.log('token:>> ', token)

    if (/\.vue$/.test(fileName)) {
        console.log('进入provideHover方法')
        let whilteList = ['open-account-hk']
        let projectRootDir = workDir
        let flag = false

        let content = fs.readFileSync(fileName, { encoding: 'utf-8' })

        // 获取 script 中的内容
        let matchScriptContent = content.match(/<script>(.|\n)+<\/script>/)
        if (matchScriptContent) {
            content = matchScriptContent[0].replace(/(<script>|<\/script>)/g, '')
        }

        let i18nObject = resolveI18nObject(content)
        let i18nPath = ''
        if (!i18nObject) {
            i18nPath = resolveImportI18nPath(content)
        }

        // 计算项目根目录，最大向上查询 15 层级
        for (let i = 0; i < 15; i++) {
            whilteList.forEach((projectName) => {
                if (projectRootDir.split('\\').pop() === projectName) {
                    flag = true
                }
            })
            if (flag) {
                break
            }
            projectRootDir = path.dirname(projectRootDir)
        }
        console.log('项目根目录:projectRootDir:>> ', projectRootDir)
        if (i18nObject) {
            let w = word.match(/\$t\('(.+)'\)/)[1]
            console.log('w :>> ', w)
            return new vscode.Hover(`${i18nObject.zhCHS[w]}`)
        }
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
