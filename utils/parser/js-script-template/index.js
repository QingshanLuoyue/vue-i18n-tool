const origin_define = require('./origin-define.js')
const origin_ts = require('./origin-ts.js')
const origin_rest = require('./origin-rest.js')

const objectProperty_setVarValue  = `
export default {
    i18n: i18n
}
`

const objectProperty_commonJson  = `
export default {
    i18n: {
        zhCHS: {
            x: 1
        },
        zhCHT: {
            y: 2
        },
        en: {
            z: 3
        }
    }
}
`

const objectProperty_rest  = `
export default {
    i18n: {
        zhCHS: {
            x: 1,
            funes5: function() {
                return 2
            },
            importi18n,
            importi18n2: importi18n3,
            funes6() {
                return 1
            },
            ...i18nCountry.zhCHS,
            ...testljf.xx,
            ...testljf2,
        },
    }
}
`
const objectProperty_import  = `
import {importi18n, i19n} from './page/index.js'
export default {
    i18n: importi18n,
    i19n
}
`
const exportConstI18n  = `
export const i18n = {
    x:  1
}
export default {
    i18n,
    i19n
}
`

const exportConstI18nRest  = `
export const i18n = {
    zh: {
        x: 1,
        ...country.zhc
    }
}
export default {
    i18n,
    i19n
}
`
module.exports = {
    objectProperty_setVarValue,
    objectProperty_commonJson,
    objectProperty_rest,
    objectProperty_import,
    origin_define,
    origin_ts,
    origin_rest,
    exportConstI18n,
    exportConstI18nRest
}
