## vscode 插件开发常见问题

1、win10 平台下，使用 gitbash 不能创建用户

vsce create-publisher xxx 失败

```bash
# 报错
ERROR  ﻿{"$id":"1","innerException":null,"message":"TF400813: Resource not available for anonymous access. Client authentication required.","typeName":"Microsoft.TeamFoundation.Framework.Server.UnauthorizedRequestException, Microsoft.TeamFoundation.Framework.Server","typeKey":"UnauthorizedRequestException","errorCode":0,"eventId":3000}
```

可以使用 cmd 或者 powershell

2、发布扩展，需要在项目 package.json 中，添加 publisher 字段，值为上面创建的用户名