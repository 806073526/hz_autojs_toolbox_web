import{_ as c}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as i,c as d,a as e,d as n,w as s,b as t,e as l,r as o}from"./app.6aa2b576.js";const p={},u=l('<h1 id="ui-layout" tabindex="-1"><a class="header-anchor" href="#ui-layout" aria-hidden="true">#</a> ui/layout</h1><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="interfaces" tabindex="-1"><a class="header-anchor" href="#interfaces" aria-hidden="true">#</a> Interfaces</h3>',3),h=e("h3",{id:"variables",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#variables","aria-hidden":"true"},"#"),t(" Variables")],-1),_=e("h3",{id:"functions",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#functions","aria-hidden":"true"},"#"),t(" Functions")],-1),f=e("h2",{id:"variables-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#variables-1","aria-hidden":"true"},"#"),t(" Variables")],-1),m=e("h3",{id:"r",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#r","aria-hidden":"true"},"#"),t(" R")],-1),k=e("code",null,[e("span",{class:"token property"},"Const")],-1),x=e("strong",null,"R",-1),y=e("code",null,[e("span",{class:"token property"},"Resources")],-1),v=l(`<p>Similar to Android&#39;s R, used to get resource related ID, such as <code><span class="token constant">R</span><span class="token punctuation">.</span>drawable<span class="token punctuation">.</span>ic_launcher</code> and <code><span class="token constant">R</span><span class="token punctuation">.</span>style<span class="token punctuation">.</span>ScriptTheme</code>.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token punctuation">{</span> <span class="token constant">R</span> <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;ui&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> context <span class="token operator">=</span> $autojs<span class="token punctuation">.</span>androidContext<span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">getDrawable</span><span class="token punctuation">(</span><span class="token constant">R</span><span class="token punctuation">.</span>drawable<span class="token punctuation">.</span>ic_delete<span class="token punctuation">)</span><span class="token punctuation">)</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/R</p><h2 id="functions-1" tabindex="-1"><a class="header-anchor" href="#functions-1" aria-hidden="true">#</a> Functions</h2><h3 id="defaultthemecontext" tabindex="-1"><a class="header-anchor" href="#defaultthemecontext" aria-hidden="true">#</a> defaultThemeContext</h3><p>\u25B8 <strong>defaultThemeContext</strong>(): <code><span class="token property">Context</span></code></p><p>Get the default theme context.</p><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">Context</span></code></p><hr><h3 id="inflatexml" tabindex="-1"><a class="header-anchor" href="#inflatexml" aria-hidden="true">#</a> inflateXml</h3>`,13),g=e("strong",null,"inflateXml",-1),b=e("code",null,[e("span",{class:"token property"},"ctx")],-1),w=e("code",null,[e("span",{class:"token property"},"xml")],-1),R=e("code",null,[t("parent"),e("span",{class:"token operator"},"?")],-1),C=e("code",null,[t("attachToParent"),e("span",{class:"token operator"},"?")],-1),T=e("code",null,[e("span",{class:"token property"},"JsView")],-1),V=e("code",null,[e("span",{class:"token property"},"View")],-1),j=e("p",null,"Inflate a new view hierarchy from the specified xml resource. Throws InflateException if there is an error.",-1),I=e("h4",{id:"parameters",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#parameters","aria-hidden":"true"},"#"),t(" Parameters")],-1),q=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"left"}},"Name"),e("th",{style:{"text-align":"left"}},"Type"),e("th",{style:{"text-align":"left"}},"Description")])],-1),E=e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"ctx")])],-1),L=e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"Context")])],-1),N={style:{"text-align":"left"}},P={href:"https://developer.android.com/reference/android/content/Context",target:"_blank",rel:"noopener noreferrer"},D=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"xml")])]),e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"string")])]),e("td",{style:{"text-align":"left"}},"xml content")],-1),S=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,[t("parent"),e("span",{class:"token operator"},"?")])]),e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"any")])]),e("td",{style:{"text-align":"left"}},"Optional view to be the parent of the generated hierarchy (if attachToRoot is true), or else simply an object that provides a set of LayoutParams values for root of the returned hierarchy (if attachToRoot is false.)")],-1),A=e("tr",null,[e("td",{style:{"text-align":"left"}},[e("code",null,[t("attachToParent"),e("span",{class:"token operator"},"?")])]),e("td",{style:{"text-align":"left"}},[e("code",null,[e("span",{class:"token property"},"boolean")])]),e("td",{style:{"text-align":"left"}},"-")],-1),B=e("h4",{id:"returns-1",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#returns-1","aria-hidden":"true"},"#"),t(" Returns")],-1),X=e("code",null,[e("span",{class:"token property"},"JsView")],-1),F=e("code",null,[e("span",{class:"token property"},"View")],-1);function J(G,M){const a=o("RouterLink"),r=o("ExternalLinkIcon");return i(),d("div",null,[e("p",null,[n(a,{to:"/en/v9/generated/"},{default:s(()=>[t("Auto.js Pro 9 Docs")]),_:1}),t(" / ui/layout")]),u,e("ul",null,[e("li",null,[n(a,{to:"/en/v9/generated/interfaces/ui_layout.Resource.html"},{default:s(()=>[t("Resource")]),_:1})]),e("li",null,[n(a,{to:"/en/v9/generated/interfaces/ui_layout.Resources.html"},{default:s(()=>[t("Resources")]),_:1})])]),h,e("ul",null,[e("li",null,[n(a,{to:"/en/v9/generated/modules/ui_layout.html#r"},{default:s(()=>[t("R")]),_:1})])]),_,e("ul",null,[e("li",null,[n(a,{to:"/en/v9/generated/modules/ui_layout.html#defaultthemecontext"},{default:s(()=>[t("defaultThemeContext")]),_:1})]),e("li",null,[n(a,{to:"/en/v9/generated/modules/ui_layout.html#inflatexml"},{default:s(()=>[t("inflateXml")]),_:1})])]),f,m,e("p",null,[t("\u2022 "),k,t(),x,t(": "),n(a,{to:"/en/v9/generated/interfaces/ui_layout.Resources.html"},{default:s(()=>[y]),_:1})]),v,e("p",null,[t("\u25B8 "),g,t("("),b,t(", "),w,t(", "),R,t(", "),C,t("): "),n(a,{to:"/en/v9/generated/modules/ui_view.html#jsview"},{default:s(()=>[T]),_:1}),t("<"),V,t(">")]),j,I,e("table",null,[q,e("tbody",null,[e("tr",null,[E,L,e("td",N,[t("Android "),e("a",P,[t("Context"),n(r)]),t(", if you want to create androidx-related views, you must specify a Material-related theme context")])]),D,S,A])]),B,e("p",null,[n(a,{to:"/en/v9/generated/modules/ui_view.html#jsview"},{default:s(()=>[X]),_:1}),t("<"),F,t(">")])])}const z=c(p,[["render",J],["__file","ui_layout.html.vue"]]);export{z as default};