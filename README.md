# yx-i18n-helper README

配套 yx-i18n 使用

支持语法
```javascript
import i18n from 'xxx.js'
import { i18n } from 'xxx.js'
export default {
    i18n: i18n,
    i18n,
    i18n: {
        zhCHS: {
            hello: 'hello'
        }
    }
}
```

其他如：扩展符、函数等语法不支持，将会解析失败

## usage

安装之后，自动全局生效

将鼠标 hover 在多语言上，即会显示该多语言的中文文案

多语言书写格式如下，hover 在 hello 文案上，将会显示 hello 对应的中文文案
```javascript
// 只要是 $t('xxxx') 形式就会进行 i18n 的 key 的匹配获取
// 匹配代码如下： 
// let i18nKey = word.match(/\$t\('(.+)'\)/)[1]
$t('hello')
```

默认会获取当前组件的 i18n 对象去匹配多语言

若匹配不到，将会去当前项目对应的 `utils/i18n-message/项目目录/页面/` 下，尝试寻找匹配
