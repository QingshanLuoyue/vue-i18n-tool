const readline = require('readline')
const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

const { getI18n } = require('../../utils/parser/index.js')
const { getStaticI18n } = require('../../utils/i18n-static/index.js')

// 缓存当前数据，只有重启IDE才会更新数据
const instance = {}

/**
 * 鼠标悬停提示，
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
    // console.log('截取单词 word:>> ', word)

    if (/\.vue$/.test(fileName)) {
        // console.log('\n进入 provideHover 方法\n')

        let i18nKey = word.match(/\$t\('(.+)'\)/)[1]
        // console.log('i18nKey :>> ', i18nKey)
        if (!i18nKey) {
            return
        }

        let i18nObj = null
        // if (instance[fileName]) {
        //     // 若当前页面存在多语言对象，则直接使用
        //     // console.log('hit i18nObj cache')
        //     i18nObj = instance[fileName]
        // } else {
            // console.log('get i18nObj')
            // 读取当前文件内容
            let fileContent = fs.readFileSync(fileName, { encoding: 'utf-8' })

            // 获取整个 script（包含） 的内容
            let matchResult = fileContent.match(/<script[^>]*>((.|\n|\t|\r)+)<\/script>/)
            let isTs = fileContent.match(/<script([^>]*)>((.|\n|\t|\r)+)<\/script>/)[1].indexOf('ts') > -1 ? true : false
            // console.log('isTs :>> ', isTs);
            // console.log('matchResult :>> ', matchResult)
            if (matchResult) {
                let scriptContent = matchResult[1]
                // console.log('scriptContent :>> ', scriptContent)
                i18nObj = getI18n(scriptContent, isTs, fileName)
                if (i18nObj) {
                    i18nObj.zhCHS.__filepath = i18nObj.__filepath
                }
                // console.log('origin i18nObj :>> ', i18nObj);
                i18nObj = i18nObj ? i18nObj['zhCHS'] : i18nObj
                instance[fileName] = i18nObj
            }
        // }
        // console.log('Component >> i18nObj :>> ', i18nObj)
        let keys = i18nKey.split('.'), val = i18nObj
        if (val) {
            keys.forEach(key => {
                if (val[key]) {
                    val = val[key]
                } else {
                    val = ''
                }
            })
        }
        // console.log('Component >>> i18nVal:>> ', val)

        // 当前组件匹配不到多语言，则去静态目录匹配
        if (!val) {
            let staticI18nObj = null
            let staticPath = fileName.replace(`${rootPath}`, '').replace(path.normalize('/src/pages/'), '').split(path.normalize('/')).slice(0, 2).join('/')
            // console.log('staticPath :>> ', staticPath)

            // if (instance[staticPath]) {
            //     // console.log('hit static i18n cache')
            //     staticI18nObj = instance[staticPath]
            // } else {
                staticI18nObj = getStaticI18n(path.resolve(rootPath, `./src/utils/i18n-message/${staticPath}/zh-chs.js`))
                instance[staticPath] = staticI18nObj
                // console.log('get static i18n')
            // }
            // console.log('staticI18nObj :>> ', staticI18nObj);
            val = staticI18nObj
            keys.forEach(key => {
                if (val[key]) {
                    val = val[key]
                } else {
                    val = ''
                }
            })
            // console.log('Static >>> i18nVal:>> ', val)
        }

        return new vscode.Hover(val ? JSON.stringify(val) : `* 没有匹配 \n* 或者是 \n* 无法处理的语法已被过滤`)
    }
}


async function provideDefinition(document, position, token) {
    let rootPath = vscode.workspace.rootPath
    // console.log('rootPath :>> ', rootPath);

    // 文件路径
    const fileName = document.fileName
    // console.log('fileName :>> ', fileName)

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
    // console.log('截取单词 word:>> ', word)

    if (/\.vue$/.test(fileName)) {
        // console.log('\n进入 provideHover 方法\n')

        let i18nKey = word.match(/\$t\('(.+)'\)/)[1]
        // console.log('i18nKey :>> ', i18nKey)
        if (!i18nKey) {
            return
        }

        let i18nObj = instance[fileName]
        let staticPath = fileName.replace(`${rootPath}`, '').replace(path.normalize('/src/pages/'), '').split(path.normalize('/')).slice(0, 2).join('/')
        let staticI18nObj = instance[staticPath]
        // console.log('staticI18nObj :>> ', staticI18nObj);

        // console.log('定位：i18nObj :>> ', i18nObj);
        let keys = i18nKey.split('.'), hitCol = 0, filepath = ''

        if (i18nObj) {
            // 逐行读取文件，判断 i18nKey 是否在当前行字符串中
            hitCol = await readFileByline(i18nObj, keys)
            filepath = i18nObj.__filepath
        }
        if (hitCol === 0 && staticI18nObj) {
            hitCol = await readFileByline(staticI18nObj, keys)
            filepath = staticI18nObj.__filepath
        }
        // console.log('filepath :>> ', filepath);
        return new vscode.Location(vscode.Uri.file(filepath), new vscode.Position(hitCol, 100));
    }
}
async function readFileByline(i18nObj, keys) {
    let col = 0, idx = 0, hitCol = 0, len = keys.length
    const readStrream = fs.createReadStream(i18nObj.__filepath)
    const rl = readline.createInterface({
        input: readStrream
    })
    await new Promise(resolve => {
        rl.on('line', input => {
            if (idx <= len - 1 && input.indexOf(` ${keys[idx]}:`) > -1) {
                // console.log('static input :>> ', input);
                hitCol = col
                // console.log('static 命中 行数为:>> ', hitCol, '行');

                idx++
            }
            col++
        })
        rl.on('close', () => {
            // console.log('static rl close :>> ', hitCol);
            resolve()
        })
    })
    return hitCol
}
module.exports = function (context) {
    // 注册鼠标悬停提示
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('vue', {
            provideHover,
        })
    )
    // 注册如何实现跳转到定义，第一个参数表示仅对vue文件生效
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(['vue'], {
        provideDefinition
    }))
}
