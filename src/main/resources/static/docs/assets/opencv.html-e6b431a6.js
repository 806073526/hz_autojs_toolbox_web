import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as p,c,d as n,e as s,b as e,f as l}from"./app-ff93bfbc.js";const r={},u={href:"https://www.npmjs.com/package/opencv4nodejs",target:"_blank",rel:"noopener noreferrer"},i={href:"https://www.npmjs.com/package/@autojs/opencv?activeTab=readme",target:"_blank",rel:"noopener noreferrer"},k=n("code",null,"npm i",-1),d=n("p",null,"本模块比较重要的类有Mat, Rect, Point等。",-1),v=n("p",null,"有关opencv4nodejs的更多文档参见：",-1),m={href:"https://docs.opencv.org/4.5.1/index.html",target:"_blank",rel:"noopener noreferrer"},_={href:"https://docs.opencv.org/4.5.1/d3/d63/classcv_1_1Mat.html",target:"_blank",rel:"noopener noreferrer"},h={href:"https://www.npmjs.com/package/@autojs/opencv?activeTab=readme#quick-start",target:"_blank",rel:"noopener noreferrer"},w={href:"https://justadudewhohacks.github.io/opencv4nodejs/docs/Mat",target:"_blank",rel:"noopener noreferrer"},b=l(`<p>由于OpenCV本身的内容比较庞大，不太可能将OpenCV的文档翻译并迁移到这里，因此OpenCV部分需要自行阅读和理解上述英文文档。</p><p><strong><code>示例</code></strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> cv <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@autojs/opencv&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> rows <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span> <span class="token comment">// height</span>
<span class="token keyword">const</span> cols <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span> <span class="token comment">// width</span>
<span class="token keyword">const</span> emptyMat <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">cv<span class="token punctuation">.</span>Mat</span><span class="token punctuation">(</span>rows<span class="token punctuation">,</span> cols<span class="token punctuation">,</span> cv<span class="token punctuation">.</span><span class="token constant">CV_8UC3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// fill the Mat with default value</span>
<span class="token keyword">const</span> whiteMat <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">cv<span class="token punctuation">.</span>Mat</span><span class="token punctuation">(</span>rows<span class="token punctuation">,</span> cols<span class="token punctuation">,</span> cv<span class="token punctuation">.</span><span class="token constant">CV_8UC1</span><span class="token punctuation">,</span> <span class="token number">255</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> blueMat <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">cv<span class="token punctuation">.</span>Mat</span><span class="token punctuation">(</span>rows<span class="token punctuation">,</span> cols<span class="token punctuation">,</span> cv<span class="token punctuation">.</span><span class="token constant">CV_8UC3</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token number">255</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function f(g,j){const a=o("ExternalLinkIcon");return p(),c("div",null,[n("p",null,[s("Auto.js Pro 9将"),n("a",u,[s("opencv4nodejs"),e(a)]),s("迁移到了内置模块"),n("a",i,[s("@autojs/opencv"),e(a)]),s("。你可以像使用opencv4nodejs模块一样使用它而无需用"),k,s("安装。")]),d,v,n("ol",null,[n("li",null,[n("a",m,[s("OpenCV 4.5.1文档"),e(a)]),s("，"),n("a",_,[s("OpenCV Mat"),e(a)])]),n("li",null,[n("a",h,[s("opencv4nodejs Quick Start"),e(a)]),s("。")]),n("li",null,[n("a",w,[s("opencv4nodejs 文档"),e(a)])])]),b])}const M=t(r,[["render",f],["__file","opencv.html.vue"]]);export{M as default};