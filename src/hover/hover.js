const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

const { getI18n } = require('../../utils/parser/index.js')
const { getStaticI18n } = require('../../utils/i18n-static/index.js')

// 缓存当前数据，只有重启IDE才会更新数据
const instance = {}

/**
 * 鼠标悬停提示，当鼠标停在package.json的dependencies或者devDependencies时，
 * 自动显示对应包的名称、版本号和许可协议
 * @param {*} document
 * @param {*} position
 * @param {*} token
 */
function provideHover(document, position, token) {
    let rootPath = vscode.workspace.rootPath
    // console.log('rootPath :>> ', rootPath);


    // console.log('token:>> ', token)
    // console.log('当前文件解析对象 document:>> ', document)
    // 文件路径
    const fileName = document.fileName
    // console.log('fileName :>> ', fileName)

    // 文件父级目录
    // const workDir = path.dirname(fileName)
    // console.log('父级目录 workDir :>> ', workDir);

    // 鼠标悬停范围
    // /\$t\(\'[^).]+\'\)/ 正则匹配 hover 的字符串范围
    // 如果没有就随便给个位置

    const range = document.getWordRangeAtPosition(position, /\$t\(\'[^)]+\'\)/) || [{ line: 0, character: 0 }]
    // console.log('范围 range :>> ', range);
    if (range.length < 2) {
        return
    }

    // 通过鼠标悬停范围，截取单词
    const word = document.getText(range)
    console.log('截取单词 word:>> ', word)

    if (/\.vue$/.test(fileName)) {
        // console.log('\n进入 provideHover 方法\n')

        // 设置起作用的目录白名单
        // let whilteList = ['open-account-hk']

        // 获取当前文件对应的根目录
        // let projectRootDir = getRootDir(workDir, whilteList)
        // console.log('当前项目根目录 projectRootDir:>> ', projectRootDir)

        let i18nKey = word.match(/\$t\('(.+)'\)/)[1]
        console.log('i18nKey :>> ', i18nKey)
        if (!i18nKey) {
            return
        }

        // 若存在当前页面多语言对象，则直接使用
        let i18nObj = null
        if (instance[fileName]) {
            console.log('hit i18nObj cache')
            i18nObj = instance[fileName]
        } else {
            console.log('get i18nObj')
            // 读取当前文件内容
            let fileContent = fs.readFileSync(fileName, { encoding: 'utf-8' })
            // 获取 script 中的内容
            let matchResult = fileContent.match(/<script[^>]*>((.|\n|\t|\r)+)<\/script>/)
            // console.log('matchResult :>> ', matchResult)
            if (matchResult) {
                let scriptContent = matchResult[1]
                // console.log('scriptContent :>> ', scriptContent)
                i18nObj = getI18n(scriptContent, fileName)['zhCHS']
                instance[fileName] = i18nObj
            }
        }
        console.log('Component >> i18nObj :>> ', i18nObj)

        let keys = i18nKey.split('.'), val = i18nObj
        keys.forEach(key => {
            if (val[key]) {
                val = val[key]
            } else {
                val = ''
            }
        })
        console.log('Component >>> i18nVal:>> ', val)

        if (!val) {
            let staticI18nObj = null
            let staticPath = fileName.replace(`${rootPath}`, '').replace(path.normalize('/src/pages/'), '').split(path.normalize('/')).slice(0, 2).join('/')
            console.log('staticPath :>> ', staticPath)

            if (instance[staticPath]) {
                console.log('hit static i18n cache')
                staticI18nObj = instance[staticPath]
            } else {
                staticI18nObj = getStaticI18n(path.resolve(rootPath, `./src/utils/i18n-message/${staticPath}/zh-chs.js`))
                instance[staticPath] = staticI18nObj
                console.log('get static i18n')
            }
            console.log('staticI18nObj :>> ', staticI18nObj);
            val = staticI18nObj
            keys.forEach(key => {
                if (val[key]) {
                    val = val[key]
                } else {
                    val = ''
                }
            })
            console.log('Static >>> i18nVal:>> ', val)
        }

        return new vscode.Hover(val)
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
// ${workspaceFolder} :表示当前workspace文件夹路径，也即/home/Coding/Test

// ${workspaceRootFolderName}:表示workspace的文件夹名，也即Test

// ${file}:文件自身的绝对路径，也即/home/Coding/Test/.vscode/tasks.json

// ${relativeFile}:文件在workspace中的路径，也即.vscode/tasks.json

// ${fileBasenameNoExtension}:当前文件的文件名，不带后缀，也即tasks

// ${fileBasename}:当前文件的文件名，tasks.json

// ${fileDirname}:文件所在的文件夹路径，也即/home/Coding/Test/.vscode

// ${fileExtname}:当前文件的后缀，也即.json

// ${lineNumber}:当前文件光标所在的行号

// ${env:PATH}:系统中的环境变量
