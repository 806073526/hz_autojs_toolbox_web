import{_ as p}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o as c,c as d,d as n,e as t,b as e,w as a,f as l}from"./app-ff93bfbc.js";const u={},r=n("p",null,"Zip模块用于处理文件的压缩和解压，并支持加密压缩。",-1),h=n("p",null,[n("strong",null,[n("code",null,"参见")])],-1),_={href:"https://javadoc.io/doc/net.lingala.zip4j/zip4j/1.3.2/index.html",target:"_blank",rel:"noopener noreferrer"},f=n("h2",{id:"目录",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#目录","aria-hidden":"true"},"#"),t(" 目录")],-1),k=n("h3",{id:"接口",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#接口","aria-hidden":"true"},"#"),t(" 接口")],-1),g=n("h3",{id:"类型别名",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#类型别名","aria-hidden":"true"},"#"),t(" 类型别名")],-1),z=n("h3",{id:"函数",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#函数","aria-hidden":"true"},"#"),t(" 函数")],-1),v=l('<h2 id="类型别名-1" tabindex="-1"><a class="header-anchor" href="#类型别名-1" aria-hidden="true">#</a> 类型别名</h2><h3 id="zipfileattribute" tabindex="-1"><a class="header-anchor" href="#zipfileattribute" aria-hidden="true">#</a> ZipFileAttribute</h3><p>Ƭ <strong>ZipFileAttribute</strong>: <code>&quot;all&quot;</code> | <code>&quot;archive&quot;</code> | <code>&quot;dateTime&quot;</code> | <code>&quot;hidden&quot;</code> | <code>&quot;system&quot;</code> | <code>&quot;readOnly&quot;</code></p><ul><li>alls 所有属性</li><li>archive 压缩包属性</li><li>dateTime 时间</li><li>hidden 是否隐藏</li><li>readOnly 是否只读</li><li>system 是否为系统文件</li></ul><p><strong><code>参见</code></strong></p>',5),m=n("h2",{id:"函数-1",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#函数-1","aria-hidden":"true"},"#"),t(" 函数")],-1),x=n("h3",{id:"open",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#open","aria-hidden":"true"},"#"),t(" open")],-1),y=n("strong",null,"open",-1),b=n("code",null,"file",-1),F=n("code",null,"ZipFile",-1),Z=l('<h4 id="参数" tabindex="-1"><a class="header-anchor" href="#参数" aria-hidden="true">#</a> 参数</h4><table><thead><tr><th style="text-align:left;">名称</th><th style="text-align:left;">类型</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;"><code>file</code></td><td style="text-align:left;"><code>string</code></td><td style="text-align:left;">压缩包文件路径</td></tr></tbody></table><h4 id="返回值" tabindex="-1"><a class="header-anchor" href="#返回值" aria-hidden="true">#</a> 返回值</h4>',3),j=n("code",null,"ZipFile",-1),q=l(`<hr><h3 id="unzip" tabindex="-1"><a class="header-anchor" href="#unzip" aria-hidden="true">#</a> unzip</h3><p>▸ <strong>unzip</strong>(<code>zipFile</code>, <code>dest</code>, <code>options?</code>): <code>Promise</code>&lt;<code>void</code>&gt;</p><p>解压zip文件。如果文件夹<code>dest</code>不存在则创建该文件夹并将内容解压到里面；如果<code>dest</code>已经存在，则在<code>dest</code>下面创建一个和<code>zipFile</code>文件同名的文件夹，并将内容解压到里面。</p><p><strong><code>示例</code></strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> unzip<span class="token punctuation">,</span> zipDir <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;zip&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// create a zip file with password</span>
    <span class="token keyword">const</span> zipFilePath <span class="token operator">=</span> <span class="token string">&#39;./dest.zip&#39;</span><span class="token punctuation">;</span>
    <span class="token keyword">await</span> <span class="token function">zipDir</span><span class="token punctuation">(</span><span class="token string">&#39;./dir&#39;</span><span class="token punctuation">,</span> zipFilePath<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">password</span><span class="token operator">:</span> <span class="token string">&#39;Auto.js Pro&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// unzip the zip file</span>
    <span class="token keyword">await</span> <span class="token function">unzip</span><span class="token punctuation">(</span>zipFilePath<span class="token punctuation">,</span> <span class="token string">&#39;./dest&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">password</span><span class="token operator">:</span> <span class="token string">&#39;Auto.js Pro&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="参数-1" tabindex="-1"><a class="header-anchor" href="#参数-1" aria-hidden="true">#</a> 参数</h4>`,7),w=n("thead",null,[n("tr",null,[n("th",{style:{"text-align":"left"}},"名称"),n("th",{style:{"text-align":"left"}},"类型"),n("th",{style:{"text-align":"left"}},"描述")])],-1),O=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"zipFile")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string")]),n("td",{style:{"text-align":"left"}},"需解压的压缩包文件路径")],-1),P=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"dest")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string")]),n("td",{style:{"text-align":"left"}},"解压后的文件夹目录")],-1),L=n("td",{style:{"text-align":"left"}},[n("code",null,"options?")],-1),D={style:{"text-align":"left"}},A=n("code",null,"UnzipOptions",-1),U=n("td",{style:{"text-align":"left"}},"解压选项，可选",-1),N=n("h4",{id:"返回值-1",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#返回值-1","aria-hidden":"true"},"#"),t(" 返回值")],-1),V=n("p",null,[n("code",null,"Promise"),t("<"),n("code",null,"void"),t(">")],-1),B=n("hr",null,null,-1),E=n("h3",{id:"zipdir",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#zipdir","aria-hidden":"true"},"#"),t(" zipDir")],-1),T=n("strong",null,"zipDir",-1),C=n("code",null,"dir",-1),I=n("code",null,"dest",-1),R=n("code",null,"options?",-1),S=n("code",null,"Promise",-1),G=n("code",null,"ZipFile",-1),H=l(`<p>压缩文件夹下所有文件/文件夹，生成到目标路径<code>dest</code>。</p><p><strong><code>示例</code></strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> zipDir <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;zip&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">zipDir</span><span class="token punctuation">(</span><span class="token string">&#39;./dir&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;./dest.zip&#39;</span><span class="token punctuation">)</span>
 <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">zipFile</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>zipFile<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="参数-2" tabindex="-1"><a class="header-anchor" href="#参数-2" aria-hidden="true">#</a> 参数</h4>`,4),J=n("thead",null,[n("tr",null,[n("th",{style:{"text-align":"left"}},"名称"),n("th",{style:{"text-align":"left"}},"类型"),n("th",{style:{"text-align":"left"}},"描述")])],-1),K=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"dir")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string")]),n("td",{style:{"text-align":"left"}},"需要压缩的文件夹路径，如果文件夹下有子文件夹均会一并压缩")],-1),M=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"dest")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string")]),n("td",{style:{"text-align":"left"}},"压缩后的压缩包存放路径")],-1),Q=n("td",{style:{"text-align":"left"}},[n("code",null,"options?")],-1),W={style:{"text-align":"left"}},X=n("code",null,"ZipOptions",-1),Y=n("td",{style:{"text-align":"left"}},"可选参数",-1),$=n("h4",{id:"返回值-2",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#返回值-2","aria-hidden":"true"},"#"),t(" 返回值")],-1),nn=n("code",null,"Promise",-1),tn=n("code",null,"ZipFile",-1),en=n("hr",null,null,-1),sn=n("h3",{id:"zipfile",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#zipfile","aria-hidden":"true"},"#"),t(" zipFile")],-1),an=n("strong",null,"zipFile",-1),ln=n("code",null,"file",-1),on=n("code",null,"dest",-1),pn=n("code",null,"options?",-1),cn=n("code",null,"Promise",-1),dn=n("code",null,"ZipFile",-1),un=l(`<p>压缩单文件<code>file</code>到路径<code>dest</code>。</p><p><strong><code>示例</code></strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> zipFile <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;zip&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">zipFile</span><span class="token punctuation">(</span><span class="token string">&#39;./file.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;./dest.zip&#39;</span><span class="token punctuation">)</span>
 <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">zipFile</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>zipFile<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="参数-3" tabindex="-1"><a class="header-anchor" href="#参数-3" aria-hidden="true">#</a> 参数</h4>`,4),rn=n("thead",null,[n("tr",null,[n("th",{style:{"text-align":"left"}},"名称"),n("th",{style:{"text-align":"left"}},"类型"),n("th",{style:{"text-align":"left"}},"描述")])],-1),hn=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"file")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string")]),n("td",{style:{"text-align":"left"}},"需要压缩的单文件路径。")],-1),_n=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"dest")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string")]),n("td",{style:{"text-align":"left"}},"压缩后的压缩包存放路径")],-1),fn=n("td",{style:{"text-align":"left"}},[n("code",null,"options?")],-1),kn={style:{"text-align":"left"}},gn=n("code",null,"ZipOptions",-1),zn=n("td",{style:{"text-align":"left"}},"选项",-1),vn=n("h4",{id:"返回值-3",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#返回值-3","aria-hidden":"true"},"#"),t(" 返回值")],-1),mn=n("code",null,"Promise",-1),xn=n("code",null,"ZipFile",-1),yn=n("hr",null,null,-1),bn=n("h3",{id:"zipfiles",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#zipfiles","aria-hidden":"true"},"#"),t(" zipFiles")],-1),Fn=n("strong",null,"zipFiles",-1),Zn=n("code",null,"fileList",-1),jn=n("code",null,"dest",-1),qn=n("code",null,"options?",-1),wn=n("code",null,"Promise",-1),On=n("code",null,"ZipFile",-1),Pn=l(`<p>压缩多个文件<code>fileList</code>到路径<code>dest</code>。<code>fileList</code>中不能包含文件夹。</p><p><strong><code>示例</code></strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> zipFiles <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;zip&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">zipFiles</span><span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token string">&#39;./file1.txt&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;./file2.txt&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">&#39;./dest.zip&#39;</span><span class="token punctuation">)</span>
 <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">zipFile</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>zipFile<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="参数-4" tabindex="-1"><a class="header-anchor" href="#参数-4" aria-hidden="true">#</a> 参数</h4>`,4),Ln=n("thead",null,[n("tr",null,[n("th",{style:{"text-align":"left"}},"名称"),n("th",{style:{"text-align":"left"}},"类型"),n("th",{style:{"text-align":"left"}},"描述")])],-1),Dn=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"fileList")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string"),t("[]")]),n("td",{style:{"text-align":"left"}},"需压缩的多个文件路径的数组")],-1),An=n("tr",null,[n("td",{style:{"text-align":"left"}},[n("code",null,"dest")]),n("td",{style:{"text-align":"left"}},[n("code",null,"string")]),n("td",{style:{"text-align":"left"}},"压缩目标路径")],-1),Un=n("td",{style:{"text-align":"left"}},[n("code",null,"options?")],-1),Nn={style:{"text-align":"left"}},Vn=n("code",null,"ZipOptions",-1),Bn=n("td",{style:{"text-align":"left"}},"选项",-1),En=n("h4",{id:"返回值-4",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#返回值-4","aria-hidden":"true"},"#"),t(" 返回值")],-1),Tn=n("code",null,"Promise",-1);function Cn(In,Rn){const o=i("ExternalLinkIcon"),s=i("RouterLink");return c(),d("div",null,[r,h,n("p",null,[n("a",_,[t("zip4j"),e(o)])]),f,k,n("ul",null,[n("li",null,[e(s,{to:"/v9/generated/interfaces/zip.UnzipOptions.html"},{default:a(()=>[t("UnzipOptions")]),_:1})]),n("li",null,[e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[t("ZipFile")]),_:1})]),n("li",null,[e(s,{to:"/v9/generated/interfaces/zip.ZipOptions.html"},{default:a(()=>[t("ZipOptions")]),_:1})])]),g,n("ul",null,[n("li",null,[e(s,{to:"/v9/generated/modules/zip.html#zipfileattribute"},{default:a(()=>[t("ZipFileAttribute")]),_:1})])]),z,n("ul",null,[n("li",null,[e(s,{to:"/v9/generated/modules/zip.html#open"},{default:a(()=>[t("open")]),_:1})]),n("li",null,[e(s,{to:"/v9/generated/modules/zip.html#unzip"},{default:a(()=>[t("unzip")]),_:1})]),n("li",null,[e(s,{to:"/v9/generated/modules/zip.html#zipdir"},{default:a(()=>[t("zipDir")]),_:1})]),n("li",null,[e(s,{to:"/v9/generated/modules/zip.html#zipfile"},{default:a(()=>[t("zipFile")]),_:1})]),n("li",null,[e(s,{to:"/v9/generated/modules/zip.html#zipfiles"},{default:a(()=>[t("zipFiles")]),_:1})])]),v,n("p",null,[e(s,{to:"/v9/generated/interfaces/zip.UnzipOptions.html#ignoreattributes"},{default:a(()=>[t("ignoreAttributes")]),_:1})]),m,x,n("p",null,[t("▸ "),y,t("("),b,t("): "),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[F]),_:1})]),n("p",null,[t("打开一个zip文件，返回"),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[t("ZipFile")]),_:1}),t("对象，可对该对象进行进一步的zip操作。")]),Z,n("p",null,[e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[j]),_:1})]),q,n("table",null,[w,n("tbody",null,[O,P,n("tr",null,[L,n("td",D,[e(s,{to:"/v9/generated/interfaces/zip.UnzipOptions.html"},{default:a(()=>[A]),_:1})]),U])])]),N,V,B,E,n("p",null,[t("▸ "),T,t("("),C,t(", "),I,t(", "),R,t("): "),S,t("<"),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[G]),_:1}),t(">")]),H,n("table",null,[J,n("tbody",null,[K,M,n("tr",null,[Q,n("td",W,[e(s,{to:"/v9/generated/interfaces/zip.ZipOptions.html"},{default:a(()=>[X]),_:1})]),Y])])]),$,n("p",null,[nn,t("<"),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[tn]),_:1}),t(">")]),en,sn,n("p",null,[t("▸ "),an,t("("),ln,t(", "),on,t(", "),pn,t("): "),cn,t("<"),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[dn]),_:1}),t(">")]),un,n("table",null,[rn,n("tbody",null,[hn,_n,n("tr",null,[fn,n("td",kn,[e(s,{to:"/v9/generated/interfaces/zip.ZipOptions.html"},{default:a(()=>[gn]),_:1})]),zn])])]),vn,n("p",null,[mn,t("<"),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[xn]),_:1}),t(">")]),yn,bn,n("p",null,[t("▸ "),Fn,t("("),Zn,t(", "),jn,t(", "),qn,t("): "),wn,t("<"),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"},{default:a(()=>[On]),_:1}),t(">")]),Pn,n("table",null,[Ln,n("tbody",null,[Dn,An,n("tr",null,[Un,n("td",Nn,[e(s,{to:"/v9/generated/interfaces/zip.ZipOptions.html"},{default:a(()=>[Vn]),_:1})]),Bn])])]),En,n("p",null,[Tn,t("<"),e(s,{to:"/v9/generated/interfaces/zip.ZipFile.html"}),t(">")])])}const Hn=p(u,[["render",Cn],["__file","zip.html.vue"]]);export{Hn as default};