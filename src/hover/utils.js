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
        .replace(/'/g, '"')
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
exports.resolveImportI18nPath = function (str) {
    if (!str) {
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
    i18nImportline = i18nImportline.replace(/\s/g, '').split('from')[1]
    console.log('i18nImportline :>> ', i18nImportline)
    return i18nImportline
}
