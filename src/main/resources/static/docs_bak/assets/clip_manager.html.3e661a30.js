import{_ as c}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as l,c as i,a as n,d as s,w as t,b as a,e as r,r as o}from"./app.6aa2b576.js";const d={},u=n("h1",{id:"clip-manager",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#clip-manager","aria-hidden":"true"},"#"),a(" clip_manager")],-1),h=n("p",null,"Clipboard module, used to get and set clipboard content. In Android 10 or higher, unless the app has focus, the app cannot access clipboard data.",-1),k=n("p",null,[n("strong",null,[n("code",null,[n("span",{class:"token property"},"See")])])],-1),g={href:"https://developer.android.com/about/versions/10/privacy/changes#clipboard-data",target:"_blank",rel:"noopener noreferrer"},m=n("h2",{id:"table-of-contents",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#table-of-contents","aria-hidden":"true"},"#"),a(" Table of contents")],-1),b=n("h3",{id:"interfaces",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#interfaces","aria-hidden":"true"},"#"),a(" Interfaces")],-1),v=n("h3",{id:"variables",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#variables","aria-hidden":"true"},"#"),a(" Variables")],-1),_=n("h3",{id:"functions",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#functions","aria-hidden":"true"},"#"),a(" Functions")],-1),f=n("h2",{id:"variables-1",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#variables-1","aria-hidden":"true"},"#"),a(" Variables")],-1),x=n("h3",{id:"clipboardmanager",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#clipboardmanager","aria-hidden":"true"},"#"),a(" clipboardManager")],-1),y=n("code",null,[n("span",{class:"token property"},"Const")],-1),C=n("strong",null,"clipboardManager",-1),j=n("code",null,[n("span",{class:"token property"},"ClipboardManager")],-1),q=n("p",null,"Clipboard manager. Used to get, set, and listen to clipboard content.",-1),w=n("p",null,[n("strong",null,[n("code",null,[n("span",{class:"token property"},"See")])])],-1),M=r(`<p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> clipboardManager<span class="token punctuation">,</span> getClip <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;clip_manager&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
clipboardManager<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;clip_changed&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;clipboard changed:&quot;</span><span class="token punctuation">,</span> <span class="token function">getClip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
$autojs<span class="token punctuation">.</span><span class="token function">keepRunning</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="functions-1" tabindex="-1"><a class="header-anchor" href="#functions-1" aria-hidden="true">#</a> Functions</h2><h3 id="clearclip" tabindex="-1"><a class="header-anchor" href="#clearclip" aria-hidden="true">#</a> clearClip</h3><p>\u25B8 <strong>clearClip</strong>(): <code><span class="token keyword">void</span></code></p><p>Clear clipboard content.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> clearClip <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;clip_manager&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">clearClip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="getclip" tabindex="-1"><a class="header-anchor" href="#getclip" aria-hidden="true">#</a> getClip</h3><p>\u25B8 <strong>getClip</strong>(): <code><span class="token property">string</span></code> | <code><span class="token keyword">null</span></code></p><p>Get clipboard content.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> getClip <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;clip_manager&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">getClip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="returns-1" tabindex="-1"><a class="header-anchor" href="#returns-1" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">string</span></code> | <code><span class="token keyword">null</span></code></p><p>Text content</p><hr><h3 id="hasclip" tabindex="-1"><a class="header-anchor" href="#hasclip" aria-hidden="true">#</a> hasClip</h3><p>\u25B8 <strong>hasClip</strong>(): <code><span class="token property">boolean</span></code></p><p>Determine if clipboard has content.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> hasClip <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;clip_manager&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">hasClip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">boolean</span></code></p><p>If there is content, return true, otherwise return false.</p><hr><h3 id="setclip" tabindex="-1"><a class="header-anchor" href="#setclip" aria-hidden="true">#</a> setClip</h3><p>\u25B8 <strong>setClip</strong>(<code><span class="token property">text</span></code>): <code><span class="token keyword">void</span></code></p><p>Set clipboard content.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> setClip <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;clip_manager&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">setClip</span><span class="token punctuation">(</span><span class="token string">&#39;Hello World!&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">text</span></code></td><td style="text-align:left;"><code><span class="token property">string</span></code></td><td style="text-align:left;">Text content</td></tr></tbody></table><h4 id="returns-3" tabindex="-1"><a class="header-anchor" href="#returns-3" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p>`,38);function E(R,V){const e=o("RouterLink"),p=o("ExternalLinkIcon");return l(),i("div",null,[n("p",null,[s(e,{to:"/en/v9/generated/"},{default:t(()=>[a("Auto.js Pro 9 Docs")]),_:1}),a(" / clip_manager")]),u,h,k,n("p",null,[n("a",g,[a("Limited access to clipboard data"),s(p)])]),m,b,n("ul",null,[n("li",null,[s(e,{to:"/en/v9/generated/interfaces/clip_manager.ClipboardManager.html"},{default:t(()=>[a("ClipboardManager")]),_:1})])]),v,n("ul",null,[n("li",null,[s(e,{to:"/en/v9/generated/modules/clip_manager.html#clipboardmanager"},{default:t(()=>[a("clipboardManager")]),_:1})])]),_,n("ul",null,[n("li",null,[s(e,{to:"/en/v9/generated/modules/clip_manager.html#clearclip"},{default:t(()=>[a("clearClip")]),_:1})]),n("li",null,[s(e,{to:"/en/v9/generated/modules/clip_manager.html#getclip"},{default:t(()=>[a("getClip")]),_:1})]),n("li",null,[s(e,{to:"/en/v9/generated/modules/clip_manager.html#hasclip"},{default:t(()=>[a("hasClip")]),_:1})]),n("li",null,[s(e,{to:"/en/v9/generated/modules/clip_manager.html#setclip"},{default:t(()=>[a("setClip")]),_:1})])]),f,x,n("p",null,[a("\u2022 "),y,a(),C,a(": "),s(e,{to:"/en/v9/generated/interfaces/clip_manager.ClipboardManager.html"},{default:t(()=>[j]),_:1})]),q,w,n("p",null,[s(e,{to:"/en/v9/generated/interfaces/clip_manager.ClipboardManager.html"},{default:t(()=>[a("ClipboardManager")]),_:1})]),M])}const N=c(d,[["render",E],["__file","clip_manager.html.vue"]]);export{N as default};