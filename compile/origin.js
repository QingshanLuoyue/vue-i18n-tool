import { Icon, Button, Popup, Picker, Dialog } from '../utils/parser/js-script-template/node_modules/vant'
import uploadCertification from '../utils/parser/js-script-template/node_modules/@/pages/open-account-hk/apply/biz-components/upload-certification/index.vue'
import { personalMixins } from './mixins/personal'
import { NFC_OPENACCOUNT_COUNTRY_CODE } from './map.js'
import yxDateTimePicker from '../utils/parser/js-script-template/node_modules/@/biz-components/yx-datetime-picker'
import { i18n } from './mixins/i18n'
import { formatDateToEn } from '../utils/parser/js-script-template/node_modules/@/utils/tools'
import dayjs from '../utils/parser/js-script-template/node_modules/dayjs'
// import {
//     // 获取客户个人资料信息
//     getHKIdentifyInfo
// } from '@/service/user-account-server-hk.js'
export default {
    i18n,
    mixins: [personalMixins],
    components: {
        [Icon.name]: Icon,
        [Button.name]: Button,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [Dialog.name]: Dialog,
        uploadCertification,
        yxDateTimePicker
    },
    props: {
        // 子组件共享数据
        componentShareData: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            stringData: JSON.parse(JSON.stringify(this.componentShareData)),
            weixinContent1: this.$t('regulatoryRequirements'),
            weinxinContent2: `${this.$t('notSupportOpenAccount')}`,
            // 证件类型
            identifyType: '',
            // identifyInfo: {},
            numberFieldText: this.$t('idPassportNo'),
            uploadBtnText: this.$t('uploadPassport'),
            // 护照或身份证
            flowTextName: this.$t('passportInfo'),
            pickerTitle: this.$t('pleaseSelect'),
            // 当前是哪个picker
            type: '',
            placeOfIssue: NFC_OPENACCOUNT_COUNTRY_CODE,
            columns: {
                // 签发地
                placeOfIssue: this.countryList().countryMap
            },
            // 存储code
            paramsCode: {
                // 签发地code
                placeOfIssue: ''
            },
            form: {
                // 签发地
                placeOfIssue: '',
                identifyImg: '',
                identifyCode: '',
                birthday: '',
                identifyEnd: ''
            },
            isGoNfc: true, // 护照信息是否与服务端保存的不一样
            title: {
                placeOfIssue: this.$t('pleaseSelectplace')
            },
            exampleImage: `${window.location.origin}/webapp/open-account-hk/apply/example.png`
        }
    },
    computed: {
        birthDayInit() {
            let date = ''
            if (this.$i18n.lang === 'en') {
                date = this.birthTimeInEnLang || ''
            } else {
                date = this.form.birthday || ''
            }
            if (!date) {
                date = '1990-01-01'
            }
            return dayjs(
                date.toString().replace(/(\d+)年(\d+)月(\d+)日/, '$1-$2-$3')
            ).format('YYYY-MM-DD')
        },
        identifyEndInit() {
            let date = ''
            if (this.$i18n.lang === 'en') {
                date = this.identifyEndEnLang || ''
            } else {
                date = this.form.identifyEnd || ''
            }
            if (!date) {
                date = Date.now()
            }
            return dayjs(
                date.toString().replace(/(\d+)年(\d+)月(\d+)日/, '$1-$2-$3')
            ).format('YYYY-MM-DD')
        },
        userId() {
            return this.$store.getters.user.userId
        },
        isYouxinAndroid() {
            return this.$store.getters.isYouxinAndroid
        },
        disabled() {
            // 只要有一个为空，就禁止提交
            return Object.keys(this.form).some(key => !this.form[key])
        },
        footButtonText() {
            return this.isGoNfc ? this.$t('verifyPass') : this.$t('next')
        }
    },
    created() {
        // 获取客户个人资料信息
        // this.getHKIdentifyInfo()

        // let stringData = JSON.parse(JSON.stringify(this.componentShareData))
        let routerComponentShareData = this.$route.query.componentShareData
        if (routerComponentShareData) {
            this.stringData = {
                ...this.stringData,
                ...routerComponentShareData
            }
        }

        this.form.identifyImg = this.stringData.identifyImg
        this.form.identifyCode = this.stringData.identifyCode
        // this.form.identifyCode = 'EC3910245'
        // 设置出生日期
        this.birthTimeInEnLang = this.stringData.birthTimeInEnLang
        if (this.stringData.birthTimeInEnLang) {
            this.form.birthday = formatDateToEn(
                this.stringData.birthTimeInEnLang.replace(
                    /(\d+)年(\d+)月(\d+)日/,
                    '$1-$2-$3'
                )
            )
        } else {
            this.form.birthday = this.stringData.birthday
        }

        // 设置证件到期日期
        this.identifyEndEnLang = this.stringData.identifyEndEnLang
        if (this.stringData.identifyEndEnLang) {
            this.form.identifyEnd = formatDateToEn(
                this.stringData.identifyEndEnLang.replace(
                    /(\d+)年(\d+)月(\d+)日/,
                    '$1-$2-$3'
                )
            )
        } else {
            this.form.identifyEnd = this.stringData.identifyEnd
        }

        // 签发地信息 需要本地做多语言
        this.form.placeOfIssue =
            this.countryList().codeTextMap[this.stringData.placeOfIssueCode] ||
            this.stringData.placeOfIssue
        this.paramsCode.placeOfIssue = this.stringData.placeOfIssueCode

        this.initDataFromLs()
    },
    methods: {
        async submitHandle() {
            try {
                // if (!this.isGoNfc) {
                //     this.$emit('changeView', {
                //         componentName: 'personal',
                //         componentShareData: {
                //             identifyImg: this.form.identifyImg,
                //             identifyCode: this.form.identifyCode, // 证件号码
                //             birthday: this.form.birthday, // 出生日期
                //             birthTimeInEnLang: this.birthTimeInEnLang, // 英文情况下，需要提交给后台的出生日期，而不是this.form.birthday。 格式 1990年1月1日
                //             identifyEnd: this.form.identifyEnd, // 证件有效期
                //             identifyEndEnLang: this.identifyEndEnLang, // 英文情况下，需要提交给后台的证件有效期，而不是this.form.identifyEnd。 格式 1990年1月1日
                //             placeOfIssue: this.form.placeOfIssue, //签发地
                //             placeOfIssueCode: this.paramsCode.placeOfIssue, // 签发地 code
                //             passportHeadImg: this.stringData.passportHeadImg,
                //             isHighPriority: true // 保证数据优先级最高
                //         }
                //     })
                //     return
                // }
                // 如果没有打开NFC
                let data = await this.$jsBridge.callApp(
                    'get_nfc_recognition_availability'
                )
                console.log('submitHandle>>>data :', data)
                if (!data.enable) {
                    this.$alert(this.$t('pleaseTurn'))
                    return
                }
                console.log('this.paramsCode :', this.paramsCode)
                this.$emit('changeView', {
                    componentName: 'nfc',
                    componentShareData: {
                        identifyImg: this.form.identifyImg,
                        identifyCode: this.form.identifyCode, // 证件号码
                        birthday: this.form.birthday, // 出生日期
                        birthTimeInEnLang: this.birthTimeInEnLang, // 英文情况下，需要提交给后台的出生日期，而不是this.form.birthday。 格式 1990年1月1日
                        identifyEnd: this.form.identifyEnd, // 证件有效期
                        identifyEndEnLang: this.identifyEndEnLang, // 英文情况下，需要提交给后台的证件有效期，而不是this.form.identifyEnd。 格式 1990年1月1日
                        placeOfIssue: this.form.placeOfIssue, //签发地
                        placeOfIssueCode: this.paramsCode.placeOfIssue // 签发地 code
                    }
                })
            } catch (e) {
                console.log('submitHandle>error :', e)
                this.$toast(e.desc || this.$t('theNetwork'))
            }
        },
        // 获取客户个人资料信息
        // async getHKIdentifyInfo() {
        //     try {
        //         let data = await getHKIdentifyInfo()
        //         this.identifyInfo = data || {}
        //     } catch (e) {
        //         console.log('getHKIdentifyInfo>> e :>> ', e)
        //     }
        // },
        // 回显本地数据，如果传过来的对象中，属性为空的，进行赋值，否则不改动
        initDataFromLs() {
            if (this.isYouxinAndroid) {
                let localForm =
                    this.$LS.get('hk_passport_form' + this.userId) || {}
                let localParamsCode =
                    this.$LS.get('hk_passport_paramsCode' + this.userId) || {}
                Object.keys(this.form).forEach(key => {
                    if (!this.form[key] && this.form[key] !== 0) {
                        this.form[key] = localForm[key]
                    }
                })
                if (!this.birthTimeInEnLang) {
                    this.birthTimeInEnLang = localForm.birthTimeInEnLang
                }
                if (!this.identifyEndEnLang) {
                    this.identifyEndEnLang = localForm.identifyEndEnLang
                }

                Object.keys(this.paramsCode).forEach(key => {
                    if (!this.paramsCode[key] && this.paramsCode[key] !== 0) {
                        this.paramsCode[key] = localParamsCode[key]
                    }
                })
            }
        }
        // 判断 签发地，证件号码，出生日期，证件有效期有一个更改，就重新走nfc
        // diffFormAndServerData() {
        //     // 若 passportHeadImg 为空，说明没经过 nfc 流程
        //     // 所以至少要走一次 nfc 流程，这里 isGoNfc 就要为 true
        //     this.isGoNfc =
        //         Object.keys(this.form).some(key => {
        //             if (
        //                 key === 'birthday' &&
        //                 this.stringData.birthTimeInEnLang
        //             ) {
        //                 return (
        //                     this.stringData.birthTimeInEnLang !==
        //                     this.identifyInfo[key]
        //                 )
        //             }
        //             if (
        //                 key === 'identifyEnd' &&
        //                 this.stringData.identifyEndEnLang
        //             ) {
        //                 return (
        //                     this.stringData.identifyEndEnLang !==
        //                     this.identifyInfo[key]
        //                 )
        //             }
        //             return (
        //                 key !== 'identifyImg' &&
        //                 this.form[key] !== this.identifyInfo[key]
        //             )
        //         }) || !this.stringData.passportHeadImg
        // }
    },
    watch: {
        // 护照号码强制转大写
        'form.identifyCode'(newV) {
            this.$nextTick(() => {
                this.form.identifyCode =
                    (newV &&
                        newV
                            .toString()
                            .toUpperCase()
                            .replace(/[^\dA-Za-z]/g, '')) ||
                    ''
            })
        },
        form: {
            handler(val) {
                // 判断 签发地，证件号码，出生日期，证件有效期有一个更改，就重新走nfc
                // this.diffFormAndServerData(this.stringData)

                let tmpVal = JSON.parse(JSON.stringify(val))
                tmpVal.birthTimeInEnLang = this.birthTimeInEnLang
                tmpVal.identifyEndEnLang = this.identifyEndEnLang
                console.log('passport form', tmpVal)
                this.isYouxinAndroid &&
                    this.$LS.put(
                        'hk_passport_form' + this.userId,
                        tmpVal,
                        1 / 24
                    )
            },
            deep: true
        },
        paramsCode: {
            handler(val) {
                console.log('passport paramsCode', val)
                this.isYouxinAndroid &&
                    this.$LS.put(
                        'hk_passport_paramsCode' + this.userId,
                        val,
                        1 / 24
                    )
            },
            deep: true
        }
    }
}
