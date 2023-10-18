import{_ as t}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as e,c as p,a as n,d as o,w as l,b as s,e as c,r as i}from"./app.6aa2b576.js";const r={},u=n("h1",{id:"\u7C7B-deferred-t",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#\u7C7B-deferred-t","aria-hidden":"true"},"#"),s(" \u7C7B: Deferred<T>")],-1),k=c(`<p>Deferred\u7C7B\uFF0C\u7528\u4E8E\u521B\u5EFAPromise\u7684\u5EF6\u8FDF\u5BF9\u8C61\uFF0C\u800C\u65E0\u9700\u4F7F\u7528<code><span class="token keyword">new</span> <span class="token class-name">Promise</span></code>\u3002\u901A\u8FC7resolve\u6216reject\u51FD\u6570\u53EF\u4EE5\u8BBE\u7F6EPromise\u7684\u72B6\u6001\u3002</p><p><strong><code>\u793A\u4F8B</code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> Deferred <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;lang&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">await</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token parameter">a<span class="token punctuation">,</span> b</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> d <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Deferred</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        d<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>a <span class="token operator">+</span> b<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> d<span class="token punctuation">.</span><span class="token function">promise</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

## \u7C7B\u578B\u53C2\u6570

<span class="token operator">|</span> \u540D\u79F0 <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

## \u76EE\u5F55

### Constructors

<span class="token operator">-</span> <span class="token punctuation">[</span>constructor<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#constructor<span class="token punctuation">)</span>

### Accessors

<span class="token operator">-</span> <span class="token punctuation">[</span>value<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#value<span class="token punctuation">)</span>

### \u65B9\u6CD5

<span class="token operator">-</span> <span class="token punctuation">[</span>promise<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#promise<span class="token punctuation">)</span>
<span class="token operator">-</span> <span class="token punctuation">[</span>reject<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#reject<span class="token punctuation">)</span>
<span class="token operator">-</span> <span class="token punctuation">[</span>resolve<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#resolve<span class="token punctuation">)</span>

## Constructors

### constructor

\u2022 <span class="token operator">**</span><span class="token keyword">new</span> <span class="token class-name">Deferred</span><span class="token operator">**</span><span class="token operator">&lt;</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>\\<span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">keepRunning?</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>

#### \u7C7B\u578B\u53C2\u6570

<span class="token operator">|</span> \u540D\u79F0 <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

#### \u53C2\u6570

<span class="token operator">|</span> \u540D\u79F0 <span class="token operator">|</span> \u7C7B\u578B <span class="token operator">|</span> Default value <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">keepRunning</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">true</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

## Accessors

### value

\u2022 <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">get</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">**</span>value<span class="token operator">**</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">undefined</span><span class="token template-punctuation string">\`</span></span> \\<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>

\u83B7\u53D6Deferred\u7684\u503C\uFF0C\u5982\u679C\u4E3Apending\u6216rejected\u72B6\u6001\uFF0C\u5219\u8FD4\u56DE<span class="token keyword">undefined</span>\u3002

#### \u8FD4\u56DE\u503C

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">undefined</span><span class="token template-punctuation string">\`</span></span> \\<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>

## \u65B9\u6CD5

### promise

\u25B8 <span class="token operator">**</span>promise<span class="token operator">**</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Promise</span><span class="token template-punctuation string">\`</span></span><span class="token operator">&lt;</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>\\<span class="token operator">&gt;</span>

#### \u8FD4\u56DE\u503C

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Promise</span><span class="token template-punctuation string">\`</span></span><span class="token operator">&lt;</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>\\<span class="token operator">&gt;</span>

___

### reject

\u25B8 <span class="token operator">**</span>reject<span class="token operator">**</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">reason?</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>

\u4F7F\u7528\u7ED9\u5B9A\u7684reason\u4F5C\u4E3A\u539F\u56E0\u6216\u5F02\u5E38\u8BBE\u7F6EPromise\u7684\u72B6\u6001\u4E3Arejected\u3002\u82E5\u5DF2\u7ECFresolved\u6216rejected\u72B6\u6001\uFF0C\u5219\u8FD4\u56DE<span class="token boolean">false</span>\u3002

#### \u53C2\u6570

<span class="token operator">|</span> \u540D\u79F0 <span class="token operator">|</span> \u7C7B\u578B <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">reason?</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">any</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

#### \u8FD4\u56DE\u503C

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>

___

### resolve

\u25B8 <span class="token operator">**</span>resolve<span class="token operator">**</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">value</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>

\u4F7F\u7528\u7ED9\u5B9A\u7684\u503C\u8BBE\u7F6EPromise\u7684\u72B6\u6001\u4E3Afulfilled\u3002\u82E5\u5DF2\u7ECF\u662Ffulfilled\u6216rejected\u72B6\u6001\uFF0C\u5219\u8FD4\u56DE<span class="token boolean">false</span>\u3002

#### \u53C2\u6570

<span class="token operator">|</span> \u540D\u79F0 <span class="token operator">|</span> \u7C7B\u578B <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">value</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

#### \u8FD4\u56DE\u503C

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function d(v,m){const a=i("RouterLink");return e(),p("div",null,[u,n("p",null,[o(a,{to:"/zh/v9/generated/modules/lang.html"},{default:l(()=>[s("lang")]),_:1}),s(".Deferred")]),k])}const f=t(r,[["render",d],["__file","lang.Deferred.html.vue"]]);export{f as default};
