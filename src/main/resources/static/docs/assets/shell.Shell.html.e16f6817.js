import{_ as o}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as r,c as d,a as e,d as s,w as a,b as t,e as l,r as c}from"./app.6aa2b576.js";const p={},i=e("h1",{id:"interface-shell",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#interface-shell","aria-hidden":"true"},"#"),t(" Interface: Shell")],-1),h=l('<h2 id="hierarchy" tabindex="-1"><a class="header-anchor" href="#hierarchy" aria-hidden="true">#</a> Hierarchy</h2><ul><li><p><code><span class="token property">unknown</span></code></p><p>\u21B3 <strong><code><span class="token property">Shell</span></code></strong></p></li></ul><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="methods" tabindex="-1"><a class="header-anchor" href="#methods" aria-hidden="true">#</a> Methods</h3>',4),u=e("h3",{id:"events",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#events","aria-hidden":"true"},"#"),t(" Events")],-1),_=e("h2",{id:"methods-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods-1","aria-hidden":"true"},"#"),t(" Methods")],-1),k=e("h3",{id:"exec",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#exec","aria-hidden":"true"},"#"),t(" exec")],-1),y=e("strong",null,"exec",-1),f=e("code",null,[e("span",{class:"token property"},"cmd")],-1),m=e("code",null,[e("span",{class:"token property"},"Promise")],-1),x=e("code",null,[e("span",{class:"token property"},"ExecutionResult")],-1),g=l(`<p>Execute a shell command and wait for the result asynchronously.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> createShell <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;shell&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> shell <span class="token operator">=</span> <span class="token function">createShell</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> shell<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&quot;touch test.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> shell<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span><span class="token string">&quot;ls -l test.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">await</span> shell<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">cmd</span></code></td><td style="text-align:left;"><code><span class="token property">string</span></code></td><td style="text-align:left;">Shell command to execute</td></tr></tbody></table><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4>`,6),b=e("code",null,[e("span",{class:"token property"},"Promise")],-1),v=e("code",null,[e("span",{class:"token property"},"ExecutionResult")],-1),w=e("p",null,"Promise of the execution result",-1),S=e("hr",null,null,-1),E=e("h3",{id:"exit",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#exit","aria-hidden":"true"},"#"),t(" exit")],-1),R=e("strong",null,"exit",-1),P=e("code",null,[t("forcedly"),e("span",{class:"token operator"},"?")],-1),N=e("code",null,[e("span",{class:"token property"},"Promise")],-1),T=e("code",null,[e("span",{class:"token property"},"ExitResult")],-1),q=l('<p>Exit the shell process. If forcedly is true, the process will be terminated and the return value will be a string representing the signal that killed the process. If forcedly is false, the process will be terminated by <code><span class="token property">exit</span></code> command and the return value will be the exit code.</p><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code>forcedly<span class="token operator">?</span></code></td><td style="text-align:left;"><code><span class="token property">boolean</span></code></td></tr></tbody></table><h4 id="returns-1" tabindex="-1"><a class="header-anchor" href="#returns-1" aria-hidden="true">#</a> Returns</h4>',4),j=e("code",null,[e("span",{class:"token property"},"Promise")],-1),B=e("code",null,[e("span",{class:"token property"},"ExitResult")],-1),I=l('<hr><h3 id="submit" tabindex="-1"><a class="header-anchor" href="#submit" aria-hidden="true">#</a> submit</h3><p>\u25B8 <strong>submit</strong>(<code><span class="token property">input</span></code>): <code><span class="token keyword">void</span></code></p><p>Submit text to shell&#39;s standard input. If the text does not end with a newline character, a newline character will be appended automatically.</p><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">input</span></code></td><td style="text-align:left;"><code><span class="token property">string</span></code></td></tr></tbody></table><h4 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><h2 id="events-1" tabindex="-1"><a class="header-anchor" href="#events-1" aria-hidden="true">#</a> Events</h2><h3 id="on" tabindex="-1"><a class="header-anchor" href="#on" aria-hidden="true">#</a> on</h3>',10),V=e("strong",null,"on",-1),C=e("code",null,[e("span",{class:"token property"},"event")],-1),D=e("code",null,[e("span",{class:"token property"},"listener")],-1),L=e("code",null,[e("span",{class:"token property"},"Shell")],-1),M=e("p",null,[t("Event emitted when shell's standard output or standard error has new data. "),e("code",null,[e("span",{class:"token property"},"type")]),t(" parameter is used to distinguish standard output and standard error.")],-1),O=e("p",null,"data",-1),A=e("h4",{id:"parameters-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters-3","aria-hidden":"true"},"#"),t(" Parameters")],-1),H=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),z=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"event")])]),e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token string"},'"data"')])])],-1),F=e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"listener")])],-1),G={style:{"text-align":"left"}},J=e("code",null,[e("span",{class:"token property"},"chunk")],-1),K=e("code",null,[e("span",{class:"token property"},"Buffer")],-1),Q=e("code",null,[e("span",{class:"token property"},"type")],-1),U=e("code",null,[e("span",{class:"token property"},"StandardOutputType")],-1),W=e("code",null,[e("span",{class:"token keyword"},"void")],-1),X=e("h4",{id:"returns-3",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-3","aria-hidden":"true"},"#"),t(" Returns")],-1),Y=e("code",null,[e("span",{class:"token property"},"Shell")],-1),Z=e("strong",null,"on",-1),$=e("code",null,[e("span",{class:"token property"},"event")],-1),ee=e("code",null,[e("span",{class:"token property"},"listener")],-1),te=e("code",null,[e("span",{class:"token property"},"Shell")],-1),ne=e("p",null,[t("Event emitted when shell's standard output or standard error has new line. "),e("code",null,[e("span",{class:"token property"},"type")]),t(" parameter is used to distinguish standard output and standard error.")],-1),se=e("p",null,"line",-1),ae=e("h4",{id:"parameters-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters-4","aria-hidden":"true"},"#"),t(" Parameters")],-1),le=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type")])],-1),oe=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"event")])]),e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token string"},'"line"')])])],-1),re=e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"listener")])],-1),de={style:{"text-align":"left"}},ce=e("code",null,[e("span",{class:"token property"},"line")],-1),pe=e("code",null,[e("span",{class:"token property"},"string")],-1),ie=e("code",null,[e("span",{class:"token property"},"type")],-1),he=e("code",null,[e("span",{class:"token property"},"StandardOutputType")],-1),ue=e("code",null,[e("span",{class:"token keyword"},"void")],-1),_e=e("h4",{id:"returns-4",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-4","aria-hidden":"true"},"#"),t(" Returns")],-1),ke=e("code",null,[e("span",{class:"token property"},"Shell")],-1);function ye(fe,me){const n=c("RouterLink");return r(),d("div",null,[e("p",null,[s(n,{to:"/en/v9/generated/"},{default:a(()=>[t("Auto.js Pro 9 Docs")]),_:1}),t(" / "),s(n,{to:"/en/v9/generated/modules/shell.html"},{default:a(()=>[t("shell")]),_:1}),t(" / Shell")]),i,e("p",null,[s(n,{to:"/en/v9/generated/modules/shell.html"},{default:a(()=>[t("shell")]),_:1}),t(".Shell")]),e("p",null,[t("Shell class. Created new instance by "),s(n,{to:"/en/v9/generated/modules/shell.html#createshell"},{default:a(()=>[t("createShell")]),_:1}),t(".")]),h,e("ul",null,[e("li",null,[s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html#exec"},{default:a(()=>[t("exec")]),_:1})]),e("li",null,[s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html#exit"},{default:a(()=>[t("exit")]),_:1})]),e("li",null,[s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html#submit"},{default:a(()=>[t("submit")]),_:1})])]),u,e("ul",null,[e("li",null,[s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html#on"},{default:a(()=>[t("on")]),_:1})])]),_,k,e("p",null,[t("\u25B8 "),y,t("("),f,t("): "),m,t("<"),s(n,{to:"/en/v9/generated/interfaces/shell.ExecutionResult.html"},{default:a(()=>[x]),_:1}),t(">")]),g,e("p",null,[b,t("<"),s(n,{to:"/en/v9/generated/interfaces/shell.ExecutionResult.html"},{default:a(()=>[v]),_:1}),t(">")]),w,S,E,e("p",null,[t("\u25B8 "),R,t("("),P,t("): "),N,t("<"),s(n,{to:"/en/v9/generated/modules/shell.html#exitresult"},{default:a(()=>[T]),_:1}),t(">")]),q,e("p",null,[j,t("<"),s(n,{to:"/en/v9/generated/modules/shell.html#exitresult"},{default:a(()=>[B]),_:1}),t(">")]),I,e("p",null,[t("\u25B8 "),V,t("("),C,t(", "),D,t("): "),s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html"},{default:a(()=>[L]),_:1})]),M,O,A,e("table",null,[H,e("tbody",null,[z,e("tr",null,[F,e("td",G,[t("("),J,t(": "),K,t(", "),Q,t(": "),s(n,{to:"/en/v9/generated/modules/shell.html#standardoutputtype"},{default:a(()=>[U]),_:1}),t(") => "),W])])])]),X,e("p",null,[s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html"},{default:a(()=>[Y]),_:1})]),e("p",null,[t("\u25B8 "),Z,t("("),$,t(", "),ee,t("): "),s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html"},{default:a(()=>[te]),_:1})]),ne,se,ae,e("table",null,[le,e("tbody",null,[oe,e("tr",null,[re,e("td",de,[t("("),ce,t(": "),pe,t(", "),ie,t(": "),s(n,{to:"/en/v9/generated/modules/shell.html#standardoutputtype"},{default:a(()=>[he]),_:1}),t(") => "),ue])])])]),_e,e("p",null,[s(n,{to:"/en/v9/generated/interfaces/shell.Shell.html"},{default:a(()=>[ke]),_:1})])])}const be=o(p,[["render",ye],["__file","shell.Shell.html.vue"]]);export{be as default};