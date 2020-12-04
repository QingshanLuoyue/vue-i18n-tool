## vscode 插件 --- i18n 辅助

### 插件开发流程

[插件开发](https://www.cnblogs.com/linjunfu/p/13949044.html)


### i18n 插件说明

package.json
```javascript
{
    // https://code.visualstudio.com/api/references/activation-events
    // 激活时机配置，* 表示加载即激活
    "activationEvents": [
		"*"
	],
    "main": "./extension.js",
    // https://code.visualstudio.com/api/references/contribution-points
    // 插件配置，比如命令，菜单，视图等等
    // 这里指定了一个 'yx-i18n-helper.helloWorld' 命令
    // 该命令可以在 ctrl + shift + p 面板来调用
    // 但是命令必须在 activate 或者 插件生命周期中被定义才能使用，不可无中生有
	"contributes": {
		"commands": [
			{
				"command": "yx-i18n-helper.helloWorld",
				"title": "Hello World"
			}
		]
	},
}
```


extension.js
入口

```javascript
// 插件被激活时执行
// package.json 的 activationEvents 决定插件被激活的时机

function activate(context) {}
// 插件停止时执行
function deactivate() {}

module.exports = {
    activate,
    deactivate
}
```





### 悬浮显示中文

鼠标悬浮显示中文

#### 主体思路

前置操作：
1、匹配当前的 script 内容
2、使用 babel 转换 AST 语法树
3、traverse 遍历 AST ，去除不可识别语法
    不可识别语法：
    {
        i18n: {
            ...i18n,
            a: function() {}
            a() {}
            a: () => {}
        }
    }
得到处理后的 AST 语法树

读取当前 vue 组件的 i18n 对象
    自定义
        {
            i18n: {}
        }
        traverse 遍历 AST
        node.type === 'ObjectProperty' && node.key.name === 'i18n' && node.value.type === 'ObjectExpression' ---> generate(node.value) 生成 i18n 对象节点
        再次 traverse
        eval 运行，将 i18n 对象拷贝出来
         
    外部引入赋值
        import i18n from 'xxx.js'
        {
            i18n: i18n
        }
若不存在，则获取、`utils/i18n-message/(projectname/htmlpage)/index.js`静态的中文 i18n 对象
        



### 定位跳转

ctrl + 鼠标左键定位跳转