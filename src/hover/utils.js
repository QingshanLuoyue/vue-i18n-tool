const path = require('path')
const fs = require('fs')

// 组装对象
// 传入的数组：
// export const| let propName = {
//     zh: { },
//     en: {}
// }
function composeObj(matchI18nContent, propName = 'i18n') {
    let inMap = ['{']
    let outMap = ['}']
    let stack = []
    let i18nObjectArr = []
    let i18nArr = []

    // 截取定义该对象之后（包含自己）的字符串
    let reg = new RegExp(`(export)?(const|let)${propName}=`, 'g')
    matchI18nContent = matchI18nContent.split('\n')
    for (let i = 0; i < matchI18nContent.length; i++) {
        const matchResult = matchI18nContent[i].replace(/\s/g, '').match(reg)
        if (matchResult) {
            i18nObjectArr = matchI18nContent.slice(i)
            break
        }
    }
    // 根据 大括号 配对的原则，得到 整个对象字符串
    for (let i = 0; i < i18nObjectArr.length; i++) {
        const element = i18nObjectArr[i]
        for (const word of element) {
            if (inMap.includes(word)) {
                stack.push(word)
            }
            if (outMap.includes(word)) {
                stack.pop()
            }
        }
        console.log('element :>> ', element)
        // 使用 大括号的完整性，来截取 i18n 对象
        // 此处展示不支持 扩展符号 ...
        if (element.replace(/\s/g, '').match(/^\.\.\.[^:.]+/)) {
            console.log('...对象:>> ', element)
            i18nArr[i18nArr.length - 1] = i18nArr[i18nArr.length - 1].replace(/,/g, '')
        } else {
            i18nArr.push(element)
        }
        if (stack.length === 0) {
            // 去掉最后一个逗号，如果有的话
            i18nArr[i18nArr.length - 1] = i18nArr[i18nArr.length - 1].replace(/,/, '')
            break
        }
    }
    // 1. 合并数组
    // 2. 去掉空格
    // 3. 去掉 export(const|let)${propName}= 字符串
    // 4. 转换 单引号|反引号 为 双引号
    // 5. 将对象的 key 用 双引号 包起来
    let final = i18nArr
        .join('')
        .replace(/\s/g, '')
        .replace(reg, '')
        .replace(/('|`)/g, '"')
        .replace(/(\w+):/g, (w, w2) => {
            // w2 是括号匹配的内容
            return `"${w2}":`
        })
    // console.log('before:JSON.parse:字符串:>> ', final)
    if (final) {
        let parseObj = JSON.parse(final)
        // console.log('JSON.parse:处理后对象:>> ', parseObj)
        return parseObj
    }
}

// 处理内部组件定义 i18n 对象
// export default {
//     prop: {

//     },
//     i18n: {
//         zh: {

//         },
//         en: {

//         }
//     }
// }
exports.resolveI18nObject = function (str) {
    if (!str) {
        console.log('resolveI18nObject:str 为空:>> ')
        return
    }
    let splitArr = str.split('\n')

    let exportRes = []
    for (let i = 0; i < splitArr.length; i++) {
        const element = splitArr[i]
        if (element.indexOf('export default') > -1) {
            // 截取 'export default' 之后的 代码
            exportRes = splitArr.slice(i + 1)
            break
        }
    }

    let i18nRes = []
    for (let i = 0; i < exportRes.length; i++) {
        const element = exportRes[i]
        if (element.indexOf('i18n') > -1) {
            // 截取 'i18n' (包括当前)之后的 代码
            i18nRes = exportRes.slice(i)
            break
        }
    }
    if (i18nRes.length === 0) {
        // 不存在 i18n 的话，返回 false
        return
    }
    // 若是 外部引入的 i18n 则不处理
    if (i18nRes[0].indexOf('i18n,') > -1) {
        return
    }
    let inMap = ['{']
    let outMap = ['}']
    let stack = []
    let i18nArr = []
    for (let i = 0; i < i18nRes.length; i++) {
        const element = i18nRes[i]
        for (const word of element) {
            if (inMap.includes(word)) {
                stack.push(word)
            }
            if (outMap.includes(word)) {
                stack.pop()
            }
        }
        // 使用 大括号的完整性，来截取 i18n 对象
        i18nArr.push(element)
        if (stack.length === 0) {
            break
        }
    }
    // 1. 合并数组
    // 2. 去掉空格
    // 3. 去掉 i18n: 字符串
    // 4. 转换 单引号 为 双引号
    // 5. 去掉最后一个 逗号
    // 6. 将对象的 key 用 双引号 包起来
    let final = i18nArr
        .join('')
        .replace(/\s/g, '')
        .replace(/i18n:/, '')
        .replace(/('|`)/g, '"')
        .slice(0, -1)
        .replace(/(\w+):/g, (w, w2) => {
            // w2 是括号匹配的内容
            return `"${w2}":`
        })
    console.log('before:JSON.parse:final:>> ', final)
    if (final) {
        let parseObj = JSON.parse(final)
        console.log('JSON.parse:final:>> ', parseObj)
        return parseObj
    }
    return
}

// 处理使用 外部引入的 i18n 对象
// import { i18n } from 'xxx.js'
// export default {
//     prop: {

//     },
//     i18n,
// }
exports.resolveImportI18nPath = function (str, workDir) {
    if (!str) {
        console.log('resolveImportI18nPath:str 为空:>> ')
        return
    }
    let splitArr = str.split('\n')

    let importRes = []
    for (const item of splitArr) {
        if (item.indexOf('export default') > -1) {
            break
        }
        // 截取 'export default' 之前的 import 代码
        importRes.push(item)
    }
    console.log('importRes:>> ', importRes)
    let i18nImportline = ''
    importRes.forEach((line) => {
        // 使用 'i18n' 关键字得到 import i18n 的那行代码
        if (line.indexOf('i18n') > -1) {
            i18nImportline = line
        }
    })
    // 返回 from 后面的 路径
    let i18nImportUrl = i18nImportline.replace(/(\s|')/g, '').split('from')[1]
    let absoluteImportUrl = path.resolve(workDir, `${i18nImportUrl}.js`)
    console.log('absoluteImportUrl :>> ', absoluteImportUrl)

    let i18nContent = fs.readFileSync(absoluteImportUrl, { encoding: 'utf8' })
    let i18nObject = composeObj(i18nContent)
    console.log('i18nObject :>> ', i18nObject)
    return i18nObject
}

// 计算项目根目录，最大向上查询 15 层级
exports.getRootDir = function (fileDir, whilteList = []) {
    let projectRootDir = fileDir
    let flag = false
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
    return projectRootDir
}
