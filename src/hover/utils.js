const path = require('path')
// const fs = require('fs')

// 组装对象
// 传入的数组：
// export const| let propName = {
//     zh: { },
//     en: {}
// }
// function composeObj(matchI18nContent, propName = 'i18n', defineKeyMatchReg = new RegExp(`(export)?(const|let)?${propName}(=|:)?`, 'g')) {
//     let inMap = ['{']
//     let outMap = ['}']
//     let stack = []
//     let i18nObjectArr = []
//     let i18nArr = []

//     // 截取定义该对象之后（包含自己）的字符串
//     matchI18nContent = matchI18nContent.split('\n')
//     for (let i = 0; i < matchI18nContent.length; i++) {
//         const matchResult = matchI18nContent[i].replace(/\s/g, '').match(defineKeyMatchReg)
//         if (matchResult) {
//             i18nObjectArr = matchI18nContent.slice(i)
//             break
//         }
//     }
//     // 根据 大括号 配对的原则，得到 整个对象字符串
//     for (let i = 0; i < i18nObjectArr.length; i++) {
//         const element = i18nObjectArr[i]
//         for (const word of element) {
//             if (inMap.includes(word)) {
//                 stack.push(word)
//             }
//             if (outMap.includes(word)) {
//                 stack.pop()
//             }
//         }
//         // 使用 大括号的完整性，来截取 i18n 对象
//         // 此处展示不支持 扩展符号 ...
//         if (element.replace(/\s/g, '').match(/^\.\.\.[^:.]+/)) {
//             // console.log('...对象:>> ', element)
//             // 处理 逗号
//             // 若删除的 扩展符号对象处在属性最后一行，则上一行需要删除 逗号
//             if (element.replace(/\s/g, '').slice(-1) !== ',') {
//                 i18nArr[i18nArr.length - 1] = i18nArr[i18nArr.length - 1].replace(/,/g, '')
//             }
//         } else {
//             i18nArr.push(element)
//         }
//         if (stack.length === 0) {
//             // 去掉最后一个逗号，如果有的话
//             i18nArr[i18nArr.length - 1] = i18nArr[i18nArr.length - 1].replace(/,/, '')
//             break
//         }
//     }
//     // 1. 合并数组
//     // 2. 去掉空格
//     // 3. 去掉 export(const|let)${propName}= 字符串
//     // 4. 转换 单引号|反引号 为 双引号
//     // 5. 将对象的 key 用 双引号 包起来
//     let final = i18nArr
//         .join('')
//         .replace(/\s/g, '')
//         .replace(defineKeyMatchReg, '')
//         .replace(/('|`)/g, '"')
//         .replace(/(\w+):/g, (w, w2) => {
//             // w2 是括号匹配的内容
//             return `"${w2}":`
//         })
//     // console.log('before:JSON.parse:字符串:>> ', final)
//     if (final) {
//         let parseObj = JSON.parse(final)
//         // console.log('JSON.parse:处理后对象:>> ', parseObj)
//         return parseObj
//     }
// }

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
// exports.resolveI18nObject = function (str) {
//     if (!str) {
//         console.log('resolveI18nObject:str 为空:>> ')
//         return
//     }
//     let splitArr = str.split('\n')

//     let exportRes = []
//     for (let i = 0; i < splitArr.length; i++) {
//         const element = splitArr[i]
//         if (element.indexOf('export default') > -1) {
//             // 截取 'export default' 之后的 代码
//             exportRes = splitArr.slice(i + 1)
//             break
//         }
//     }

