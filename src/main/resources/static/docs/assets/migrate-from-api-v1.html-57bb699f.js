import{_ as c}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as i,c as r,d as n,e as s,b as e,w as l,f as t}from"./app-ff93bfbc.js";const u={},d={href:"/#%E7%AC%AC%E4%BA%8C%E4%BB%A3api%E5%92%8C%E7%AC%AC%E4%B8%80%E4%BB%A3api%E7%9A%84%E5%8C%BA%E5%88%AB",target:"_blank",rel:"noopener noreferrer"},_=n("h2",{id:"启用第二代api与node-js引擎",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#启用第二代api与node-js引擎","aria-hidden":"true"},"#"),s(" 启用第二代API与Node.js引擎")],-1),h={href:"/#%E7%94%A8node-js%E5%BC%95%E6%93%8E%E8%BF%90%E8%A1%8C%E4%BB%A3%E7%A0%81",target:"_blank",rel:"noopener noreferrer"},k=t(`<h2 id="从全局变量函数改为导入模块" tabindex="-1"><a class="header-anchor" href="#从全局变量函数改为导入模块" aria-hidden="true">#</a> 从全局变量函数改为导入模块</h2><p>在第二代API中，所有模块都需要导入才能使用。在第一代API中的全局变量，比如app, images模块，在第二代API中都需要导入后使用，比如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 第一代API</span>
app<span class="token punctuation">.</span><span class="token function">viewFile</span><span class="token punctuation">(</span><span class="token operator">...</span><span class="token punctuation">)</span>

<span class="token comment">// 第二代API</span>
<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">viewFile</span><span class="token punctuation">(</span><span class="token operator">...</span><span class="token punctuation">)</span>

<span class="token comment">// 也可以这样只导入需要的函数</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> viewFile <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;app&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">viewFile</span><span class="token punctuation">(</span><span class="token operator">...</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一代API中的全局变量、函数大多数也不能直接使用，比如<code>sleep</code>, <code>log</code>, <code>toast</code>：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 第一代API</span>
<span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span>
<span class="token function">log</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">getPackageName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
<span class="token function">toast</span><span class="token punctuation">(</span><span class="token string">&#39;&#39;</span><span class="token punctuation">)</span>

<span class="token comment">// 第二代API</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> delay <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;lang&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> showToast <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;toast&#39;</span><span class="token punctuation">)</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">await</span> <span class="token function">delay</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> context <span class="token operator">=</span> $autojs<span class="token punctuation">.</span>androidContext<span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">getPackageName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">showToast</span><span class="token punctuation">(</span><span class="token string">&#39;Hello&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="模块与函数对照表" tabindex="-1"><a class="header-anchor" href="#模块与函数对照表" aria-hidden="true">#</a> 模块与函数对照表</h2><p>在第二代API中，一部分模块的名称和第一代相似，比如app, color；一部分模块的功能则迁移到其他模块；一部分模块则由Node.js自带模块代替，比如files模块由Node.js的fs和path模块代替；一部分模块则由第三方npm模块代替，这些模块往往更加完善，比如WebSocket由ws模块代替。</p><p>以下是各个第一代API模块在第二代API中的对照或代替。需要注意即使模块名字一样，API设计也可能有所不同。比如在第一代API中获取屏幕宽度是<code>device.width</code>，在第二代API中则是<code>device.screenWdith</code>。</p><ul><li>app模块</li></ul>`,9),m={href:"/generated/modules/app.html",target:"_blank",rel:"noopener noreferrer"},f=n("ul",null,[n("li",null,"base64模块")],-1),v=n("p",null,[s("在第二代API中使用Buffer代替，比如字符串转换base64："),n("code",null,"Buffer.from('autojs', 'utf8').toString('base64')"),s("，base64转换为字符串："),n("code",null,"Buffer.from('YXV0b2pz', 'base64').toString('utf8')"),s("。")],-1),g=n("ul",null,[n("li",null,"colors模块")],-1),b={href:"/generated/modules/color.html",target:"_blank",rel:"noopener noreferrer"},A=n("ul",null,[n("li",null,"canvas")],-1),I=n("p",null,"UI界面中的canvas与旧版canvas类似。暂不支持无Ui界面下使用Canvas。",-1),P=n("ul",null,[n("li",null,"console模块")],-1),w=n("code",null,"console.log",-1),j={href:"/generated/interfaces/globals.Console.html",target:"_blank",rel:"noopener noreferrer"},x=t("<p>另外，<code>print</code>，<code>log</code>等函数需要使用<code>console.log</code>代替，不能简写。比如<code>log(&#39;hello&#39;)</code>需要替换为<code>console.log(&#39;hello&#39;)</code>。</p><ul><li>crypto模块</li></ul>",2),E={href:"http://nodejs.cn/api-v12/crypto.html",target:"_blank",rel:"noopener noreferrer"},B=n("ul",null,[n("li",null,"debug模块")],-1),y=n("p",null,"在第二代API中暂无代替。",-1),C=n("ul",null,[n("li",null,"device模块")],-1),N=n("ul",null,[n("li",null,"dialogs模块")],-1),q=n("ul",null,[n("li",null,"engines模块")],-1),F=n("ul",null,[n("li",null,"events模块")],-1),V=n("p",null,"第一代API中events模块的事件在第二代API对应如下：",-1),S=n("ol",null,[n("li",null,[n("code",null,"exit"),s(": 用"),n("code",null,"process.on('exit', () => {})"),s("代替")])],-1),T=n("ul",null,[n("li",null,"floaty模块")],-1),U={href:"/generated/modules/floating_window.html",target:"_blank",rel:"noopener noreferrer"},L=n("ul",null,[n("li",null,"files模块")],-1),M={href:"http://nodejs.cn/api-v12/fs.html",target:"_blank",rel:"noopener noreferrer"},$={href:"http://nodejs.cn/api-v12/path.html",target:"_blank",rel:"noopener noreferrer"},z=n("p",null,"globals全局函数与变量",-1),D=n("code",null,"sleep",-1),W={href:"/generated/modules/lang.html#delay",target:"_blank",rel:"noopener noreferrer"},J=n("code",null,"delay",-1),R=n("code",null,"await delay(1000)",-1),H=n("code",null,"toast",-1),O=n("code",null,"toastLog",-1),X={href:"/generated/modules/toast.html#showtoast",target:"_blank",rel:"noopener noreferrer"},Y=n("code",null,"showToast('hello', {log: true})",-1),G=n("code",null,"showToast('hello', {log: true})",-1),K=n("li",null,[n("code",null,"exit"),s(" 使用Node.js函数"),n("code",null,"process.exit()"),s("代替")],-1),Q=n("li",null,[n("code",null,"random"),s(" 使用"),n("code",null,"Math.random"),s("代替，比如:")],-1),Z=t(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">random</span><span class="token punctuation">(</span><span class="token parameter">min<span class="token punctuation">,</span> max</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    min <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">ceil</span><span class="token punctuation">(</span>min<span class="token punctuation">)</span><span class="token punctuation">;</span>
    max <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>max<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token punctuation">(</span>max <span class="token operator">-</span> min <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> min<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">30</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1),nn=n("code",null,"requiresApi",-1),sn={href:"/generated/classes/device.OS.html#requiresandroidversion",target:"_blank",rel:"noopener noreferrer"},en=n("code",null,"requiresAndroidVersion",-1),an=n("li",null,[n("code",null,"requiresAutojsVersion"),s(" 使用"),n("code",null,"process.versions.autojspro"),s("获取Auto.js版本后判断")],-1),tn=n("li",null,[n("code",null,"runtime.requesetPermissions"),s(" 在ui.Activity中使用"),n("code",null,"this.requesetPermissions"),s("代替")],-1),on=n("code",null,"runtime.loadJar",-1),ln=n("code",null,"runtime.loadDex",-1),pn=n("code",null,"$java.loadJar",-1),cn=n("code",null,"$java.loadDex",-1),rn={href:"/generated/interfaces/globals.Java.html#loaddex",target:"_blank",rel:"noopener noreferrer"},un=n("li",null,[n("code",null,"context"),s(" 使用"),n("code",null,"$autojs.androidContext"),s("代替")],-1),dn=n("li",null,[n("p",null,"http模块")],-1),_n={href:"/axios.html",target:"_blank",rel:"noopener noreferrer"},hn=n("ul",null,[n("li",null,"media")],-1),kn={href:"/generated/modules/media.html",target:"_blank",rel:"noopener noreferrer"},mn=n("ul",null,[n("li",null,"plugins")],-1),fn={href:"/generated/modules/plugins.html",target:"_blank",rel:"noopener noreferrer"},vn=n("ul",null,[n("li",null,"power_manager")],-1),gn={href:"/generated/modules/power_manager.html",target:"_blank",rel:"noopener noreferrer"},bn=n("ul",null,[n("li",null,"sensors")],-1),An={href:"/generated/modules/sensors.html",target:"_blank",rel:"noopener noreferrer"},In=n("ul",null,[n("li",null,"shell")],-1),Pn={href:"/generated/modules/shell.html",target:"_blank",rel:"noopener noreferrer"},wn=n("ul",null,[n("li",null,"storages")],-1),jn={href:"/generated/modules/datastore.html",target:"_blank",rel:"noopener noreferrer"},xn=n("ul",null,[n("li",null,"settings")],-1),En={href:"/generated/modules/settings.html",target:"_blank",rel:"noopener noreferrer"},Bn=n("ul",null,[n("li",null,"threads")],-1),yn={href:"/migrate-from-api-v1.html#%E5%A4%9A%E7%BA%BF%E7%A8%8B%E4%B8%8E%E5%BC%82%E6%AD%A5",target:"_blank",rel:"noopener noreferrer"},Cn=n("ul",null,[n("li",null,"timers")],-1),Nn={href:"http://nodejs.cn/api-v12/timers.html",target:"_blank",rel:"noopener noreferrer"},qn=n("code",null,"setTimeout",-1),Fn=n("code",null,"setInterval",-1),Vn=n("ul",null,[n("li",null,"work_manager")],-1),Sn={href:"/generated/modules/work_manager.html",target:"_blank",rel:"noopener noreferrer"},Tn=n("ul",null,[n("li",null,"ui")],-1),Un={href:"/generated/modules/ui.html",target:"_blank",rel:"noopener noreferrer"},Ln={href:"/migrate-from-api-v1.html#UI%E7%95%8C%E9%9D%A2%E4%BB%A3%E7%A0%81%E8%BF%81%E7%A7%BB",target:"_blank",rel:"noopener noreferrer"},Mn=n("ul",null,[n("li",null,"util")],-1),$n={href:"http://nodejs.cn/api-v12/util.html",target:"_blank",rel:"noopener noreferrer"},zn=n("ul",null,[n("li",null,"WebSocket")],-1),Dn={href:"https://www.npmjs.com/package/ws",target:"_blank",rel:"noopener noreferrer"},Wn=n("ul",null,[n("li",null,"zip")],-1),Jn={href:"/generated/modules/zip.html",target:"_blank",rel:"noopener noreferrer"},Rn=t('<h2 id="异步与promise" tabindex="-1"><a class="header-anchor" href="#异步与promise" aria-hidden="true">#</a> 异步与Promise</h2><p>理解异步与Promise是使用第二代API最关键的一步，也是第二代API比第一代门槛高的原因之一。这里我们将简单介绍它们，你可以结合其他网络资料、教学视频等更深入地理解。</p><p>(未完待续)</p><h2 id="ui界面代码迁移" tabindex="-1"><a class="header-anchor" href="#ui界面代码迁移" aria-hidden="true">#</a> UI界面代码迁移</h2><h2 id="多线程与异步" tabindex="-1"><a class="header-anchor" href="#多线程与异步" aria-hidden="true">#</a> 多线程与异步</h2>',5);function Hn(On,Xn){const a=p("ExternalLinkIcon"),o=p("RouterLink");return i(),r("div",null,[n("p",null,[s("如果你对第一代API已比较熟悉，本文将引导你如何从第一代API迁移到第二代API。如果你想了解两代API的优缺点。参考"),n("a",d,[s("第二代api和第一代的区别"),e(a)]),s("。")]),_,n("p",null,[s("为了向前兼容，Pro 9中的代码仍然默认为旧的Rhino引擎/第一代API运行。要使用第二代API需要特别标识，参考"),n("a",h,[s("用Node.js引擎运行代码"),e(a)]),s("。")]),k,n("p",null,[s("在第二代API中使用"),n("a",m,[s("app"),e(a)]),s("模块。")]),f,v,g,n("p",null,[s("在第二代API中使用"),n("a",b,[s("color"),e(a)]),s("模块。")]),A,I,P,n("p",null,[s("对于"),w,s("等函数直接使用即可，无需迁移。设置日志路径等额外参数参考"),n("a",j,[s("Console"),e(a)]),s("。")]),x,n("p",null,[s("在第二代API中使用Node.js模块"),n("a",E,[s("crypto"),e(a)]),s("。")]),B,y,C,n("p",null,[s("在第二代API中使用"),e(o,{to:"/v9/generated/modules/device.html"},{default:l(()=>[s("device")]),_:1}),s("模块。")]),N,n("p",null,[s("在第二代API中使用"),e(o,{to:"/v9/generated/modules/dialogs.html"},{default:l(()=>[s("dialogs")]),_:1}),s("模块。")]),q,n("p",null,[s("在第二代API中使用"),e(o,{to:"/v9/generated/modules/engines.html"},{default:l(()=>[s("engines")]),_:1}),s("模块。")]),F,V,S,T,n("p",null,[s("在第二代API中使用"),n("a",U,[s("floating_window"),e(a)]),s("模块。")]),L,n("p",null,[s("在第二代API中使用Node.js模块"),n("a",M,[s("fs"),e(a)]),s("和"),n("a",$,[s("path"),e(a)]),s("。")]),n("ul",null,[n("li",null,[z,n("ul",null,[n("li",null,[D,s(" 使用"),n("a",W,[s("lang"),e(a)]),s("模块中的"),J,s("函数代替，比如"),R]),n("li",null,[H,s(", "),O,s(" 在"),n("a",X,[s("toast模块"),e(a)]),s("中，比如"),Y,s(", "),G]),K,Q]),Z,n("ul",null,[n("li",null,[nn,s(" 使用"),n("a",sn,[s("device模块"),e(a)]),s("的"),en,s("代替")]),an,tn,n("li",null,[on,s(", "),ln,s(" 使用"),pn,s("/"),cn,s("代替，参加"),n("a",rn,[s("$java"),e(a)])]),un])]),dn]),n("p",null,[s("推荐使用内置的"),n("a",_n,[s("axios模块"),e(a)]),s("代替，功能比http模块强大得多。")]),hn,n("p",null,[s("在第二代API中使用"),n("a",kn,[s("media"),e(a)]),s("模块。")]),mn,n("p",null,[s("在第二代API中使用"),n("a",fn,[s("plugins"),e(a)]),s("模块。")]),vn,n("p",null,[s("在第二代API中使用"),n("a",gn,[s("power_manager"),e(a)]),s("模块。")]),bn,n("p",null,[s("在第二代API中使用"),n("a",An,[s("sensors"),e(a)]),s("模块。")]),In,n("p",null,[s("在第二代API中使用"),n("a",Pn,[s("shell"),e(a)]),s("模块。")]),wn,n("p",null,[s("在第二代API中使用"),n("a",jn,[s("datastore"),e(a)]),s("模块。")]),xn,n("p",null,[s("在第二代API中使用"),n("a",En,[s("settings"),e(a)]),s("模块。")]),Bn,n("p",null,[s("参考"),n("a",yn,[s("多线程与异步"),e(a)]),s("。")]),Cn,n("p",null,[s("在第二代API中使用"),n("a",Nn,[s("timers"),e(a)]),s("模块。实际上"),qn,s(", "),Fn,s("等全局函数在第二代API中也可直接使用。")]),Vn,n("p",null,[s("在第二代API中使用"),n("a",Sn,[s("work_manager"),e(a)]),s("模块。")]),Tn,n("p",null,[s("在第二代API中使用"),n("a",Un,[s("ui"),e(a)]),s("模块。UI模块由于有较大的API差别。参考"),n("a",Ln,[s("UI界面代码迁移"),e(a)]),s("。")]),Mn,n("p",null,[s("在第二代API中使用Node.js模块"),n("a",$n,[s("util"),e(a)])]),zn,n("p",null,[s("使用npm模块"),n("a",Dn,[s("ws"),e(a)]),s("代替。ws模块比第一代API模块中的WebSocket功能更完整、更强大。")]),Wn,n("p",null,[s("在第二代API中使用"),n("a",Jn,[s("zip"),e(a)]),s("模块。")]),Rn])}const Kn=c(u,[["render",Hn],["__file","migrate-from-api-v1.html.vue"]]);export{Kn as default};