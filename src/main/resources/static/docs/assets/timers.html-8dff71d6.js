import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as s,f as e}from"./app-ff93bfbc.js";const t={},c=e(`<blockquote><p>Stability: 2 - Stable</p></blockquote><p>timers 模块暴露了一个全局的 API，用于在某个未来时间段调用调度函数。 因为定时器函数是全局的，所以使用该 API 无需调用 timers.</p><p>Auto.js 中的计时器函数实现了与 Web 浏览器提供的定时器类似的 API，除了它使用了一个不同的内部实现，它是基于 Android Looper-Handler消息循环机制构建的。其实现机制与Node.js比较相似。</p><p>例如，要在5秒后发出消息&quot;hello&quot;:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token function">toast</span><span class="token punctuation">(</span><span class="token string">&quot;hello&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要注意的是，这些定时器仍然是单线程的。如果脚本主体有耗时操作或死循环，则设定的定时器不能被及时执行，例如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">//这里的语句会在15秒后执行而不是5秒后</span>
    <span class="token function">toast</span><span class="token punctuation">(</span><span class="token string">&quot;hello&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//暂停10秒</span>
<span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>再如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">//这里的语句永远不会被执行</span>
    <span class="token function">toast</span><span class="token punctuation">(</span><span class="token string">&quot;hello&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//死循环</span>
<span class="token keyword">while</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="setinterval-callback-delay-args" tabindex="-1"><a class="header-anchor" href="#setinterval-callback-delay-args" aria-hidden="true">#</a> setInterval(callback, delay[, ...args])</h2><ul><li><code>callback</code> {Function} 当定时器到点时要调用的函数。</li><li><code>delay</code> {number} 调用 callback 之前要等待的毫秒数。</li><li><code>...args</code> {any} 当调用 callback 时要传入的可选参数。</li></ul><p>预定每隔 delay 毫秒重复执行的 callback。 返回一个用于 clearInterval() 的 id。</p><p>当 delay 小于 0 时，delay 会被设为 0。</p><h2 id="settimeout-callback-delay-args" tabindex="-1"><a class="header-anchor" href="#settimeout-callback-delay-args" aria-hidden="true">#</a> setTimeout(callback, delay[, ...args])</h2><ul><li><code>callback</code> {Function} 当定时器到点时要调用的函数。</li><li><code>delay</code> {number} 调用 callback 之前要等待的毫秒数。</li><li><code>...args</code> {any} 当调用 callback 时要传入的可选参数。</li></ul><p>预定在 delay 毫秒之后执行的单次 callback。 返回一个用于 clearTimeout() 的 id。</p><p>callback 可能不会精确地在 delay 毫秒被调用。 Auto.js 不能保证回调被触发的确切时间，也不能保证它们的顺序。 回调会在尽可能接近所指定的时间上调用。</p><p>当 delay 小于 0 时，delay 会被设为 0。</p><h2 id="setimmediate-callback-args" tabindex="-1"><a class="header-anchor" href="#setimmediate-callback-args" aria-hidden="true">#</a> setImmediate(callback[, ...args])</h2><ul><li><code>callback</code> {Function} 在Looper循环的当前回合结束时要调用的函数。</li><li><code>...args</code> {any} 当调用 callback 时要传入的可选参数。</li></ul><p>预定立即执行的 callback，它是在 I/O 事件的回调之后被触发。 返回一个用于 clearImmediate() 的 id。</p><p>当多次调用 setImmediate() 时，callback 函数会按照它们被创建的顺序依次执行。 每次事件循环迭代都会处理整个回调队列。 如果一个立即定时器是被一个正在执行的回调排入队列的，则该定时器直到下一次事件循环迭代才会被触发。</p><p>setImmediate()、setInterval() 和 setTimeout() 方法每次都会返回表示预定的计时器的id。 它们可用于取消定时器并防止触发。</p><h2 id="clearinterval-id" tabindex="-1"><a class="header-anchor" href="#clearinterval-id" aria-hidden="true">#</a> clearInterval(id)</h2><ul><li><code>id</code> {number} 一个 setInterval() 返回的 id。</li></ul><p>取消一个由 setInterval() 创建的循环定时任务。</p><p>例如：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">//每5秒就发出一次hello</span>
<span class="token keyword">var</span> id <span class="token operator">=</span> <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token function">toast</span><span class="token punctuation">(</span><span class="token string">&quot;hello&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">//1分钟后取消循环</span>
<span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token function">clearInterval</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">60</span> <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="cleartimeout-id" tabindex="-1"><a class="header-anchor" href="#cleartimeout-id" aria-hidden="true">#</a> clearTimeout(id)</h2><ul><li><code>id</code> {number} 一个 setTimeout() 返回的 id。</li></ul><p>取消一个由 setTimeout() 创建的定时任务。</p><h2 id="clearimmediate-id" tabindex="-1"><a class="header-anchor" href="#clearimmediate-id" aria-hidden="true">#</a> clearImmediate(id)</h2><ul><li><code>id</code> {number} 一个 setImmediate() 返回的 id。</li></ul><p>取消一个由 setImmediate() 创建的 Immediate 对象。</p>`,34),l=[c];function p(i,o){return n(),s("div",null,l)}const r=a(t,[["render",p],["__file","timers.html.vue"]]);export{r as default};