//     let i18nRes = []
//     for (let i = 0; i < exportRes.length; i++) {
//         const element = exportRes[i]
//         if (element.replace(/\s/g, '').indexOf('i18n:{') > -1) {
//             // 截取 'i18n' (包括当前)之后的 代码
//             i18nRes = exportRes.slice(i)
//             break
//         }
//     }
//     if (i18nRes.length === 0) {
//         // 不存在 i18n 的话，返回 false
//         return
//     }
//     // 若是 外部引入的 i18n 则不处理
//     if (i18nRes[0].indexOf('i18n,') > -1) {
//         return
//     }
//     let inMap = ['{']
//     let outMap = ['}']
//     let stack = []
//     let i18nArr = []
//     for (let i = 0; i < i18nRes.length; i++) {
//         const element = i18nRes[i]
//         for (const word of element) {
//             if (inMap.includes(word)) {
//                 stack.push(word)
//             }
//             if (outMap.includes(word)) {
//                 stack.pop()
//             }
//         }
//         // 使用 大括号的完整性，来截取 i18n 对象
//         i18nArr.push(element)
//         if (stack.length === 0) {
//             break
//         }
//     }
//     // 1. 合并数组
//     // 2. 去掉空格
//     // 3. 去掉 i18n: 字符串
//     // 4. 转换 单引号 为 双引号
//     // 5. 去掉最后一个 逗号
//     // 6. 将对象的 key 用 双引号 包起来
//     let final = i18nArr
//         .join('')
//         .replace(/\s/g, '')
//         .replace(/i18n:/, '')
//         .replace(/('|`)/g, '"')
//         .slice(0, -1)
//         .replace(/(\w+):/g, (w, w2) => {
//             // w2 是括号匹配的内容
//             return `"${w2}":`
//         })
//     console.log('before:JSON.parse:final:>> ', final)
//     if (final) {
//         let parseObj = JSON.parse(final)
//         console.log('JSON.parse:final:>> ', parseObj)
//         return parseObj
//     }
//     return
// }

// 处理使用 外部引入的 i18n 对象
// import { i18n } from 'xxx.js'
// export default {
//     prop: {

//     },
//     i18n,
// }
// exports.resolveImportI18nPath = function (str, workDir) {
//     if (!str) {
//         console.log('resolveImportI18nPath:str 为空:>> ')
//         return
//     }
//     let splitArr = str.split('\n')

//     let importRes = []
//     for (const item of splitArr) {
//         if (item.indexOf('export default') > -1) {
//             break
//         }
//         // 截取 'export default' 之前的 import 代码
//         importRes.push(item)
//     }
//     console.log('importRes:>> ', importRes)
//     let i18nImportline = ''
//     importRes.forEach((line) => {
//         // 使用 'i18n' 关键字得到 import i18n 的那行代码
//         if (line.indexOf('i18n') > -1) {
//             i18nImportline = line
//         }
//     })
//     // 返回 from 后面的 路径
//     let i18nImportUrl = i18nImportline.replace(/(\s|')/g, '').split('from')[1]
//     let absoluteImportUrl = path.resolve(workDir, `${i18nImportUrl}.js`)
//     console.log('absoluteImportUrl :>> ', absoluteImportUrl)

//     let i18nContent = fs.readFileSync(absoluteImportUrl, { encoding: 'utf8' })
//     let i18nObject = composeObj(i18nContent)
//     console.log('i18nObject :>> ', i18nObject)
//     return i18nObject
// }

let handles = {
    'export': stringToObj,
    'exportDefault': stringToDefaultObj,
    'function': function() { return {} }
}
exports.generateObj = function(jsContent, startIndex = 0, endIndex = jsContent.length) {
    let exportReg = /(export)?(\s+)?(const|let)(.+)=/,
        exportDefaultReg = /export\s*default\s*/,
        // functionReg = /^([^:.]+)(:function)?\(\){$/,
        inList = ['{'],
        outList = ['}'],
        stack = [],
        collectLineList = [],
        collected = false,
        matchResult = null,
        codeLine = '',
        exportName = '',
        exportObj = {},
        handleName = ''

    // 截取定义该对象之后（包含自己）的字符串
    jsContent = jsContent.split('\n')
    for (let i = startIndex; i < endIndex; i++) {
        codeLine = jsContent[i] || ''
        if (!collected) {
            // 若不是收集状态，需要进行匹配操作，进行新一轮的收集
            if (matchResult = codeLine.match(exportReg)) {
                exportName = matchResult[4] && matchResult[4].trim()
                handleName = 'export'
                console.log('exportReg:Result:>> ', matchResult)
            } else if (matchResult = codeLine.match(exportDefaultReg)) {
                handleName = 'exportDefault'
                console.log('exportDefaultReg:Result:>> ', matchResult)
            }
            // else if (matchResult = codeLine.match(functionReg)) {
            //     handleName = 'function'
            //     exportName = matchResult[1]
            //     console.log('functionReg:Result:>> ')
            // }
        }
        // 若有匹配结果，或者处于收集状态
        if (matchResult || collected) {
            collected = true

            // 使用 大括号的完整性，来截取 对象
            for (const word of codeLine) {
                if (inList.includes(word)) {
                    stack.push(word)
                }
                if (outList.includes(word)) {
                    stack.pop()
                }
            }

            // 收集行代码
            collectLinesToGenerateObj(codeLine, collectLineList)

            if (stack.length === 0) {
                // 去掉最后一个逗号，如果有的话
                collectLineList[collectLineList.length - 1] = collectLineList[collectLineList.length - 1].replace(/,/, '')
                if (handleName === 'exportDefault') {
                    exportObj['default'] = handles[handleName](collectLineList, exportDefaultReg, exportObj)
                } else if(handleName === 'export') {
                    exportObj[exportName] = handles[handleName](collectLineList.join(''), exportReg)
                }
                // else if(handleName === 'function') {
                //     exportObj[exportName] = handles[handleName]()
                // }
                collectLineList = []
                // stack 数组为空，匹配一个对象完全，关闭收集
                collected = false
            }
        }
    }
    return exportObj
}
/**
 * 收集用于生成 对象 的每行代码
 */
