import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as c,c as l,a as n,d as t,w as e,b as s,e as o,r as i}from"./app.6aa2b576.js";const r={},u=o('<h1 id="datastore" tabindex="-1"><a class="header-anchor" href="#datastore" aria-hidden="true">#</a> datastore</h1><p>datastore\u5373\u672C\u5730\u5B58\u50A8\uFF0C\u91C7\u7528key-value\u5F62\u5F0F\u5B58\u50A8\uFF0C\u7C7B\u4F3C\u4E8E\u7B2C\u4E00\u4EE3API\u4E2D\u7684<code><span class="token property">storages</span></code>\u6A21\u5757\uFF0C\u5E76\u589E\u52A0\u4E86\u5F02\u6B65\u8BFB\u53D6\u3001\u6570\u636E\u52A0\u5BC6\u3001\u81EA\u5B9A\u4E49\u5E8F\u5217\u5316\u7684\u529F\u80FD\u3002</p><p>datastore\u652F\u6301<code><span class="token property">number</span></code>\u3001<code><span class="token property">boolean</span></code>\u3001<code><span class="token property">string</span></code>\u3001<code><span class="token property">Array</span></code>\u3001<code><span class="token property">Object</span></code>\u3001<code><span class="token keyword">null</span></code>\u3001<code><span class="token keyword">undefined</span></code>\u7B49\u53EF\u8F6C\u6362\u4E3Ajson\u7684\u6570\u636E\u7C7B\u578B\u3002</p><p>datastore\u4FDD\u5B58\u7684\u6570\u636E\u9664\u975E\u5E94\u7528\u88AB\u5378\u8F7D\u6216\u8005\u88AB\u4E3B\u52A8\u5220\u9664\uFF0C\u5426\u5219\u4F1A\u4E00\u76F4\u4FDD\u7559\u3002</p><p>\u4E0D\u540C\u5E94\u7528\u7684\u6570\u636E\u662F\u9694\u79BB\u7684\uFF0C\u4E5F\u5373\u5728Auto.js Pro\u672C\u4F53\u548C\u6253\u5305\u7684\u5E94\u7528\u4E2D\u7684\u6570\u636E\u5E76\u4E0D\u4E92\u901A\uFF1B\u540C\u4E00\u5E94\u7528\u7684\u4E0D\u540C\u811A\u672C\u7684\u6570\u636E\u662F\u5171\u4EAB\u7684\uFF0C\u5728datastore\u4E0D\u52A0\u5BC6\u7684\u60C5\u51B5\u4E0B\uFF0C\u4EFB\u4F55\u811A\u672C\u53EA\u8981\u77E5\u9053datastore\u540D\u79F0\u4FBF\u53EF\u4EE5\u83B7\u53D6\u5230\u76F8\u5E94\u7684\u6570\u636E\u3002</p>',5),d=n("code",null,[n("span",{class:"token property"},"encryptionKey")],-1),k=o(`<p>\u53E6\u5916\uFF0Cdatastore\u4FDD\u5B58\u7684\u6570\u636E\u548C\u7B2C\u4E00\u4EE3API\u7684<code><span class="token property">storages</span></code>\u5E76\u4E0D\u4E92\u901A\uFF0C\u5373\u4F7F\u540D\u79F0\u76F8\u540C\uFF0C\u5B83\u4EEC\u4E4B\u95F4\u7684\u6570\u636E\u4E5F\u4E0D\u5171\u4EAB\u3002</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> createDatastore <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;datastore&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// \u521B\u5EFA\u672C\u5730\u5B58\u50A8\uFF0C\u5176\u540D\u79F0\u4E3Aexample.test</span>
<span class="token keyword">const</span> datastore <span class="token operator">=</span> <span class="token function">createDatastore</span><span class="token punctuation">(</span><span class="token string">&#39;example.test&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u5728\u672C\u5730\u5B58\u50A8\u4E2D\u5199\u5165\u503C</span>
    <span class="token keyword">await</span> datastore<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;world&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// \u4ECE\u5B58\u50A8\u4E2D\u83B7\u53D6\u503C</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;get hello:&#39;</span><span class="token punctuation">,</span> <span class="token keyword">await</span> datastore<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// \u79FB\u9664\u672C\u5730\u5B58\u50A8\u7684\u503C\uFF0C\u5E76\u8FD4\u56DE\u88AB\u79FB\u9664\u7684\u503C</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;remove hello:&#39;</span><span class="token punctuation">,</span> <span class="token keyword">await</span> datastore<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// \u68C0\u67E5\u662F\u5426\u5305\u542B\u67D0\u4E2Akey</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;contains hello:&#39;</span><span class="token punctuation">,</span> <span class="token keyword">await</span> datastore<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">&#39;hello&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// \u4FDD\u5B58\u548C\u8BFB\u53D6\u590D\u6742\u5BF9\u8C61\uFF08\u5BF9\u8C61\u5FC5\u987B\u662F\u53EF\u8F6C\u6362\u4E3AJSON\u7684\u6570\u636E\uFF09</span>
    <span class="token keyword">await</span> datastore<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&#39;versions&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">autojspro</span><span class="token operator">:</span> process<span class="token punctuation">.</span>versions<span class="token punctuation">.</span>autojspro<span class="token punctuation">,</span> <span class="token literal-property property">nodejs</span><span class="token operator">:</span> process<span class="token punctuation">.</span>version <span class="token punctuation">}</span><span class="token punctuation">)</span>
    <span class="token keyword">const</span> versions <span class="token operator">=</span> <span class="token keyword">await</span> datastore<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;versions&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;versions:&#39;</span><span class="token punctuation">,</span> versions<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// \u6E05\u7A7A\u672C\u5730\u5B58\u50A8</span>
    <span class="token keyword">await</span> datastore<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span>console<span class="token punctuation">.</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="interfaces" tabindex="-1"><a class="header-anchor" href="#interfaces" aria-hidden="true">#</a> Interfaces</h3>`,5),m=n("h3",{id:"functions",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#functions","aria-hidden":"true"},"#"),s(" Functions")],-1),v=n("h2",{id:"functions-1",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#functions-1","aria-hidden":"true"},"#"),s(" Functions")],-1),h=n("h3",{id:"createdatastore",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#createdatastore","aria-hidden":"true"},"#"),s(" createDatastore")],-1),f=n("strong",null,"createDatastore",-1),y=n("code",null,[n("span",{class:"token property"},"name")],-1),g=n("code",null,[s("options"),n("span",{class:"token operator"},"?")],-1),_=n("code",null,[n("span",{class:"token property"},"Datastore")],-1),b=o(`<p>\u521B\u5EFA\u4E00\u4E2A\u672C\u5730\u5B58\u50A8\u3002\u4E0D\u540C\u540D\u79F0\u7684\u672C\u5730\u5B58\u50A8\u7684\u6570\u636E\u662F\u9694\u5F00\u7684\uFF0C\u800C\u76F8\u540C\u540D\u79F0\u7684\u672C\u5730\u5B58\u50A8\u7684\u6570\u636E\u662F\u5171\u4EAB\u7684\u3002</p><p>\u82E5\u672C\u5730\u5B58\u50A8\u5DF2\u52A0\u5BC6\uFF0C\u5E76\u4E14\u521B\u5EFA\u65F6\u672A\u6307\u5B9A\u6216\u6307\u5B9A\u4E86\u9519\u8BEF\u7684\u5BC6\u94A5\uFF0C\u5219\u521B\u5EFA\u65F6\u4E5F\u4E0D\u4F1A\u53D1\u751F\u9519\u8BEF\uFF0C\u5728\u83B7\u53D6\u6570\u636E\u65F6\u53EF\u80FD\u83B7\u53D6\u5230\u9519\u8BEF\u7684\u6570\u636E\u6216\u8005\u629B\u51FA\u53CD\u5E8F\u5217\u5316\u5F02\u5E38\u3002</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// \u521B\u5EFA\u52A0\u5BC6\u7684\u672C\u5730\u5B58\u50A8\uFF0C\u5BC6\u94A5\u4E3A\u957F\u5EA616, 32\u621664\u7684\u5B57\u7B26\u4E32</span>
<span class="token keyword">const</span> encrptedDatastore <span class="token operator">=</span> <span class="token function">createDatastore</span><span class="token punctuation">(</span><span class="token string">&#39;example.encrypted&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">encryptionKey</span><span class="token operator">:</span> <span class="token string">&#39;bCGwOgwzsCqXQFaW&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u4F7F\u7528\u52A0\u5BC6\u7684\u672C\u5730\u5B58\u50A8\u4FDD\u5B58\u6570\u636E</span>
    <span class="token keyword">await</span> encrptedDatastore<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&#39;timestamp&#39;</span><span class="token punctuation">,</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// \u4ECE\u52A0\u5BC6\u7684\u672C\u5730\u5B58\u50A8\u4E2D\u8BFB\u53D6\u6570\u636E</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;timestamp:&#39;</span><span class="token punctuation">,</span> <span class="token keyword">await</span> encrptedDatastore<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&#39;timestamp&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span>console<span class="token punctuation">.</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4>`,5),w=n("thead",null,[n("tr",null,[n("th",{style:{"text-align":"left"}},"Name"),n("th",{style:{"text-align":"left"}},"Type"),n("th",{style:{"text-align":"left"}},"Description")])],-1),x=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,[n("span",{class:"token property"},"name")])]),n("td",{style:{"text-align":"left"}},[n("code",null,[n("span",{class:"token property"},"string")])]),n("td",{style:{"text-align":"left"}},"\u4E3A\u521B\u5EFA\u7684\u672C\u5730\u5B58\u50A8\u6570\u636E\u547D\u540D")],-1),D=n("td",{style:{"text-align":"left"}},[n("code",null,[s("options"),n("span",{class:"token operator"},"?")])],-1),j={style:{"text-align":"left"}},O=n("code",null,[n("span",{class:"token property"},"DatastoreOptions")],-1),N=n("td",{style:{"text-align":"left"}},"\u521B\u5EFA\u7684\u672C\u5730\u5B58\u50A8\u7684\u9009\u9879",-1),A=n("h4",{id:"returns",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#returns","aria-hidden":"true"},"#"),s(" Returns")],-1),E=n("code",null,[n("span",{class:"token property"},"Datastore")],-1);function P(C,S){const a=i("RouterLink");return c(),l("div",null,[n("p",null,[t(a,{to:"/en/v9/generated/"},{default:e(()=>[s("Auto.js Pro 9 Docs")]),_:1}),s(" / datastore")]),u,n("p",null,[s("\u82E5\u8981\u4FDD\u5B58\u7A0D\u5FAE\u654F\u611F\u7684\u6570\u636E\uFF0C\u53EF\u4EE5\u5728\u521B\u5EFAdatastore\u65F6\u6307\u5B9A"),d,s("\u5BF9\u672C\u5730\u5B58\u50A8\u8FDB\u884C\u52A0\u5BC6\u3002\u4F46\u662F\u9700\u8981\u6CE8\u610F\uFF0C\u5176\u4ED6\u4EBA\u53EF\u80FD\u901A\u8FC7\u4F60\u7684\u4EE3\u7801\u83B7\u53D6\u5BC6\u94A5\u5E76\u89E3\u5BC6\u6570\u636E\uFF0C\u4FDD\u5B58\u5728\u5BA2\u6237\u7AEF\u7684\u6570\u636E\u76F8\u5BF9\u662F\u4E0D\u5B89\u5168\u7684\u3002\u53C2\u89C1"),t(a,{to:"/en/v9/generated/interfaces/datastore.DatastoreOptions.html#encryptionkey"},{default:e(()=>[s("encryptionKey")]),_:1}),s("\u3002")]),k,n("ul",null,[n("li",null,[t(a,{to:"/en/v9/generated/interfaces/datastore.Datastore.html"},{default:e(()=>[s("Datastore")]),_:1})]),n("li",null,[t(a,{to:"/en/v9/generated/interfaces/datastore.DatastoreEditor.html"},{default:e(()=>[s("DatastoreEditor")]),_:1})]),n("li",null,[t(a,{to:"/en/v9/generated/interfaces/datastore.DatastoreOptions.html"},{default:e(()=>[s("DatastoreOptions")]),_:1})]),n("li",null,[t(a,{to:"/en/v9/generated/interfaces/datastore.Serializer.html"},{default:e(()=>[s("Serializer")]),_:1})])]),m,n("ul",null,[n("li",null,[t(a,{to:"/en/v9/generated/modules/datastore.html#createdatastore"},{default:e(()=>[s("createDatastore")]),_:1})])]),v,h,n("p",null,[s("\u25B8 "),f,s("("),y,s(", "),g,s("): "),t(a,{to:"/en/v9/generated/interfaces/datastore.Datastore.html"},{default:e(()=>[_]),_:1})]),b,n("table",null,[w,n("tbody",null,[x,n("tr",null,[D,n("td",j,[t(a,{to:"/en/v9/generated/interfaces/datastore.DatastoreOptions.html"},{default:e(()=>[O]),_:1})]),N])])]),A,n("p",null,[t(a,{to:"/en/v9/generated/interfaces/datastore.Datastore.html"},{default:e(()=>[E]),_:1})])])}const B=p(r,[["render",P],["__file","datastore.html.vue"]]);export{B as default};