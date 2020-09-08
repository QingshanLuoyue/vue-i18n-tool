import { Component, Vue } from 'vue-property-decorator'
import { isYouxinApp, lang, appType } from '@/utils/html-utils'
import { wechatShare } from '@/utils/share/wechat.js'
import { queryMessageDetail } from '@/service/news-helpcenter'
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
    private introduceContent: string = ''
    private introduceButton: string = ''
    created() {
        // 获取日内融介绍页内容
        this.handleQueryMessageDetail()

        let langMap = {
            zhCHS: '1',
            zhCHT: '2',
            en: '3'
        }
        let appTypeNum = appType.Hk ? 2 : 1
        // 配置微信默认的分享内容
        wechatShare({
            title: this.$t('shareTitle'),
            desc: this.$t('shareDesc'),
            link: `${window.location.origin}${window.location.pathname}?langType=${langMap[lang]}&appType=${appTypeNum}${window.location.hash}`,
            imgUrl: `${
                window.location.origin
            }${require('@/assets/img/intraday-financing/icon-logo.png')}`
        })
        if (isYouxinApp) {
            this.$jsBridge.registerFn('share', () => {
                this.$jsBridge.callApp('command_share', {
                    shareType: 'freedom',
                    title: this.$t('shareTitle'),
                    description: this.$t('shareDesc'),
                    pageUrl: unescape(
                        `${window.location.origin}${window.location.pathname}?langType=${langMap[lang]}&appType=${appTypeNum}${window.location.hash}`
                    ),
                    thumbUrl: `${
                        window.location.origin
                    }${require('@/assets/img/intraday-financing/icon-logo.png')}`
                })
            })
            let iconBase64 = require('@/assets/img/intraday-financing/share-dark.png')
            let base64 = iconBase64.replace(
                /^data:image\/(png|ico|jpe|jpeg|gif);base64,/,
                ''
            )
            this.$jsBridge.callApp('command_set_titlebar_button', {
                position: 2,
                type: 'custom_icon',
                custom_icon: base64,
                clickCallback: 'share'
            })
        }
    }
    // 获取日内融介绍页内容
    async handleQueryMessageDetail() {
        try {
            let data = await queryMessageDetail({
                key: 'Day_Margin_Introduction'
            })
            // 该接口，需要保证至少包含两个模块，且最后一个模式是按钮内容
            let mainContent
            let bottomContent
            let obj = JSON.parse(data.content)
            console.log('obj :>> ', obj)
            if (obj) {
                let len = obj.length
                mainContent = obj
                    .slice(0, len - 1)
                    .map((item: any) => item.htmlContent)
                    .join('')
                bottomContent = (obj[len - 1] && obj[len - 1].htmlContent) || ''
            }
            this.introduceContent = mainContent || ''
            this.introduceButton = bottomContent
        } catch (e) {
            e.msg && this.$toast(e.msg)
            console.log('queryMessageDetail:error :>> ', e)
        } finally {
            this.showPage = true
        }
    }
}