function collectLinesToGenerateObj(codeLine, collectLineList) {
    // 此处展示不支持 扩展符号 ...
    if (codeLine.replace(/\s/g, '').match(/^\.\.\.[^:.]+/)) {
        // console.log('...对象:>> ', codeLine)
        // 处理 逗号
        // 若删除的 扩展符号对象处在属性最后一行，则上一行需要删除 逗号
        if (codeLine.replace(/\s/g, '').slice(-1) !== ',') {
            collectLineList[collectLineList.length - 1] = collectLineList[collectLineList.length - 1].replace(/,/g, '')
        }
    } else {
        collectLineList.push(codeLine)
    }
}
/**
 * 解析 string 返回一个对象
 * string 必须是一个符合编写规范的 对象字符串，否则会解析失败
 */
function stringToObj(string, exportReg) {
    if (!string) {
        throw 'stringToObj: string 参数为空'
    }
    // 1. 合并数组
    // 2. 去掉空格
    // 3. 去掉 export(const|let)${propName}= 字符串
    // 4. 转换 单引号|反引号 为 双引号
    // 5. 将对象的 key 用 双引号 包起来
    let objstr = string
        .replace(/\s/g, '')
        .replace(exportReg, '')
        .replace(/('|`)/g, '"')
        .replace(/(\w+):/g, (w, w2) => {
            // w2 是括号匹配的内容
            return `"${w2}":`
        })
    console.log('before:JSON.parse:字符串:>> ', objstr)
    try {
        let parsedObj = JSON.parse(objstr)
        // console.log('JSON.parse:处理后对象:>> ', parsedObj)
        return parsedObj
    } catch (e) {
        console.log('stringToObj:e:>> ', e)
    }
}
/**
 * 解析 string 返回一个 export default 对象
 * string 必须是一个符合编写规范的 对象字符串，否则会解析失败
 */
function stringToDefaultObj(collectLineList, exportDefaultReg, exportObj) {
    if (!collectLineList || collectLineList.length === 0) {
        throw 'stringToDefaultObj: collectLineList 参数为空'
    }
    let inList = ['{'],
        outList = ['}'],
        stack = [], funResolveObj = { funCollectFlag: false, funKey: ''}

    let commentReg = /\/\/.+/g, // 注释
        setValBySameName = /^[^:{}/]+,?$/g, // 同名赋值
        setValByOtherName = /^([^\[\]]+):([^{.\/]+),?$/, // 使用其他变量名赋值
        setValByBracketVar = /^(\[.+\]):(.+)$/, // 使用中括号赋值
        setValByFunction = /^([\w]+)(:)?(function)?\(.*\)(=>)?{$/, // 函数赋值
        setValByQuoteFunction = /^'(.+)'(:)?(function)?\(.*\)(=>)?{$/, // 函数赋值
        setValByCompeleteFunction = /^([^:.]+)(:)?(function)?\(.*\)(=>)?\{.*\},?/ // 单行完整函数赋值

    let matchLineResult = null
    let resolveLineList = []
    let joinString = ''
    collectLineList.forEach((line, index) => {
        line = line.replace(/\s/g, '').replace(commentReg, '')
        if (index === 0 || index === collectLineList.length - 1) {
            resolveLineList.push(line)
            return
        }
        // if (line.match(commentReg)) {
        //     return
        // }
        if (funResolveObj.funCollectFlag) {
            // 使用 大括号的完整性，来截取 对象
            for (const word of line) {
                if (inList.includes(word)) {
                    stack.push(word)
                }
                if (outList.includes(word)) {
                    stack.pop()
                }
            }
            if (stack.length === 0) {
                let isQuote = line.indexOf(',') > -1 ? ',' : ''
                funResolveObj.funCollectFlag = false
                resolveLineList.push(`"${funResolveObj.funKey}":"function(){}"${isQuote}`)
                funResolveObj = { funCollectFlag: false, funKey: ''}
            }
            return
        }
        if (matchLineResult = line.match(setValBySameName)) {
            // 同名赋值
            // 匹配结果：[ 'i18n,' ]
            console.log('同名赋值:matchLineResult :>> ', matchLineResult);
            let isQuote = matchLineResult[0].indexOf(',') > -1 ? ',' : ''
            let key = matchLineResult[0].replace(/,/g, '')
            let val = exportObj[key] ? `${JSON.stringify(exportObj[key])}${isQuote}` : `{}${isQuote}`
            resolveLineList.push(`"${key}":${val}`)
            return
        } else if (matchLineResult = line.match(setValByOtherName)) {
            // 使用其他变量名赋值
            // 匹配结果：[ 'i18n: youxin,', 'i18n', ' youxin,' ,index: 0,input: 'i18n: youxin,',groups: undefined ]
            console.log('使用其他变量名赋值:matchLineResult :>> ', matchLineResult);
            let key = matchLineResult[1]
            let isQuote = matchLineResult[2].indexOf(',') > -1 ? ',' : ''
            let otherKey = matchLineResult[2].replace(/,/g, '')
            let val = exportObj[otherKey] ? `${JSON.stringify(exportObj[otherKey])}${isQuote}` : `"${otherKey}"${isQuote}`
            resolveLineList.push(`"${key}":${val}`)
            return

        } else if (matchLineResult = line.match(setValByBracketVar)) {
            // 使用中括号赋值
            // 匹配结果：[ '[xx.yy]: xx.yy', '[xx.yy]', 'xx.yi,', index: 0, input: '[xx.yy]: xx.yy', groups: undefined ]
            console.log('使用中括号赋值:matchLineResult :>> ', matchLineResult);
            let key = matchLineResult[1].replace(/,/g, '')
            let isQuote = matchLineResult[2].indexOf(',') > -1 ? ',' : ''
            let val = `{}${isQuote}`
            resolveLineList.push(`"${key}":${val}`)
            return

        } else if (matchLineResult = line.match(setValByCompeleteFunction)) {
            // 单行完整函数赋值
            // 匹配结果：[ 'default:()=>{console.log(1);if(){}},','default',':',undefined,'=>',index: 0,input: 'default:()=>{console.log(1);if(){}},',groups: undefined ]
            console.log('单行完整函数赋值:matchLineResult :>> ', matchLineResult);
            let key = matchLineResult[1]
            let isQuote = line.lastIndexOf(',') === (line.length - 1) ? ',' : ''
            let val = `"function(){}"${isQuote}`
            resolveLineList.push(`"${key}":${val}`)
            return
        } else if ((line.match(setValByFunction) || line.match(setValByQuoteFunction)) && !funResolveObj.funCollectFlag) {
            // 函数赋值
            // 匹配结果：[ 'fun:function(){', 'fun', index: 0, input: 'fun:function(){', groups: undefined ]
            matchLineResult = line.match(setValByFunction) || line.match(setValByQuoteFunction)
            console.log('函数赋值:matchLineResult :>> ', matchLineResult);
            let key = matchLineResult[1].replace(/,/g, '')
            funResolveObj.funCollectFlag = true
            funResolveObj.funKey = key
            stack.push('{')
            return
        }
        resolveLineList.push(line)
    })
    joinString = resolveLineList.join('')
    // 1. 合并数组
    // 2. 去掉空格
    // 3. 去掉 export(const|let)${propName}= 字符串
    // 4. 转换 单引号|反引号 为 双引号
    // 5. 将对象的 key 用 双引号 包起来
    let objstr = joinString
        .replace(/\s/g, '')
        .replace(exportDefaultReg, '')
        .replace(/('|`)/g, '"')
        .replace(/(\w+):/g, (w, w2) => {
            // w2 是括号匹配的内容
            return `"${w2}":`
        })
    console.log('before:JSON.parse:字符串:>> ', objstr)
    let parsedObj = JSON.parse(objstr)
    // console.log('JSON.parse:处理后对象:>> ', parsedObj)
    return parsedObj
}
