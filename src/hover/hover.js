const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

const { getRootDir } = require('./utils')
// const { getRootDir } = require('./helper.js')

/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
function provideHover(document, position, token) {
    // console.log('token:>> ', token)
    console.log('当前文件解析对象 document:>> ', document)
    // 文件路径
    const fileName = document.fileName

    // 文件父级目录
    const workDir = path.dirname(fileName)
    console.log('父级目录 workDir :>> ', workDir);
    // 鼠标悬停范围
    // /\$t\(\'[^).]+\'\)/ 正则匹配 hover 的字符串范围
    // 如果没有就随便给个位置
    const range = document.getWordRangeAtPosition(position, /\$t\(\'[^).]+\'\)/) || [{ line: 0, character: 0 }]
    console.log('范围 range :>> ', range);

    // 通过鼠标悬停范围，截取单词
    const word = document.getText(range)
    console.log('截取单词 word:>> ', word)

    if (/\.vue$/.test(fileName)) {
        console.log('\n进入 provideHover 方法\n')

        // 设置起作用的目录白名单
        let whilteList = ['open-account-hk']

        // 获取当前文件对应的根目录
        let projectRootDir = getRootDir(workDir, whilteList)
        console.log('当前项目根目录 projectRootDir:>> ', projectRootDir)

        // 读取当前文件内容
        let fileContent = fs.readFileSync(fileName, { encoding: 'utf-8' })

        // 获取 script 中的内容
        let matchResult = fileContent.match(/<script>((.|\n|\t|\r)+)<\/script>/)
        // console.log('matchResult :>> ', matchResult)
        if (matchResult) {
            let scriptContent = matchResult[1]
            // console.log('scriptContent :>> ', scriptContent);
        }

        // let finalObj = {}
        // let i18nObject = ''
        // let i18nPath = ''
        // let onlyDefault = true
        // let x = generateObj(content, onlyDefault)
        // console.log('x :>> ', x);
        // if ((i18nObject = resolveI18nObject(content))) {
        //     finalObj = i18nObject
        // } else if ((i18nPath = resolveImportI18nPath(content, workDir))) {
        //     finalObj = i18nPath
        // }
        // let w = word.match(/\$t\('(.+)'\)/)[1]
        // console.log('项目根目录:>> ', projectDir, '\n\n')
        // return new vscode.Hover(`${finalObj.zhCHS[w]}`)
        return new vscode.Hover('1')
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
