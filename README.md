# yik
Chinese Wikipedia gadget for correctly comment/vote in Did You Know nominations.

**YIK投票机**是用于在DYK投票中发布留言的小工具。

由于DYK栏目更新造成DYKN页面段落不断变化，用户在DYKN页面评审时经常遇到留言错位的问题。本小工具不基于段落编辑，而是通过获取DYKN整个页面的wikitext，用正则表达式插入您的留言，以确保您的留言位于正确的段落。

此外，本工具还能让您进入待评审条目后，不用返回DYKN页面即可查看问题、发表留言。

尚不清楚本工具的皮肤和浏览器支持情况。已知不支持MinervaNeue和IE11。

## 安装
在您的common.js加入以下代码：
`mw.loader.load('/w/index.php?title=User:魔琴/gadgets/yik/index.js&action=raw&ctype=text/javascript');`

## 使用
安装后，访问「Wikipedia:新条目推荐/候选」页面时，「编辑」链接后会出现两个链接：「YIK查看」和「YIK投票」。
- 单击「YIK查看」：进入待评选的条目页。
- 单击「YIK投票」：打开投票机对话框。

### 待评选的条目页
通过「YIK查看」进入的条目，条目上方会自动出现一个DYK评选区域

可以查看问题与问题的原始wikitext，单击「投票」即可打开投票机对话框。

### 投票机对话框
在投票机对话框的文本框内输入您的留言，并发布即可。发布前可以先预览。

此外，对话框还提供{{支持}}、{{反对}}、{{不合要求}}、{{问题不当}}四个模板，单击相应的文字即可将模板语法插入至文本框中。

留言无需签名，小工具发布编辑时会自动加入`&nbsp;~~~~`。如果您希望以别的格式签名，可以自行加入四个波浪线，小工具会检测并省略自动加入的签名。

DYKN的留言需要用两个`*`缩进，小工具将在发布编辑时自动加入。如果您的留言不止一行，请您在第二行以后手动加入缩进。此外，小工具会自动去除留言尾部的换行。如果您确实需要换行再签名，请手动签名或想办法规避。

### 发布留言后
无论您正处于哪一个页面，您通过本小工具发表留言后，小工具将自动重定向至[https://zh.wikipedia.org/w/index.php?title=Wikipedia:%E6%96%B0%E6%9D%A1%E7%9B%AE%E6%8E%A8%E8%8D%90/%E5%80%99%E9%80%89&diff=cur&oldid=prev](DYKN页面的最新编辑)，供您检查留言情况。若留言错位，请您手动调整并报告。

此外，在该差异页面也可以留言评审，无需返回DYKN的当前版本。

## 杂项
当一个条目被多次提名时，本小工具只会读取和修改第一个提名。

如果您使用Convenient Discussions，请在`Wikipedia:新条目推荐/候选`页面停用。例如将引用该工具的代码改为：
<code>if(mw.config.get('wgPageName')!=='Wikipedia:新条目推荐/候选'){
	mw.loader.load('https://commons.wikimedia.org/w/index.php?title=User:Jack_who_built_the_house/convenientDiscussions.js&action=raw&ctype=text/javascript');
}</code>

## 已知问题

## 版本更新
- 2023-08-01 v0.0.1 发布
- 2023-08-13 v0.0.2 自动去除留言尾部的换行
- 2023-12-08 v0.0.3 修复了[[Special:Diff/78638027]]之后带空格的条目找不到的问题
- 2023-12-09 v0.0.4 调整了“你知道吗？”pre框的格式，使排版更紧凑
- 2023-12-13 v0.0.5 修复了一个错误
- 2024-09-25 v0.0.6 适配新版HTML
- 2024-10-02 v0.0.7 在编辑摘要中加入章节名，方便检查编辑后定位到刚刚浏览的章节
- 2024-12-10 v0.0.8 修复了特定情况下条目名返回undefined的问题，并针对此情况添加提醒
