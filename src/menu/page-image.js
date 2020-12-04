const vscode = require('vscode')
const path = require('path')
const fs = require('fs')

function getWebviewContent(imgList) {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        img {
            display: block;
            width: 100%;
        }
      </style>
      <title>Cat Coding</title>
  </head>
  <body>
        ${
            imgList.map(img => {
                return `<img src="${img}" />`
            })
        }
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
            {} // Webview选项
        )

        // d:\webproject\account
        let rootPath = vscode.workspace.rootPath

        // win: \
        // mac/linux: /
        let sep = path.normalize('/')

        // d:\webproject\account\pageImage
        let pageImageUrl = `${rootPath}${sep}pageImage`
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
            let uriUrl
            let completeImgList = imgList.map(img => {
                uriUrl = vscode.Uri.file(`${finalDir}${sep}${img}`)
                // console.log('uriUrl :>> ', uriUrl);
                return panel.webview.asWebviewUri(uriUrl)
            })
            // console.log('completeImgList :>> ', completeImgList);

            // const src = panel.webview.asWebviewUri(imgDiskPath)
            panel.webview.html = getWebviewContent(completeImgList)
        }
    })

    context.subscriptions.push(showImageDisposable)
}
