import{_ as c}from"./plugin-vue_export-helper-c27b6911.js";import{r,o as i,c as d,d as n,b as s,w as a,e,f as l}from"./app-ff93bfbc.js";const p={},u=n("p",null,"sensors模块提供了获取手机上的传感器的信息的支持，这些传感器包括距离传感器、光线光感器、重力传感器、方向传感器等。需要指出的是，本模块只能获取传感器的数据，Auto.js Pro不提供模拟或伪造传感器的数据和事件的功能。",-1),h=n("h2",{id:"目录",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#目录","aria-hidden":"true"},"#"),e(" 目录")],-1),_=n("h3",{id:"枚举",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#枚举","aria-hidden":"true"},"#"),e(" 枚举")],-1),k=n("h3",{id:"接口",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#接口","aria-hidden":"true"},"#"),e(" 接口")],-1),g=n("h3",{id:"类型别名",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#类型别名","aria-hidden":"true"},"#"),e(" 类型别名")],-1),f=n("h3",{id:"函数",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#函数","aria-hidden":"true"},"#"),e(" 函数")],-1),m=n("h2",{id:"类型别名-1",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#类型别名-1","aria-hidden":"true"},"#"),e(" 类型别名")],-1),v=n("h3",{id:"sensor",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#sensor","aria-hidden":"true"},"#"),e(" Sensor")],-1),b=n("strong",null,"Sensor",-1),x=n("code",null,"AndroidSensor",-1),S=n("code",null,"SensorExt",-1),y={href:"/v9/generated/modules/sensors.html#getsensor",target:"_blank",rel:"noopener noreferrer"},E={href:"https://developer.android.google.cn/reference/android/hardware/Sensor",target:"_blank",rel:"noopener noreferrer"},q={href:"https://pro.autojs.org/docs/zh/v9/generated/interfaces/sensors.SensorExt.md",target:"_blank",rel:"noopener noreferrer"},j=n("h2",{id:"函数-1",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#函数-1","aria-hidden":"true"},"#"),e(" 函数")],-1),w=n("h3",{id:"getsensor",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#getsensor","aria-hidden":"true"},"#"),e(" getSensor")],-1),L=n("strong",null,"getSensor",-1),N=n("code",null,"name",-1),A=n("code",null,"Sensor",-1),D=n("code",null,"undefined",-1),V=l("<p>通过传感器名称获取传感器对象，如果找不到该名称对应的传感器，则返回<code>undefined</code>。</p><p>常见的传感器列表有：</p><ul><li><code>accelerometer</code> 加速度传感器</li><li><code>magnetic_field</code> 磁场传感器</li><li><code>orientation</code> 方向传感器</li><li><code>gyroscope</code> 陀螺仪传感器</li><li><code>light</code> 光线传感器</li><li><code>pressure</code> 压力传感器</li><li><code>temperature</code> 温度传感器</li><li><code>proximity</code> 接近(距离)传感器</li><li><code>gravity</code> 重力传感器</li><li><code>linear_acceleration</code> 线性加速度传感器</li></ul>",3),B={href:"https://developer.android.google.cn/reference/android/hardware/Sensor#TYPE_ALL",target:"_blank",rel:"noopener noreferrer"},R=l(`<p><strong><code>示例</code></strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> getSensor<span class="token punctuation">,</span> SensorDelay <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;sensors&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> sensor <span class="token operator">=</span> <span class="token function">getSensor</span><span class="token punctuation">(</span><span class="token string">&quot;light&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
sensor<span class="token punctuation">.</span><span class="token function">enableSensorEvent</span><span class="token punctuation">(</span>SensorDelay<span class="token punctuation">.</span>Normal<span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;change&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">light</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>light<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
$autojs<span class="token punctuation">.</span><span class="token function">keepRunning</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="参数" tabindex="-1"><a class="header-anchor" href="#参数" aria-hidden="true">#</a> 参数</h4><table><thead><tr><th style="text-align:left;">名称</th><th style="text-align:left;">类型</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td style="text-align:left;"><code>name</code></td><td style="text-align:left;"><code>string</code></td><td style="text-align:left;">传感器名称</td></tr></tbody></table><h4 id="返回值" tabindex="-1"><a class="header-anchor" href="#返回值" aria-hidden="true">#</a> 返回值</h4>`,5),C=n("code",null,"Sensor",-1),I=n("code",null,"undefined",-1),P=n("p",null,"传感器对象，或者undefined",-1);function T(z,Y){const t=r("RouterLink"),o=r("ExternalLinkIcon");return i(),d("div",null,[u,h,_,n("ul",null,[n("li",null,[s(t,{to:"/v9/generated/enums/sensors.SensorDelay.html"},{default:a(()=>[e("SensorDelay")]),_:1})])]),k,n("ul",null,[n("li",null,[s(t,{to:"/v9/generated/interfaces/sensors.SensorExt.html"},{default:a(()=>[e("SensorExt")]),_:1})])]),g,n("ul",null,[n("li",null,[s(t,{to:"/v9/generated/modules/sensors.html#sensor"},{default:a(()=>[e("Sensor")]),_:1})])]),f,n("ul",null,[n("li",null,[s(t,{to:"/v9/generated/modules/sensors.html#getsensor"},{default:a(()=>[e("getSensor")]),_:1})])]),m,v,n("p",null,[e("Ƭ "),b,e(": "),x,e(" & "),s(t,{to:"/v9/generated/interfaces/sensors.SensorExt.html"},{default:a(()=>[S]),_:1})]),n("p",null,[n("a",y,[e("getSensor"),s(o)]),e("返回的对象类型，在Android原生"),n("a",E,[e("Sensor类"),s(o)]),e("上拓展了额外的函数，参见"),n("a",q,[e("SensorExt"),s(o)]),e("。")]),j,w,n("p",null,[e("▸ "),L,e("("),N,e("): "),s(t,{to:"/v9/generated/modules/sensors.html#sensor"},{default:a(()=>[A]),_:1}),e(" | "),D]),V,n("p",null,[e("完整的列表参见"),n("a",B,[e("Sensor"),s(o)]),e("。")]),R,n("p",null,[s(t,{to:"/v9/generated/modules/sensors.html#sensor"},{default:a(()=>[C]),_:1}),e(" | "),I]),P])}const G=c(p,[["render",T],["__file","sensors.html.vue"]]);export{G as default};