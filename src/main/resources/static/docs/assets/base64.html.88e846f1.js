import{_ as o}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as c,c as p,a as n,b as s,d as a,e as t,r}from"./app.6aa2b576.js";const i={},d=n("h1",{id:"base64",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#base64","aria-hidden":"true"},"#"),s(" base64")],-1),l=n("p",null,"\u63D0\u4F9B\u57FA\u672C\u7684Base64\u8F6C\u6362\u51FD\u6570\u3002",-1),u=n("h2",{id:"base64-encode-str-encoding-utf-8",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#base64-encode-str-encoding-utf-8","aria-hidden":"true"},"#"),s(" $base64.encode(str, encoding = 'utf-8')")],-1),h={href:"https://pro.autojs.org/",target:"_blank",rel:"noopener noreferrer"},k=t(`<ul><li><code><span class="token property">str</span></code> {string} \u8981\u7F16\u7801\u7684\u5B57\u7B26\u4E32</li><li><code><span class="token property">encoding</span></code> {string} \u53EF\u9009\uFF0C\u5B57\u7B26\u7F16\u7801</li></ul><p>\u5C06\u5B57\u7B26\u4E32str\u4F7F\u7528Base64\u7F16\u7801\u5E76\u8FD4\u56DE\u7F16\u7801\u540E\u7684\u5B57\u7B26\u4E32\u3002</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>$base64<span class="token punctuation">.</span><span class="token function">encode</span><span class="token punctuation">(</span><span class="token string">&#39;test&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \u6253\u5370dGVzdA==</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="base64-decode-str-encoding-utf-8" tabindex="-1"><a class="header-anchor" href="#base64-decode-str-encoding-utf-8" aria-hidden="true">#</a> $base64.decode(str, encoding = &#39;utf-8&#39;)</h2>`,4),_={href:"https://pro.autojs.org/",target:"_blank",rel:"noopener noreferrer"},g=t(`<ul><li><code><span class="token property">str</span></code> {string} \u8981\u89E3\u7801\u7684\u5B57\u7B26\u4E32</li><li><code><span class="token property">encoding</span></code> {string} \u53EF\u9009\uFF0C\u5B57\u7B26\u7F16\u7801</li></ul><p>\u5C06\u5B57\u7B26\u4E32str\u4F7F\u7528Base64\u89E3\u7801\u5E76\u8FD4\u56DE\u89E3\u7801\u540E\u7684\u5B57\u7B26\u4E32\u3002</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>$base64<span class="token punctuation">.</span><span class="token function">decode</span><span class="token punctuation">(</span><span class="token string">&#39;dGVzdA==&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// \u6253\u5370test</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,3);function b(f,m){const e=r("ExternalLinkIcon");return c(),p("div",null,[d,l,u,n("p",null,[s("** ["),n("a",h,[s("Pro 7.0.4\u65B0\u589E"),a(e)]),s("] **")]),k,n("p",null,[s("** ["),n("a",_,[s("Pro 7.0.4\u65B0\u589E"),a(e)]),s("] **")]),g])}const j=o(i,[["render",b],["__file","base64.html.vue"]]);export{j as default};