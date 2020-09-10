module.exports = `
import getHeadInfo from '@/utils/http-request/get-head-info'
import { mapGetters } from 'vuex'
import {
    compareVersion,
    throttleSim,
    getParameter,
    deepCopy
} from '@/utils/tools'
import { Icon, Popup, Picker, Notify, RadioGroup, Radio } from 'vant'
import {
    getHKJobAndTaxInfo,
    addHKJobAndTaxInfo
} from '@/service/user-account-server-hk.js'
import { appVersion } from '@/utils/html-utils.js'
import { openAccountAppsflyer } from '../../utils/burying-point'
import i18nCountry from '@/pages/open-account-hk/apply/mixins/i18nCountry'
import commonCountry from '@/pages/open-account-hk/apply/mixins/commonCountry'
import { ACCOUINT_TYPE } from '@/utils/open-account-config'
export default {
    name: 'finance',
    i18n: {
        zhCHS: {
            changeAccount:
                '尊敬的客户，申请升级保证金账户对您的职业信息有风控要求，若您有固定职业请重新修改职业信息，若您无固定职业请选择现金账户。',
            confirm: '确定',
            cancel: '取消',
            okToSure: '我知道了',
            taxMessage: '税务信息',
            taxesTinNumber:
                '请填写您的纳税所在国家（地区）和对应的税务编号（TIN），',
            taxNumIsIdCard:
                '对于在香港/中国内地纳税居民，税务编号是您的香港/中国内地身份证号',
            employment: '职业',
            employmentStatus: '职业状况',
            companyNameInfo: '公司名称',
            industryInfo: '所属行业',
            occupation: '职位',
            taxPeopleMsg: '税务居民信息',
            proveIdentifyMsg: '如您在多个地区拥有税务居民身份，请提供所有信息',
            taxArea: '税务管辖区',
            taxCountry: '请输入纳税国家（地区）名称',
            taxNumberInfo: '税务编号',
            IDCardNumbre: '(如身份证号)',
            deleteInfo: '刪除',
            addMore: '添加更多',
            continureInfo: '继续',
            employedInfo: '受雇',
            selfEmployedInfo: '自雇',
            unEmployedInfo: '待业',
            houseWifeInfo: '家庭主妇',
            studentInfo: '学生',
            retiredInfo: '退休',
            counterArrInfo: [
                '香港',
                '中国内地',
                '澳门',
                '台湾',
                '新加坡',
                '英国',
                '印度',
                '加拿大',
                '澳大利亚',
                '其他国家(地区)'
            ],
            noRepeatCountry: '请不要添加重复国家',
            hongKongCoun: '香港',
            noMoreThanFive: '最多只能添加5条税务信息',
            employedByCompany: '例如就职于公司',
            runningETC: '例如创业、自由职业、店铺经营',
            jobMessage: '请输入行业信息',
            openAccountInviter: '客户经理邀请码',
            enterInviterNumber: '请输入邀请码(选填)',
            ...i18nCountry.zhCHS
        },
        zhCHT: {
            changeAccount:
                '尊敬的客戶，申請升級保證金賬戶對您的職業信息有風控要求，若您有固定職業請重新修改職業信息，若您無固定職業請選擇現金賬戶。',
            confirm: '確定',
            cancel: '取消',
            okToSure: '我知道了',
            taxMessage: '稅務信息',
            taxesTinNumber:
                '請填寫您的納稅所在國家（地區）和對應的稅務編號（TIN），',
            taxNumIsIdCard:
                '對於在香港/中國內地納稅居民，稅務編號是您的香港/中國內地身份證號',
            employment: '職業',
            employmentStatus: '職業狀況',
            companyNameInfo: '公司名稱',
            industryInfo: '所屬行業',
            occupation: '職位',
            taxPeopleMsg: '稅務居民資料',
            proveIdentifyMsg: '如您在多個地區擁有稅務居民身份，請提供所有資料',
            taxArea: '稅務管轄區',
            taxCountry: '請輸入納稅國家（地區）名稱',
            taxNumberInfo: '稅務編號',
            IDCardNumbre: '(如身份證號)',
            deleteInfo: '删除',
            addMore: '添加更多',
            continureInfo: '繼續',
            employedInfo: '受僱',
            selfEmployedInfo: '自僱',
            unEmployedInfo: '待業',
            houseWifeInfo: '家庭主婦',
            studentInfo: '學生',
            retiredInfo: '退休',
            counterArrInfo: [
                '香港',
                '中國內地',
                '澳門',
                '台灣',
                '新加坡',
                '英國',
                '印度',
                '加拿大',
                '澳大利亞',
                '其他國家(地區)'
            ],
            noRepeatCountry: '請不要添加重複國家',
            hongKongCoun: '香港',
            noMoreThanFive: '最多只能添加5條稅務資料',
            employedByCompany: '例如就職于公司',
            runningETC: '例如創業、自由職業、店鋪經營',
            jobMessage: '請輸入您的工作性質',
            openAccountInviter: '客戶經理邀請碼',
            enterInviterNumber: '請輸入邀請碼(選填)',
            ...i18nCountry.zhCHT
        },
        en: {
            changeAccount:
                'Dear valued customer, the risk management on the occupation is needed for upgrading to margin account. Please fill-in your occupation or select the cash account account. ',
            confirm: 'sure',
            cancel: 'cancel',
            okToSure: 'I have known',
            taxMessage: 'Tax Jurisdiction',
            taxesTinNumber:
                'Specify the jurisdiction of tax residency and the corresponding tax identification number,',
            taxNumIsIdCard:
                'If you are a tax resident of Hong Kong / Mainlan China, your TIN is your ID number.',
            employment: 'Employment Information',
            employmentStatus: 'Employment Status',
            companyNameInfo: 'Name of Employer',
            industryInfo: 'Industry',
            occupation: 'Occupation / Title',
            taxPeopleMsg: 'Tax Jurisdiction',
            proveIdentifyMsg:
                'Please specify the jurisdiction of tax residency and the corresponding Tax Identification Number (TIN). If you are a tax resident of Hong Kong, your TIN is your HKID.',
            taxArea: 'Jurisdiction of Residence',
            taxCountry: 'Please Enter Tax Residence',
            taxNumberInfo: 'TIN',
            IDCardNumbre: '(e.g. ID Number)',
            deleteInfo: 'Delete',
            addMore: 'Add',
            continureInfo: 'Continue',
            employedInfo: 'Employed',
            selfEmployedInfo: 'Self-employed',
            unEmployedInfo: 'Unemployed',
            houseWifeInfo: 'Housewife',
            studentInfo: 'Student',
            retiredInfo: 'Retired',
            counterArrInfo: [
                'Hong Kong',
                'Mainland China',
                'Macao',
                'Taiwan',
                'Singapore',
                'England',
                'India',
                'Canada',
                'Australia',
                'Other'
            ],
            noRepeatCountry: 'Please do not add duplicate countries',
            hongKongCoun: 'Hong Kong',
            noMoreThanFive: 'You can only add up to 5 tax information',
            employedByCompany: 'Employed by company',
            runningETC: 'e.g. Running own business, freelancer, etc',
            jobMessage: 'Please enter your industry',
            openAccountInviter: 'Account Manager Invitation Code',
            enterInviterNumber: 'Please enter invitation code (optional)',
            ...i18nCountry.en
        }
    },
    watch: {
        showJobStatus() {
            this.$emit('header-show')
        },
        managerCode() {
            this.$nextTick(() => {
                this.managerCode =
                    this.managerCode &&
                    this.managerCode.replace(/[^A-Za-z0-9]/, '').slice(0, 6)
            })
        },
        form: {
            handler() {
                if (!this.overAge60 && this.form.jobStatus) {
                    // 不符合职业要求且账户类型为保证金账户时弹框
                    if (
                        !this.inJob &&
                        this.form.accountType ===
                            ACCOUINT_TYPE.FINANCING_ACCOUNT
                    ) {
                        this.Margintoast()
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    mixins: [require('../../mixins/mix-router.js').default, commonCountry],
    components: {
        [Icon.name]: Icon,
        [Popup.name]: Popup,
        [Picker.name]: Picker,
        [RadioGroup.name]: RadioGroup,
        [Radio.name]: Radio
    },
    data() {
        return {
            ACCOUINT_TYPE: ACCOUINT_TYPE,
            submited: false,
            showJobStatus: false,
            isShowMore: true,
            showTaxInfo: false,
            taxCurrentIndex: 0,
            showPopup: false,
            // country: [852, 86, 853, 886, 65, 44, 91, 1, 61, 99999],
            country: this.countryList().countryMap.map(country => country.code),
            companyBusiness: [],
            jobPosition: [],
            jobStatus: [1001, 1002, 1003, 1004, 1005, 1006],
            codeToValue: {
                jobStatus: {
                    1001: this.$t('employedInfo'),
                    1002: this.$t('selfEmployedInfo'),
                    1003: this.$t('unEmployedInfo'),
                    1004: this.$t('houseWifeInfo'),
                    1005: this.$t('studentInfo'),
                    1006: this.$t('retiredInfo')
                },
                companyBusiness: {},
                jobPosition: {}
            },
            jobStatusList: [
                {
                    text: this.$t('employedInfo'),
                    tip: this.$t('employedByCompany')
                },
                {
                    text: this.$t('selfEmployedInfo'),
                    tip: this.$t('runningETC')
                },
                { text: this.$t('unEmployedInfo') },
                { text: this.$t('houseWifeInfo') },
                { text: this.$t('studentInfo') },
                { text: this.$t('retiredInfo') }
            ],
            columns: {
                companyBusiness: [],
                jobPosition: [],
                // country: this.$t('counterArrInfo')
                country: this.countryList().countryMap.map(
                    country => country.text
                )
            },
            paramsCode: {
                companyBusiness: '',
                jobPosition: '',
                jobStatus: '',
                companyBusinessOther: ''
            },
            type: 'companyBusiness',
            form: {
                // 账户类型:1-现金账户 2-融资账户
                accountType: 0,
                companyBusiness: '',
                companyName: '',
                jobPosition: '',
                jobStatus: '',
                taxList: [
                    {
                        country: '',
                        countryCode: '',
                        taxNumber: '',
                        countryDetailName: ''
                    }
                ],
                companyBusinessOther: ''
            },
            // 账户类型的变化次数
            accountChangeCount: 0,
            managerCode: '', // 开户邀请人
            managerCodeFromUrl: false, // 判断开户邀请人是否从 url 上获取
            hkTaxList: '',
            identifyType: '',
            aMarket: true,
            versionGreaterThan2: false
        }
    },
    async created() {
        ;(async () => {
            // 版本兼容代码
            const headerInfo = await getHeadInfo()
            if (compareVersion(headerInfo['X-Ver'], '1.7.0') === 1) {
                this.versionGreaterThan2 = true
            }
        })()
        try {
            const data = await getHKJobAndTaxInfo()
            await this.getAppSystem()
            let {
                identifyType,
                hkTaxList,
                companyBusiness,
                companyName,
                jobPosition,
                jobStatusCode,
                taxList,
                companyBusinessOther,
                tradeMarket,
                // 账户类型:1-现金账户 2-融资账户
                accountType,
                managerCode
            } = data
            // 注意覆盖问题，有可能会被覆盖，只有在已经走过流程的，才能进行赋值
            if (jobStatusCode && companyBusiness) {
                this.paramsCode.companyBusiness = companyBusiness
            }
            // 灰度内，默认是融资账户，如果没有在灰度内，则展示现金账户
            if (this.isGrayAuthority) {
                this.form.accountType =
                    accountType || ACCOUINT_TYPE.FINANCING_ACCOUNT
            } else {
                this.form.accountType =
                    accountType || ACCOUINT_TYPE.CASH_ACCOUNT
            }
            let urlManagerCode = getParameter('ICode') || this.$LS.get('ICode')
            // 若链接里面存在开户邀请人，则以链接里面的为准，且不可修改
            if (urlManagerCode) {
                this.managerCode = urlManagerCode
                this.managerCodeFromUrl = true
            } else {
                this.managerCode = managerCode
            }
            if (this.overAge60) {
                this.form.accountType = ACCOUINT_TYPE.CASH_ACCOUNT
            }
            this.identifyType = identifyType
            this.hkTaxList = hkTaxList || {}
            this.paramsCode.jobPosition = jobPosition
            this.paramsCode.jobStatus = jobStatusCode
            this.paramsCode.companyBusinessOther = companyBusinessOther
            Object.keys(this.codeToValue.companyBusiness).forEach(key => {
                if (key.trim() == companyBusiness) {
                    this.form.companyBusiness = this.codeToValue.companyBusiness[
                        key
                    ]
                }
            })

            this.form.companyName = companyName
            this.form.companyBusinessOther = companyBusinessOther
            if (!jobStatusCode) {
                //未填写资料时提示
                Notify({
                    message: this.$t('notify'),
                    duration: 3000,
                    background: 'rgba(1,33,220,1)'
                })
            }
            this.form.jobStatus = this.codeToValue.jobStatus[jobStatusCode]
            this.form.jobPosition = this.codeToValue.jobPosition[jobPosition]
            if (taxList.length > 0) {
                let { codeTextMap } = this.countryList()
                this.form.taxList = taxList.map(item => {
                    item.country = codeTextMap[item.countryCode]
                    return item
                })
                // 如果===5条，就不显示添加按钮
                if (taxList.length === 5) {
                    this.isShowMore = false
                }
            }
            if (typeof tradeMarket === 'string') {
                if (tradeMarket.split(',').indexOf('2') !== -1) {
                    this.aMarket = true
                } else {
                    this.aMarket = false
                }
            }
        } catch (e) {
            this.$toast(e.msg)
        }
    },
    methods: {
        MarginToastHandle() {
            if (this.isCanNotClickMargin) {
                this.Margintoast()
            }
        },
        async accountChangeHandler() {
            // accountChangeCount >0 时，执行，第一次created时候，不执行
            if (
                this.form.accountType === ACCOUINT_TYPE.CASH_ACCOUNT &&
                this.accountChangeCount &&
                !this.overAge60 &&
                this.inJob
            ) {
                try {
                    await this.$confirm({
                        message: this.$t('dontOpenFinancingAccount'),
                        confirmButtonText: this.$t('confirm'),
                        cancelButtonText: this.$t('cancel')
                    })
                } catch (e) {
                    // 账户类型:1-现金账户 2-保证金账户
                    this.form.accountType = ACCOUINT_TYPE.FINANCING_ACCOUNT
                    console.log(e)
                }
            }
            this.accountChangeCount++
        },
        confirmJobInfo(val) {
            this.showJobStatus = false
            this.paramsCode['jobStatus'] = this['jobStatus'][val.index]
            this.form['jobStatus'] = val.value.text
        },
        async getAppSystem() {
            let { list } = await this.$configService.getAppSystemKh([
                'KHHY',
                'KHZW'
            ])
            let companyBusinessList = JSON.parse(list[0].content)
            let jobPositionList = JSON.parse(list[1].content)
            this.codeToValue.companyBusiness = companyBusinessList
            this.codeToValue.jobPosition = jobPositionList
            let companyBusinessListArr = Object.values(companyBusinessList)
            companyBusinessListArr = [
                companyBusinessList['其他'],
                ...companyBusinessListArr.filter(
                    item => item !== companyBusinessList['其他']
                )
            ]
            this.$set(this.columns, 'companyBusiness', companyBusinessListArr)
            this.$set(this.form, 'companyBusiness', '')
            this.companyBusiness = Object.keys(companyBusinessList)
            this.companyBusiness = [
                '其他',
                ...this.companyBusiness.filter(item => item !== '其他')
            ]
            this.$set(this.paramsCode, 'companyBusiness', '')
            this.$set(
                this.columns,
                'jobPosition',
                Object.values(jobPositionList)
            )
            this.$set(this.paramsCode, 'jobPosition', list[1].defaultValue)
            this.$set(
                this.form,
                'jobPosition',
                jobPositionList[list[1].defaultValue]
            )
            this.jobPosition = Object.keys(jobPositionList)
        },
        submitHandler: throttleSim(async function() {
            if (this.submited) return
            let { companyBusiness, jobPosition, jobStatus } = this.paramsCode
            let {
                companyName,
                taxList,
                companyBusinessOther,
                accountType
            } = this.form
            try {
                let params = {
                    accountType,
                    managerCode: this.managerCode,
                    companyBusiness: companyBusiness,
                    companyName: companyName,
                    jobPosition: jobPosition,
                    jobStatusCode: jobStatus,
                    companyBusinessOther: companyBusinessOther,
                    addTaxList: this.handleTaxList(taxList),
                    tradeMarket: this.aMarket ? '1,2' : '1'
                }

                if (!this.versionGreaterThan2) {
                    params.tradeMarket = '1'
                }

                if (![1001, 1002].includes(jobStatus)) {
                    params.companyBusiness = null
                    params.companyName = null
                    params.jobPosition = null
                }
                await addHKJobAndTaxInfo(params)
                // 开户邀请人保存后，将本地保存的删除
                this.$LS.remove('ICode')
                try {
                    if (compareVersion(appVersion, '3.4.0') >= 0) {
                        openAccountAppsflyer({
                            event_name: 'Fourth Step - Occupation Check',
                            params: {
                                userName: this.$store.state.user.userName,
                                userId: this.$store.state.user.userId,
                                params
                            }
                        })
                    }
                } catch (e) {
                    console.log(e)
                }
                this.goNextStep()
                this.submited = true
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        }, 1500),
        handleTaxList(list) {
            let cyList = deepCopy(list)
            let val = cyList.map(item => {
                if (item.countryCode === 99999) {
                    item.country = item.countryDetailName
                    return item
                } else {
                    return item
                }
            })
            return val
        },
        selectTypeInfo(type, index) {
            this.type = type
            this.showPopup = !this.showPopup
            if (type !== 'country') {
                this.$nextTick(() => {
                    this.$refs.picker.setColumnIndex(
                        0,
                        this.columns[this.type].indexOf(this.form[this.type])
                    )
                })
            } else {
                this.$nextTick(() => {
                    this.$refs.picker.setColumnIndex(
                        0,
                        this.columns[this.type].indexOf(
                            this.form.taxList[index][this.type]
                        )
                    )
                    this.taxCurrentIndex = index
                })
            }
        },
        cancelHandler() {
            this.showPopup = false
        },
        deleteHandler(index) {
            this.form.taxList.splice(index, 1)
            if (this.form.taxList.length < 5) {
                this.isShowMore = true
            }
        },
        /**
         * 1 -> 大陆身份证
         * 2 -> 香港身份证
         * 3 -> 护照
         * 4 -> 香港永久居民身份证
         */
        confirmTypeInfo(val, index) {
            this.showPopup = false
            // 香港永久居民身份证|| 香港居民身份证开户,纳税国家选择“香港”时，税务编号默认带入香港身份证号；选择其他国家(地区)时，不带入
            let isRepeat = this.form.taxList.some(item => item.country === val)
            if (isRepeat) {
                this.$toast(this.$t('noRepeatCountry'))
                return
            }
            if (this.type === 'country') {
                this.form.taxList[this.taxCurrentIndex].country = val
                this.form.taxList[this.taxCurrentIndex].countryCode = this[
                    this.type
                ][index]
                if (
                    (this.identifyType === 2 || this.identifyType === 4) &&
                    val === this.$t('hongKongCoun')
                ) {
                    this.form.taxList.forEach(item => {
                        if (item.countryCode === 852) {
                            item.taxNumber = this.hkTaxList.taxNumber
                        }
                    })
                }
            } else {
                this.paramsCode[this.type] = this[this.type][index]
                this.form[this.type] = val
            }
        },
        addTaxList() {
            if (!this.canAdd) {
                this.$toast(
                    this.$t([
                        '请填写当前税务信息',
                        '請填寫當前稅務信息',
                        'Please fill in the current tax information'
                    ])
                )
                return
            }

            this.form.taxList.push({
                country: '',
                countryCode: '',
                taxNumber: '',
                countryDetailName: ''
            })

            if (this.form.taxList.length === 5) {
                this.isShowMore = false
                this.$toast(this.$t('noMoreThanFive'))
                return
            }
            // this.$nextTick(() => {
            //     this.$refs.add.scrollIntoView({ behavior: 'smooth' })
            // })
        },
        async Margintoast() {
            try {
                await this.$alert({
                    message: this.$t('changeAccount'),
                    confirmButtonText: this.$t('okToSure')
                })
                // 点击我知道了，自动勾选现金账户
                this.form.accountType = ACCOUINT_TYPE.CASH_ACCOUNT
                // this.flag = ACCOUINT_TYPE.CASH_ACCOUNT
            } catch (e) {
                e.msg && this.$toast(e.msg)
            }
        }
    },
    computed: {
        isCanNotClickMargin() {
            return (
                !this.inJob &&
                this.form.accountType === ACCOUINT_TYPE.CASH_ACCOUNT
            )
        },
        ...mapGetters(['grayStatusBit']),
        basicInfo() {
            return this.$store.getters['apply/basicInfo']
        },
        overAge60() {
            return this.basicInfo.overAge60
        },
        isGrayAuthority() {
            // 添加灰度,孖展灰度是从右往左第7为1， & 前后是10进制的数  &  this.userInfo.grayStatusBit & 64 === 64时，表示第7为一定是1
            console.log('grayStatusBit', this.grayStatusBit)
            // return (this.grayStatusBit & (1 << 6)) === 64
            // 开放灰度
            return true
        },
        inJob() {
            return (
                [this.$t('employedInfo'), this.$t('selfEmployedInfo')].indexOf(
                    this.form.jobStatus
                ) > -1
            )
        },
        tax() {
            return this.form.taxList[this.form.taxList.length - 1]
        },
        taxFlag() {
            return !this.tax.countryCode || !this.tax.taxNumber
        },
        // 按钮是否可用
        disabled() {
            // 受雇或自雇
            if (this.inJob) {
                if (
                    this.form.companyBusiness === '其他' ||
                    this.form.companyBusiness === 'other'
                ) {
                    return (
                        Object.values(this.form).some(item => {
                            if (
                                typeof item === 'string' ||
                                typeof item === 'number'
                            ) {
                                return !(item + '').trim()
                            } else {
                                return !item
                            }
                        }) || this.taxFlag
                    )
                } else {
                    //这里不能用对象删除属性，删除了就回不来了
                    return (
                        [
                            this.form.companyBusiness,
                            this.form.companyName,
                            this.form.jobPosition,
                            this.form.jobStatus,
                            this.form.taxList
                        ].some(item => {
                            if (
                                typeof item === 'string' ||
                                typeof item === 'number'
                            ) {
                                return !(item + '').trim()
                            } else {
                                return !item
                            }
                        }) || this.taxFlag
                    )
                }
            } else {
                return (
                    !(this.form.jobStatus && this.form.taxList.length > 0) ||
                    this.taxFlag
                )
            }
        },
        canAdd() {
            // 全部不为空时可以添加
            return this.form.taxList.every(
                item => item.countryCode && item.taxNumber
            )
        }
    }
}
`
