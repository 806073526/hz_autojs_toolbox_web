import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o as p,c,d as n,e as a,b as t,f as s}from"./app-ff93bfbc.js";const l={},u=s('<p>本节介绍<code>$ui</code>对象的API文档，这些函数绝大部分需要在<code>&quot;ui&quot;;</code>模式下才能调用。</p><h2 id="ui-layout-xml" tabindex="-1"><a class="header-anchor" href="#ui-layout-xml" aria-hidden="true">#</a> $ui.layout(xml)</h2><ul><li><code>xml</code> {XML} | {string} 布局XML或者XML字符串</li></ul><p>将布局XML渲染为视图（View）对象， 并设置为当前视图。</p><h2 id="ui-layoutfile-xmlfile" tabindex="-1"><a class="header-anchor" href="#ui-layoutfile-xmlfile" aria-hidden="true">#</a> $ui.layoutFile(xmlFile)</h2><ul><li><code>xml</code> {string} 布局XML文件的路径</li></ul><p>此函数和<code>ui.layout</code>相似，只不过允许传入一个xml文件路径来渲染布局。</p><h2 id="ui-inflate-xml-parent-null-attachtoparent-false" tabindex="-1"><a class="header-anchor" href="#ui-inflate-xml-parent-null-attachtoparent-false" aria-hidden="true">#</a> $ui.inflate(xml[, parent = null, attachToParent = false])</h2>',8),r=n("ul",null,[n("li",null,[n("code",null,"xml"),a(" {string} | {XML} 布局XML或者XML字符串")]),n("li",null,[n("code",null,"parent"),a(" {View} 父视图")]),n("li",null,[n("code",null,"attachToParent"),a(" {boolean} 是否渲染的View加到父视图中，默认为false")]),n("li",{View:""},"返回")],-1),d=s(`<p>将布局XML渲染为视图（View）对象。如果该View将作为某个View的子View，我们建议传入<code>parent</code>参数，这样在渲染时依赖于父视图的一些布局属性能够正确应用。</p><p>此函数用于动态创建、显示View。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;ui&quot;</span><span class="token punctuation">;</span>

$ui<span class="token punctuation">.</span><span class="token function">layout</span><span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>linear id<span class="token operator">=</span><span class="token string">&quot;container&quot;</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>linear<span class="token operator">&gt;</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 动态创建3个文本控件，并加到container容器中</span>
<span class="token comment">// 这里仅为实例，实际上并不推荐这种做法，如果要展示列表，</span>
<span class="token comment">// 使用list组件；动态创建十几个、几十个View会让界面卡顿</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">3</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> textView <span class="token operator">=</span> $ui<span class="token punctuation">.</span><span class="token function">inflate</span><span class="token punctuation">(</span>
        <span class="token operator">&lt;</span>text textColor<span class="token operator">=</span><span class="token string">&quot;#000000&quot;</span> textSize<span class="token operator">=</span><span class="token string">&quot;14sp&quot;</span><span class="token operator">/</span><span class="token operator">&gt;</span>
    <span class="token punctuation">,</span> $ui<span class="token punctuation">.</span>container<span class="token punctuation">)</span><span class="token punctuation">;</span>
    textView<span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;文本控件&quot;</span> <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
    $ui<span class="token punctuation">.</span>container<span class="token punctuation">.</span><span class="token function">addView</span><span class="token punctuation">(</span>textView<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ui-registerwidget-name-widget" tabindex="-1"><a class="header-anchor" href="#ui-registerwidget-name-widget" aria-hidden="true">#</a> $ui.registerWidget(name, widget)</h2><ul><li><code>name</code> {string} 组件名称</li><li><code>widget</code> {Function} 组件</li></ul><p>注册一个自定义组件。参考示例-&gt;界面控件-&gt;自定义控件。</p><h2 id="ui-isuithread" tabindex="-1"><a class="header-anchor" href="#ui-isuithread" aria-hidden="true">#</a> $ui.isUiThread()</h2>`,7),k=n("ul",null,[n("li",{boolean:""},"返回")],-1),v=s(`<p>返回当前线程是否是UI线程。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;ui&quot;</span><span class="token punctuation">;</span>

<span class="token function">log</span><span class="token punctuation">(</span>$ui<span class="token punctuation">.</span><span class="token function">isUiThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// =&gt; true</span>

$threads<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">log</span><span class="token punctuation">(</span>$ui<span class="token punctuation">.</span><span class="token function">isUiThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// =&gt; false</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ui-findview-id" tabindex="-1"><a class="header-anchor" href="#ui-findview-id" aria-hidden="true">#</a> $ui.findView(id)</h2>`,3),m=n("ul",null,[n("li",null,[n("code",null,"id"),a(" {string} View的ID")]),n("li",{View:""},"返回")],-1),h=s('<p>在当前视图中根据ID查找相应的视图对象并返回。如果当前未设置视图或找不到此ID的视图时返回<code>null</code>。</p><p>一般我们都是通过<code>ui.xxx</code>来获取id为xxx的控件，如果xxx是一个ui已经有的属性，就可以通过<code>$ui.findView()</code>来获取这个控件。</p><h2 id="ui-finish" tabindex="-1"><a class="header-anchor" href="#ui-finish" aria-hidden="true">#</a> $ui.finish()</h2><p>结束当前活动并销毁界面。</p><h2 id="ui-setcontentview-view" tabindex="-1"><a class="header-anchor" href="#ui-setcontentview-view" aria-hidden="true">#</a> $ui.setContentView(view)</h2>',5),b=n("ul",null,[n("li",{View:""},[n("code",null,"view")])],-1),g=s(`<p>将视图对象设置为当前视图。</p><h2 id="ui-post-callback-delay-0" tabindex="-1"><a class="header-anchor" href="#ui-post-callback-delay-0" aria-hidden="true">#</a> $ui.post(callback[, delay = 0])</h2><ul><li><code>callback</code> {Function} 回调函数</li><li><code>delay</code> {number} 延迟，单位毫秒</li></ul><p>将<code>callback</code>加到UI线程的消息循环中，并延迟delay毫秒后执行（不能准确保证一定在delay毫秒后执行）。</p><p>此函数可以用于UI线程中延时执行动作（sleep不能在UI线程中使用），也可以用于子线程中更新UI。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;ui&quot;</span><span class="token punctuation">;</span>

ui<span class="token punctuation">.</span><span class="token function">layout</span><span class="token punctuation">(</span>
    <span class="token operator">&lt;</span>frame<span class="token operator">&gt;</span>
        <span class="token operator">&lt;</span>text id<span class="token operator">=</span><span class="token string">&quot;result&quot;</span><span class="token operator">/</span><span class="token operator">&gt;</span>
    <span class="token operator">&lt;</span><span class="token operator">/</span>frame<span class="token operator">&gt;</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

ui<span class="token punctuation">.</span>result<span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;计算中&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 在子线程中计算1+ ... + 10000000</span>
threads<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token keyword">let</span> sum <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">1000000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        sum <span class="token operator">+=</span> i<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 由于不能在子线程操作UI，所以要抛到UI线程执行</span>
    ui<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        ui<span class="token punctuation">.</span>result<span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span><span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span> <span class="token function">String</span><span class="token punctuation">(</span>sum<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ui-run-callback" tabindex="-1"><a class="header-anchor" href="#ui-run-callback" aria-hidden="true">#</a> $ui.run(callback)</h2><ul><li><code>callback</code> {Function} 回调函数</li><li>返回 {any} callback的执行结果</li></ul><p>将<code>callback</code>在UI线程中执行。如果当前已经在UI线程中，则直接执行<code>callback</code>；否则将<code>callback</code>抛到UI线程中执行（加到UI线程的消息循环的末尾），<strong>并等待callback执行结束(阻塞当前线程)</strong>。</p><h2 id="ui-statusbarcolor-color" tabindex="-1"><a class="header-anchor" href="#ui-statusbarcolor-color" aria-hidden="true">#</a> $ui.statusBarColor(color)</h2><ul><li><code>color</code> {string | number} 颜色</li></ul><p>设置当前界面的状态栏颜色。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;ui&quot;</span><span class="token punctuation">;</span>
ui<span class="token punctuation">.</span><span class="token function">statusBarColor</span><span class="token punctuation">(</span><span class="token string">&quot;#000000&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="ui-useandroidresources" tabindex="-1"><a class="header-anchor" href="#ui-useandroidresources" aria-hidden="true">#</a> $ui.useAndroidResources()</h2><p>启用使用Android的布局(layout)、绘图(drawable)、动画(anim)、样式(style)等资源的特性。启用该特性后，在project.json中进行以下配置，就可以像写Android原生一样写界面：</p><div class="language-json line-numbers-mode" data-ext="json"><pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token comment">// ...</span>
    androidResources<span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">&quot;resDir&quot;</span><span class="token operator">:</span> <span class="token string">&quot;res&quot;</span><span class="token punctuation">,</span>  <span class="token comment">// 资源文件夹</span>
        <span class="token property">&quot;manifest&quot;</span><span class="token operator">:</span> <span class="token string">&quot;AndroidManifest.xml&quot;</span> <span class="token comment">// AndroidManifest文件路径</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>res文件夹通常为以下结构：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token operator">-</span> res
    <span class="token operator">-</span> layout  <span class="token comment">// 布局资源</span>
    <span class="token operator">-</span> drawable <span class="token comment">// 图片、形状等资源</span>
    <span class="token operator">-</span> menu <span class="token comment">// 菜单资源</span>
    <span class="token operator">-</span> values <span class="token comment">// 样式、字符串等资源</span>
    <span class="token comment">// ...</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可参考示例-&gt;复杂界面-&gt;Android原生界面。</p><h2 id="ui-imagecache-cleardiskcache" tabindex="-1"><a class="header-anchor" href="#ui-imagecache-cleardiskcache" aria-hidden="true">#</a> $ui.imageCache.clearDiskCache()</h2>`,20),f={href:"https://pro.autojs.org/",target:"_blank",rel:"noopener noreferrer"},x=n("p",null,"清除UI的图片文件缓存，通常是清除使用url下载的图片缓存。（比如img控件的url链接加载的图片）",-1),_=n("p",null,"此函数也可用于清除自定义启动图中的图片控件的文件缓存。",-1),w=n("p",null,"此函数和找图找色无关，并不会清除图色相关的图片内存、缓存。",-1),q=n("p",null,"此函数需要若在UI线程执行，会自动切换到IO线程异步执行，因此在UI线程执行时，函数返回不代表文件缓存已全部清理完毕。",-1),y=n("h2",{id:"ui-imagecache-clearmemory",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#ui-imagecache-clearmemory","aria-hidden":"true"},"#"),a(" $ui.imageCache.clearMemory()")],-1),V={href:"https://pro.autojs.org/",target:"_blank",rel:"noopener noreferrer"},$=n("p",null,"清除UI的图片内存缓存。",-1),j=n("p",null,"此函数和找图找色无关，并不会清除图色相关的图片内存、缓存。",-1);function I(U,M){const e=i("ExternalLinkIcon");return p(),c("div",null,[u,r,d,k,v,m,h,b,g,n("p",null,[n("strong",null,[a("["),n("a",f,[a("Pro 8.8.16新增"),t(e)]),a("]")])]),x,_,w,q,y,n("p",null,[n("strong",null,[a("["),n("a",V,[a("Pro 8.8.16新增"),t(e)]),a("]")])]),$,j])}const C=o(l,[["render",I],["__file","api.html.vue"]]);export{C as default};