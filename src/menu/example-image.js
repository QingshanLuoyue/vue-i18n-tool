const vscode = require('vscode')
const path = require('path')
const fs = require('fs');

function getWebviewContent({completeImgList, vueLib} = {completeImgList: [], vueLib: ''}) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    #img-box {
        display: flex;
        flex-wrap: wrap;
    }
    #img-box img {
        display: block;
        flex: 1;
        width: 30%;
        margin: 5px;
        border: 1px solid #d0d0c5;
        object-fit: contain;
    }
    #preview {
        overflow: auto;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 2001;
    }
    #preview img {
        width: 100%;
        max-width: none;
        max-height: none;
    }
    .close-btn {
        position: fixed;
        top: 30px;
        right: 30px;
        padding: 4px 8px;
        border: none;
        background-color: #3a8ee6;
        color:#fff;
        font-size: 16px;
        cursor: pointer;
        outline: none;
        border-radius: 4px;
    }
    </style>
    <title>Cat Coding</title>
</head>
<body>
    <div id="app">
        <div id="img-box">
            ${
                completeImgList.map(imgUrl => {
                    return `<img src="${imgUrl}" @click="handleClick($event)">`
                }).join('')
            }
        </div>
        <div id="preview" v-show="showPreview">
            <img :src="previewSrc" alt="">
            <button class="close-btn" @click="handleClose">关闭</button>
        </div>
    </div>
    <script src="${vueLib}"></script>
    <script>
        let vm = new Vue({
            el: '#app',
            data() {
                return {
                    showPreview: false,
                    previewSrc: ''
                }
            },
            methods: {
                handleClose() {
                    this.showPreview = false
                    this.previewSrc = ''
                },
                handleClick(event) {
                    this.showPreview = true
                    this.previewSrc = event.target.src
                }
            }
        })
    </script>
</body>
</html>`;
}
module.exports = function (context) {
    // 创建webview
    let showImageDisposable = vscode.commands.registerCommand('showImage', async () => {
        const panel = vscode.window.createWebviewPanel(
            'showImage', // 标识Web视图的类型。内部使用
            'Show Image',  // 显示给用户的面板标题
            vscode.ViewColumn.One, // 编辑器列以显示新的Webview面板
            {
                enableScripts: true
            } // Webview选项
        )

        // d:\webproject\account
        let rootPath = vscode.workspace.rootPath

        // win: \
        // mac/linux: /
        let sep = path.normalize('/')

        // d:\webproject\account\pageImage
        let pageImageUrl = `${rootPath}${sep}example-image`
        // console.log('pageImageUrl :>> ', pageImageUrl);

        // d:\webproject
        let replaceUrl = rootPath.split(sep).slice(0, -1).join(sep)
        // console.log('replaceUrl :>> ', replaceUrl);

        // d:\webproject\account\src\pages\intraday-financing\index\views\risk-assessment-result\index
        const filenameUrl = vscode.window.activeTextEditor.document.fileName.replace(/.vue$/, '')
        // console.log('filenameUrl :>> ', filenameUrl);

        // \account\src\pages\intraday-financing\index\views\risk-assessment-result\index
        const imgDiskDir = filenameUrl.replace(replaceUrl, '')
        // console.log('imgDiskPath :>> ', imgDiskDir);

        // d:\webproject\account\pageImage\account\src\pages\intraday-financing\index\views\risk-assessment-result\index
        let finalDir = path.join(pageImageUrl, imgDiskDir)
        // console.log('finalDir :>> ', finalDir);
        if (fs.existsSync(finalDir)) {
            let imgList = await fs.readdirSync(finalDir)
            let completeImgList = imgList.map(img => {
                return getWebviewUri(panel, `${finalDir}${sep}${img}`)
            })
            // console.log('completeImgList :>> ', completeImgList);
            let o = {
                completeImgList,
                vueLib: getWebviewUri(panel, null, {context, dir: 'lib', libName: 'vue.min.js'})
            }
            let con = getWebviewContent(o)
            panel.webview.html = con
        }
    })

    context.subscriptions.push(showImageDisposable)
}
// 获取能在 webview 中使用的 url
function getWebviewUri(panel, filepath, {context, dir, libName} = {context: null, dir: '', libName: ''}) {
    let url
    if (dir && context) {
        url = path.join(context.extensionPath, dir, libName)
    } else {
        url = filepath
    }
    url = vscode.Uri.file(url)
    return panel.webview.asWebviewUri(url)
}
