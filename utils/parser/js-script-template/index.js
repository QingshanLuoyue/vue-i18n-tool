const ts_template = `
@Component({
    i18n: {
        zhCHS: {
            shareTitle: '友信证券日内融，炒股新玩法',
            shareDesc: '最高支持20倍杠杆，0利息，一键下单。小资本，撬动大收益！'
        },
        zhCHT: {
            shareTitle: '友信證券即日孖展，炒股新玩法',
            shareDesc: '最高支持20倍槓桿，0利息，一鍵下單。小資本，撬動大收益！'
        },
        en: {
            shareTitle: 'uSMART New Concept: Day Margin',
            shareDesc:
                'Up to 20x Margin, 0 interest. Having large profit by small capitals!'
        }
    }
})
export default class IntroducePage extends Vue {
    private showPage = false
}
`


const ObjectProperty_Identifier_template = `
// import { importi18n, i18n } from './mixins/i18n'
export default {
    // i18n: i18n,
    i18n,
    // i19n: importi18n,
}
`

const ObjectProperty_ObjectExpression_template  = `
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

const ObjectProperty_ObjectExpression__unable_to_parse_syntax  = `
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

const exportConstI18n  = `
export const i18n = {
    x:  1
}
export default {
    i18n,
    i19n
}
`

const exportConstI18n__unable_to_parse_syntax  = `
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

const exportDefaultZhCHS  = `
export default {
    zhCHS: {
        x: 1
    }
}
`
module.exports = {
    ObjectProperty_Identifier_template,
    ObjectProperty_ObjectExpression_template,
    ObjectProperty_ObjectExpression__unable_to_parse_syntax,
    exportConstI18n__unable_to_parse_syntax,
    ts_template,
    exportConstI18n,
    exportDefaultZhCHS
}
