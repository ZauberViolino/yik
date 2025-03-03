//<nowiki>
mw.loader.using( ['mediawiki.util', 'mediawiki.api', 'ext.gadget.site-lib'/* ,'ext.gadget.HanAssist'*/ ], function () {
  
function han(s, t) {
  return wgULS(s, t);
  //return HanAssist.localize( { hans: s, hant: t } );
}


var cmt = "";
var dl = null;
var dlp = null;
var cj = {};
var API = new mw.Api();
var dykn = 'Wikipedia:新条目推荐/候选';
var regQue = /^(.|\n)*question *= *(.*?)\n(.|\n)*?$/;
var regSig = /(?<!~)~{4}(?!~)/;
var articlepath = mw.config.get('wgArticlePath');
var script = mw.config.get('wgScript');


if (mw.config.get('wgPageName') === dykn) {
  processNom();
} else if (mw.config.get('wgNamespaceNumber') === 0 && window.location.href.search(/yikeditor=1/) >= 0) {
  const urlParams = new URLSearchParams(window.location.search);
  processPage(decodeURI(urlParams.get('dykarticle')));
} else {
  return;
}



function opendl(article) {
  cmt = "";
  undwarning = "";
  if (article === "undefined") undwarning = "<p><span style='color:#f00;font-size:large'>" + han("注意：条目名探测结果为undefined，这可能是程序错误导致，请考虑", "注意：條目名探測結果為undefined，這可能是程式錯誤導致，請考慮") + "<a href='/wiki/User_talk:%E9%AD%94%E7%90%B4'>" + han("回报", "回報") + "</a>。</span></p>"
  var html =
    '<div id="yik-dialog" class="yik-dialog">' +
    '<style>.yik-dialog,.yik-preview{font-size:initial;}</style>' +
    '<p>' + han('评选条目：', '評選條目：') + '<span class="yik-dialog-article">' + atl(article) + '</span></p>' + undwarning + 
    '<p>' + han('在文本框中输入意见，单击文字插入模板。', '在文本框中輸入意見，點擊文字插入模板。') + '</p>' +
    '<p>' + 
      '<a class="yik-add yik-support" href="javascript:void(0)">支持</a>　' +
      '<a class="yik-add yik-oppose" href="javascript:void(0)">' + han('反对', '反對') + '</a>　' +
      '<a class="yik-add yik-unqualified" href="javascript:void(0)">不合要求</a>　' +
      '<a class="yik-add yik-inappropriate" href="javascript:void(0)">' + han('问题不当', '問題不當') + '</a>　' +
    '</p>' +
    '<textarea name="yik-cmt" id="yik-cmt" class="yik-cmt" rows=4 placeholder=' + han('不用签名；留言的首行自动缩进。','不用簽名；留言的首行自動縮進。') + '></textarea>' +
    '</div>';

  if (dl) {
    dl.html(html).closest('.ui-dialog-content').dialog('destroy').remove();
    dl = null;
  }

  dl = $(html).dialog({
    title: han('YIK投票机', 'YIK投票機'),
    minWidth: 600,
    minHeight: 200,
    buttons: [
      {
        text: han('发布', '發佈'),
        click: function () {
          processCmt(article);
          postCmt(article, cmt);
        }
      },
      {
        text: han('预览', '預覽'),
        click: function () {
          processCmt(article);
          previewCmt(article, cmt);
        }
      },
      {
        text: han('关闭', '關閉'),
        click: function () {
          processCmt(article);
          $(this).dialog('close');
        }
      }
    ]
  });

  $('#yik-dialog').parent().addClass('yik-dialog-base')
  if (cj[article] !== undefined) {
    $('#yik-dialog').find('.yik-cmt').val(cj[article]);
  }


  function yikAdd(a) {
    var c = document.getElementById("yik-cmt");
    var p1 = c.selectionStart;
    var p2 = c.selectionEnd;
  
    c.value =
      c.value.substring(0, p1) +
      a +
      c.value.substring(p2, c.value.length);
  
    c.focus();
    c.setSelectionRange(p2 + a.length, p2 + a.length);
  }

  $('.yik-support').click( function (){
    yikAdd('{' + '{support}}');
  })
  $('.yik-oppose').click( function (){
    yikAdd('{' + '{oppose}}');
  }) 
  $('.yik-unqualified').click( function (){
    yikAdd('{' + '{不合要求}}');
  })
  $('.yik-inappropriate').click( function (){
    yikAdd('{' + han('{问题不当}}', '{問題不當}}'));
  })
}

function processCmt(a) {
  cmt = $('#yik-dialog').find('.yik-cmt').val().replace(/\n*$/,"");
  cj[a] = cmt;
  if (cmt.search(regSig) === -1) {
    cmt = cmt + '&nbsp;~~~~';
  }
}


function previewCmt(a, c) {
  previewPromise = API.post({
    action: 'parse',
    text: '**' + c,
    pst: 'true',    // PST = pre-save transform; this makes substitution work properly
    title: dykn,
    prop: 'text',
    formatversion: '2'
  } ).done(function(data){
    $('<style>.yik-nomarker::marker{content:"";}.yik-preview .ext-discussiontools-init-replylink-buttons{display:none;}</style>').appendTo('head');
    var html =
      '<div id="yik-preview" class="yik-preview mw-body-content">' + data.parse.text.replace(/li/, 'li class=yik-nomarker')	+ '</div>';
    if (dlp) {
      dlp.html(html).closest('.ui-dialog-content').dialog('destroy').remove();
      dlp = null;
    }
    dlp = $(html).dialog({
      title: han("预览投票：", "預覽投票：") + a,
      minWidth: 600,
      minHeight: 100,
      buttons: [
        {
          text: han('确认', '確認'),
          click: function() {
            postCmt(a, c);
            $(this).dialog('close');
          }
        },
        {
          text: '取消',
          click: function() { $(this).dialog('close'); }
        }
      ]
    });
  }).fail(function(e) {
    mw.notify( e );
  });
}

function postCmt(a, c) {
  $('.yik-dialog-base button').each(function () {
    $(this).prop("disabled", true);
  });
  mw.notify(han('正在发布，请稍候。','正在發佈，請稍候。'))
  getQuestion = API.post({
    action: 'parse',
    page: dykn,
    prop: 'wikitext',
    formatversion: '2'
  }).done(function (data) {
    
    regCmtStr = '(\\| *article *= *' + a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g,'[ _]') + '(.|\n)*?)\n\n?=';
    regCmt = RegExp(regCmtStr, '');

    c0 = data.parse.wikitext;
    c1 = c0.replace(regCmt, '$1\n**' + c + '\n\n=');

    if (c1 === c0) {
      mw.notify('Failed to sent.');
      enableButton();
      return;
    }

    postPromise = API.postWithToken('csrf', {
      action: 'edit',
      title: dykn,
      text: c1,
      summary: '/* ' + a + ' */ Comment on [[' + a + ']] via [[User:魔琴/gadgets/yik|YIK]]'
    }).then(function () {
      mw.notify(han('发布成功，正在重定向到最近差异','發佈成功，正在重新導向到最近差異'))
      setTimeout(function () {
        window.location.href = script + '?title=' + dykn + '&diff=cur&oldid=prev';
      }, 4000);
    }, function (e) {
      mw.notify(e);
      enableButton();
    });
  }).fail(function (e) {
    mw.notify(e);
    enableButton();
  })
}

function enableButton() {
  $('.yik-dialog-base button').each(function () {
    $(this).prop("disabled", false);
  });
}


// Process nomination page

function processNom() {
  $('<style>.mw-heading4 .mw-editsection-divider { display: inline !important; }</style>').appendTo('head');

  if ($('.mw-editsection').length > 0) {
    var yikBtn = $('<span>').append($('<span>').addClass('mw-editsection-divider').text(' | ')).append($('<a>').addClass('yik-view').attr('href', 'javascript:void(0)').text(han('YIK查看','YIK檢視'))).append($('<span>').addClass('mw-editsection-divider').text(' | ')).append($('<a>').addClass('yik-vote').attr('href', 'javascript:void(0)').text('YIK投票',));
    $( ".mw-heading4 .mw-editsection" ).each(function(){
      var _yikBtn = yikBtn.clone();
      $(this).find('.mw-editsection-bracket').last().before(_yikBtn);
    });
  }

  $('.yik-view').click( function () {
    window.open(atu(findArticle( $(this) )), '_blank');
  })

  $('.yik-vote').click( function () {
    opendl(findArticle( $(this) ));
  })

}

function findArticle ( that ) {
  closesttag = that.closest('.mw-heading4').next().prop("tagName")
  switch (closesttag) {
    case "SPAN":
      return that.closest('.mw-heading4').next().next().next().find('.dykarticle a').html();
      break;
    case "FIGURE":
      return that.closest('.mw-heading4').next().next().find('.dykarticle a').html();
      break;
    case "UL":
    default:
      return that.closest('.mw-heading4').next().find('.dykarticle a').html();
      break;
  }
}


// Process the page for nomination

function processPage(p) {

  $('<style>.yik-qbox{margin:10px;border:#009 1px solid;padding:10px;background-color:#f0fbff;}.yik-qbox-btn{margin:5px;padding:2px 7px;font-size:large;background-color:#24a;color:#fff}.yik-qbox-btn:hover{background-color:#016}.yik-qbox-btn:active{background-color:#47c}.yik-qbox pre{padding:0.5em;margin:0.2em 0}</style>').appendTo('head');
  
  var yikQbox = 
    '<div id="yik-qbox" class="yik-qbox mw-body-content">' + 
    '<div class="yik-qbox-header">' + 
      '<img src="//upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Symbol_question.svg/20px-Symbol_question.svg.png" decoding="async" class="mw-file-element">' + 
      '<span class="yik-qbox-tagline" style="font-family:serif"> 你知道' + han('吗','嗎') + '？</span>' +
    '</div>' + 
    '<div id="yik-qbox-parse"></div>' + 
    '<hr>' + 
    '<div class="yik-qbox-footer"><button class="yik-qbox-btn">投票</button></div>' + 
    '</div>';
  
  $('#mw-content-text').before($(yikQbox));
  regSecStr = '^(.|\n)*?({' + '{ *DYKEntry(.|\n)*?\\| *article *= *' + decodeURI(p).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g,'[ _]') + '(.|\n)*?(\n))=(.|\n)*$';
  regSec = RegExp(regSecStr, '');

  getQuestion = API.post({
    action: 'parse',
    page: dykn,
    prop: 'wikitext',
    formatversion: '2'
  }).done(function (data) {
    s0 = data.parse.wikitext
    s1 = s0.replace(regSec, '$2')
    if (s1===s0) {
      $('#yik-qbox-parse').html('<span style="color:#c22">' + han('未找到条目','未找到條目') + '</span>');
      return;
    }

    $('.yik-qbox-btn').click(function () {
      opendl(p);
    })

    question = s1.replace(regQue, '$2')
    parseQuestion = API.post({
      action: 'parse',
      contentmodel: 'wikitext',
      text: '*' + question + '\n<syntaxhighlight>' + question + '</syntaxhighlight>',
      pst: 'true',    // PST = pre-save transform; this makes substitution work properly
      title: 'Wikipedia:沙盒',
      prop: 'text',
      formatversion: '2'
    }).done(function (data) {
      $('#yik-qbox-parse').html(data.parse.text)
    }).fail(function (e) {
      $('#yik-qbox-parse').html(han('问题解析失败（' + e + '），现提供原始wikitext：', '問題解析失敗（' + e + '），現提供原始wikitext：') + '<br><pre>' + question + '</pre>')
    })
  }).fail(function (e) {
    $('#yik-qbox-parse').html(e);
  })
}



function atu(ar) {
  return articlepath.replace('$1', encodeURI(ar)) + "?yikeditor=1&dykarticle=" + encodeURI(ar);
}

function atl(ar) {
  return  "<a href='" + atu(ar) + "' title='" + ar + "'>" + ar + "</a>";
}

});

//</nowiki>
