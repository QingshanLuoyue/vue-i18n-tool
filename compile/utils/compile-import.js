const fs = require('fs')
const path = require('path')

const content = fs.readFileSync(path.resolve(__dirname, '../compile-txt/only-const-or-let.txt'), { encoding: 'utf8' })

let splitContent = content.split('\n')
let commentReg = /\/\/.+/g

let descriptor = parseHtml(splitContent)
// console.log('descriptor :>> \n', descriptor, descriptor.length)

// 解析整个文本
function parseHtml(htmlLine) {
    let left = ['{'],
        right = ['}'],
        stack = [],
        lines = [],
        originLine = '',
        descriptor = {},
        mulDescriptor = []
    for (let i = 0; i < htmlLine.length; i++) {
        const line = htmlLine[i]
        // 去空格、换行、制表符、回车符以及去注释
        let parsedLine = line.replace(/(\s|\n|\t|\r)/g, '').replace(commentReg, '')
        if (parsedLine) {
            // console.log('parsedLine :>> ', parsedLine)
            for (const w of parsedLine) {
                if (left.includes(w)) {
                    stack.push(w)
                }
                if (right.includes(w)) {
                    stack.pop()
                }
            }
            if (stack.length === 0) {
                lines.push(parsedLine)
                originLine = lines.join('')

                descriptor = {
                    content: originLine,
                    ...parseExp(originLine),
                }
                lines = []
                mulDescriptor.push(descriptor)
            } else {
                lines.push(parsedLine)
            }
        }
    }
    return mulDescriptor
}

// 解析整个表达式
function parseExp(exp) {
    let jiegouR = /(const|let|var){(.+)}=(.+)/, // 解构
        putongR = /(const|let|var)([^{}()]+)=(.+)/ // 普通定义

    let mres = null

    let type = '',
        varName = null,
        equalRight = ''

    if ((mres = exp.match(jiegouR))) {
        type = 'jiegouR'
        varName = mres[2].split(',')
        equalRight = mres[3]
    } else if ((mres = exp.match(putongR))) {
        type = 'putongR'
        varName = mres[2]
        equalRight = mres[3]
    }
    return {
        type,
        varName,
        equalRight,
        ...parseEqualRight(equalRight),
    }
}
// 解析 等号 右侧表达式
function parseEqualRight(rightExp) {
    let funNameR = /(.+)\(('?(.+)?'?)\)$/,
        objR = /^{.+}$/,
        funDefineR = /(function)?\((.+)?\)(=>)?{(.+)?}$/

    let funName, params, parsedObj, funContent, mres
    if ((mres = rightExp.match(funNameR))) {
        funName = mres[1]
        // console.log('mres :>> ', mres)
        params = mres[2]
    } else if ((mres = rightExp.match(objR))) {
        funName = ''
        parsedObj = parseObjProp(rightExp)
    } else if ((mres = rightExp.match(funDefineR))) {
        funName = ''
        funContent = 'function(){}'
    }
    return {
        funName,
        params,
        parsedObj,
        funContent,
    }
}
// 解析 对象 内部属性
// 比如 中括号key，对象赋值，数组赋值，函数赋值，其他变量赋值，同名赋值，
function parseObjProp(objstr) {
    let left = ['{'],
        right = ['}'],
        stack = [],
        totalObj = '',
        closeObj = '', // 闭合的对象
        parsedObj = '',
        closeR = /^{.*}$/,
        mres = null
    for (let i = 0; i < objstr.length; i++) {
        const w = objstr[i]
        totalObj += w
        if (left.includes(w)) {
            stack.push(w)
            closeObj = w
            if ((mres = closeObj.match(/^{([^{}]+){$/))) {
                console.log('closeObj:gap :>> ', closeObj)
                parsedObj = parseGapProp(mres[1])
                totalObj = totalObj.slice(0, -closeObj.length)
                totalObj += parsedObj
            }
            closeObj = ''
            continue
        }
        if (right.includes(w)) {
            stack.pop()
            closeObj += w
            if (closeObj.match(closeR)) {
                console.log('closeObj:compelete :>> ', closeObj)
                parsedObj = parseCloseObj(closeObj)
                totalObj = totalObj.slice(0, -closeObj.length)
                totalObj += parsedObj
            }
            // console.log('totalObj :>> ', totalObj)
            closeObj = ''
            continue
        }
        closeObj += w
    }
    return parsedObj
}
// 解析最小的对象
function parseCloseObj(closeObj) {
    let maohaoR = /(\[.+\]|[^:{]+):(\[.+\]|[^:,}]+),?/g
    let mres = null
    if ((mres = closeObj.match(maohaoR))) {
        console.log('mres :>> ', mres)
    }
    return ''
}
// 解析 大括号之间的字符串
function parseGapProp(gapStr) {
    let maohaoR = /(\[.+\]|[^:{]+):(\[.+\]|[^:,}]+),?/g
    let mres = null
    if ((mres = closeObj.match(maohaoR))) {
        console.log('mres :>> ', mres)
    }
    return ''
}
// {
// [Popup.name]: Popup,
// b: {x: { u: [1] }, y: 3, z: [require(\'./mixin.js)]},
// c: [require(\'./mixin.js)],
// d: function () { },
// e: () => { },
// f: other,
// sameVar,
// g: other
// }
// vue file start
// script
// import
// const
// import
// export default {

// }
// script
// vue file end

// js file start
// js file
// import
// export
// import
// const
// export default {

// }
// js file end

// const i18n = {}
// export const i18n = {}
// export default {
//     i18n: i18n
// }

// define: {  // 定义 类别
//     i18n: {}
// }
// export: { // export 类别
//     i18n: i18n || define.i18n
// }
// default: { // export default 类别
//     i18n: export.i18n || define.i18n
// }
// compile = {
//     define,
//     export,
//     default
// }
