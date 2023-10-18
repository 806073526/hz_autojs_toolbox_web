import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c as l,a as s,d as t,w as e,b as n,e as c,r as i}from"./app.6aa2b576.js";const r={},u=s("h1",{id:"class-deferred-t",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#class-deferred-t","aria-hidden":"true"},"#"),n(" Class: Deferred<T>")],-1),k=c(`<p>A Deferred that can be completed via public functions resolve or reject. Unlike the Promise class, this class does not require the <code><span class="token keyword">new</span></code> keyword.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
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

## Type parameters

<span class="token operator">|</span> Name <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

## Table <span class="token keyword">of</span> contents

### Constructors

<span class="token operator">-</span> <span class="token punctuation">[</span>constructor<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#constructor<span class="token punctuation">)</span>

### Accessors

<span class="token operator">-</span> <span class="token punctuation">[</span>value<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#value<span class="token punctuation">)</span>

### Methods

<span class="token operator">-</span> <span class="token punctuation">[</span>promise<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#promise<span class="token punctuation">)</span>
<span class="token operator">-</span> <span class="token punctuation">[</span>reject<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#reject<span class="token punctuation">)</span>
<span class="token operator">-</span> <span class="token punctuation">[</span>resolve<span class="token punctuation">]</span><span class="token punctuation">(</span>lang<span class="token punctuation">.</span>Deferred<span class="token punctuation">.</span>md#resolve<span class="token punctuation">)</span>

## Constructors

### constructor

\u2022 <span class="token operator">**</span><span class="token keyword">new</span> <span class="token class-name">Deferred</span><span class="token operator">**</span><span class="token operator">&lt;</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>\\<span class="token operator">&gt;</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">keepRunning?</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span>

#### Type parameters

<span class="token operator">|</span> Name <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

#### Parameters

<span class="token operator">|</span> Name <span class="token operator">|</span> Type <span class="token operator">|</span> Default value <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">keepRunning</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">true</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

## Accessors

### value

\u2022 <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">get</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">**</span>value<span class="token operator">**</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">undefined</span><span class="token template-punctuation string">\`</span></span> \\<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>

Gets the value <span class="token keyword">of</span> the Deferred<span class="token punctuation">,</span> <span class="token keyword">if</span> it is pending or rejected<span class="token punctuation">,</span> then returns <span class="token keyword">undefined</span><span class="token punctuation">.</span>

#### Returns

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">undefined</span><span class="token template-punctuation string">\`</span></span> \\<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>

## Methods

### promise

\u25B8 <span class="token operator">**</span>promise<span class="token operator">**</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Promise</span><span class="token template-punctuation string">\`</span></span><span class="token operator">&lt;</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>\\<span class="token operator">&gt;</span>

#### Returns

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">Promise</span><span class="token template-punctuation string">\`</span></span><span class="token operator">&lt;</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span>\\<span class="token operator">&gt;</span>

___

### reject

\u25B8 <span class="token operator">**</span>reject<span class="token operator">**</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">reason?</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>

Sets the state <span class="token keyword">of</span> the Promise to rejected using the given reason or exception<span class="token punctuation">.</span> If the Promise is already fulfilled or rejected<span class="token punctuation">,</span> returns <span class="token boolean">false</span><span class="token punctuation">.</span>

#### Parameters

<span class="token operator">|</span> Name <span class="token operator">|</span> Type <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">reason?</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">any</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

#### Returns

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>

___

### resolve

\u25B8 <span class="token operator">**</span>resolve<span class="token operator">**</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">value</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>

Sets the state <span class="token keyword">of</span> the Promise to fulfilled using the given value<span class="token punctuation">.</span> If the Promise is already fulfilled or rejected<span class="token punctuation">,</span> returns <span class="token boolean">false</span><span class="token punctuation">.</span>

#### Parameters

<span class="token operator">|</span> Name <span class="token operator">|</span> Type <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span> <span class="token operator">:</span><span class="token operator">--</span><span class="token operator">--</span><span class="token operator">--</span> <span class="token operator">|</span>
<span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">value</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">T</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">|</span>

#### Returns

<span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">boolean</span><span class="token template-punctuation string">\`</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3);function d(v,m){const a=i("RouterLink");return o(),l("div",null,[s("p",null,[t(a,{to:"/en/v9/generated/"},{default:e(()=>[n("Auto.js Pro 9 Docs")]),_:1}),n(" / "),t(a,{to:"/en/v9/generated/modules/lang.html"},{default:e(()=>[n("lang")]),_:1}),n(" / Deferred")]),u,s("p",null,[t(a,{to:"/en/v9/generated/modules/lang.html"},{default:e(()=>[n("lang")]),_:1}),n(".Deferred")]),k])}const f=p(r,[["render",d],["__file","lang.Deferred.html.vue"]]);export{f as default};
