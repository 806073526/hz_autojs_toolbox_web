import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o,c as l,d as s,e as n,b as t,f as c}from"./app-ff93bfbc.js";const i="/docs/assets/image/7zip-plugin.png",r={},u=s("figure",null,[s("img",{src:i,alt:"7zip-plugin",tabindex:"0",loading:"lazy"}),s("figcaption",null,"7zip-plugin")],-1),k=s("h1",{id:"_1-插件信息",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#_1-插件信息","aria-hidden":"true"},"#"),n(" 1. 插件信息")],-1),d=s("blockquote",null,[s("p",null,"免责声明：本插件以及本博客内容均由第三方提供，请您仔细甄别后再下载和使用。若插件有任何侵权、病毒或其他违法行为，请联系我方下架。")],-1),m=s("p",null,"作者：LZX284",-1),v=s("p",null,[n("基于p7zip 16.02制作，支持多种格式文件的压缩与解压，安装后即可使用。"),s("br"),n(" 支持的API架构：armeabi-v7a, arm64-v8a, x86, x86_64")],-1),b={href:"https://wwwq.lanzouc.com/iyQIl167x38j",target:"_blank",rel:"noopener noreferrer"},g=c(`<blockquote><p>从Pro 9.2开始，打包时插件可被合并到apk中，打包后无需再安装插件即可使用。</p></blockquote><h3 id="_2-用法示例" tabindex="-1"><a class="header-anchor" href="#_2-用法示例" aria-hidden="true">#</a> 2. 用法示例</h3><h4 id="解压" tabindex="-1"><a class="header-anchor" href="#解压" aria-hidden="true">#</a> 解压</h4><p>javascript</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> P7zip <span class="token operator">=</span> $plugins<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span><span class="token string">&#39;cn.lzx284.p7zip&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> mP7zip <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">P7zip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 源路径(目录或文件皆可，必须是完整路径)</span>
<span class="token keyword">let</span> srcPath <span class="token operator">=</span> <span class="token string">&#39;/storage/emulated/0/脚本/&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 目标目录(必须是完整路径)</span>
<span class="token keyword">let</span> dirPath <span class="token operator">=</span> <span class="token string">&#39;/storage/emulated/0/&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩类型</span>
<span class="token comment">// 支持的压缩类型包括: zip 7z bz2 bzip2 tbz2 tbz gz gzip tgz tar wim swm xz txz。</span>
<span class="token keyword">let</span> type <span class="token operator">=</span> <span class="token string">&quot;7z&quot;</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩等级: 0-9。</span>
<span class="token keyword">let</span> level <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩密码（注意，在p7zip中，类似&quot;&quot;这样的空字符也算是密码的一种，与没有密码不一样）</span>
<span class="token keyword">let</span> password <span class="token operator">=</span> <span class="token string">&quot;password&quot;</span>
<span class="token comment">// 压缩文件路径(必须是完整路径)</span>
<span class="token keyword">let</span> compressedFile <span class="token operator">=</span> <span class="token string">&quot;/storage/emulated/0/test.&quot;</span> <span class="token operator">+</span> type<span class="token punctuation">;</span>
<span class="token keyword">let</span> rarFile <span class="token operator">=</span> files<span class="token punctuation">.</span><span class="token function">path</span><span class="token punctuation">(</span><span class="token string">&quot;./test.rar&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// rar格式仅支持解压缩</span>
<span class="token keyword">let</span> cmdStr <span class="token operator">=</span> <span class="token string">&quot;7z x -y -aos -p&quot;</span> <span class="token operator">+</span> password <span class="token operator">+</span> <span class="token string">&quot; -o&quot;</span> <span class="token operator">+</span> dirPath <span class="token operator">+</span> <span class="token string">&quot; &quot;</span> <span class="token operator">+</span> rarFile


<span class="token comment">// 支持的解压缩类型包括：zip、7z、bz2、bzip2、tbz2、tbz、gz、gzip、tgz、tar、wim、swm、xz、txz以及rar、chm、iso、msi等众多格式。</span>
<span class="token comment">// p7zip解压(若文件已存在则跳过)</span>
<span class="token comment">// 无密码解压：mP7zip.extract(compressedFile, dirPath)</span>
<span class="token keyword">switch</span> <span class="token punctuation">(</span>mP7zip<span class="token punctuation">.</span><span class="token function">extract</span><span class="token punctuation">(</span>compressedFile<span class="token punctuation">,</span> dirPath<span class="token punctuation">,</span> password<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token number">0</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;解压缩成功！请到 &quot;</span> <span class="token operator">+</span> dirPath <span class="token operator">+</span> <span class="token string">&quot; 目录下查看。&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">1</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;压缩结束，存在非致命错误（例如某些文件正在被使用，没有被压缩）&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">2</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;致命错误&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">7</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;命令行错误&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">8</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;没有足够内存&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">255</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;用户中止操作&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span> <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;未知错误&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="压缩" tabindex="-1"><a class="header-anchor" href="#压缩" aria-hidden="true">#</a> 压缩</h4><p>javascript</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> P7zip <span class="token operator">=</span> $plugins<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span><span class="token string">&#39;cn.lzx284.p7zip&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> mP7zip <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">P7zip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 源路径(目录或文件皆可，必须是完整路径)</span>
<span class="token keyword">let</span> srcPath <span class="token operator">=</span> <span class="token string">&#39;/storage/emulated/0/脚本/&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 目标目录(必须是完整路径)</span>
<span class="token keyword">let</span> dirPath <span class="token operator">=</span> <span class="token string">&#39;/storage/emulated/0/&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩类型</span>
<span class="token comment">// 支持的压缩类型包括: zip 7z bz2 bzip2 tbz2 tbz gz gzip tgz tar wim swm xz txz。</span>
<span class="token keyword">let</span> type <span class="token operator">=</span> <span class="token string">&quot;7z&quot;</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩等级: 0-9。</span>
<span class="token keyword">let</span> level <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩密码（注意，在p7zip中，类似&quot;&quot;这样的空字符也算是密码的一种，与没有密码不一样）</span>
<span class="token keyword">let</span> password <span class="token operator">=</span> <span class="token string">&quot;password&quot;</span>
<span class="token comment">// 压缩文件路径(必须是完整路径)</span>
<span class="token keyword">let</span> compressedFile <span class="token operator">=</span> <span class="token string">&quot;/storage/emulated/0/test.&quot;</span> <span class="token operator">+</span> type<span class="token punctuation">;</span>
<span class="token keyword">let</span> rarFile <span class="token operator">=</span> files<span class="token punctuation">.</span><span class="token function">path</span><span class="token punctuation">(</span><span class="token string">&quot;./test.rar&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// rar格式仅支持解压缩</span>
<span class="token keyword">let</span> cmdStr <span class="token operator">=</span> <span class="token string">&quot;7z x -y -aos -p&quot;</span> <span class="token operator">+</span> password <span class="token operator">+</span> <span class="token string">&quot; -o&quot;</span> <span class="token operator">+</span> dirPath <span class="token operator">+</span> <span class="token string">&quot; &quot;</span> <span class="token operator">+</span> rarFile

<span class="token comment">// p7zip压缩(若文件已存在则跳过)</span>
<span class="token comment">// 无密码压缩：mP7zip.add(type, level, srcPath, compressedFile)</span>
<span class="token keyword">switch</span> <span class="token punctuation">(</span>mP7zip<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> level<span class="token punctuation">,</span> srcPath<span class="token punctuation">,</span> compressedFile<span class="token punctuation">,</span> password<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token number">0</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;压缩成功！文件已保存为： &quot;</span> <span class="token operator">+</span> compressedFile<span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">1</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;压缩结束，存在非致命错误（例如某些文件正在被使用，没有被压缩）&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">2</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;致命错误&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">7</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;命令行错误&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">8</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;没有足够内存&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">255</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;用户中止操作&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;未知错误&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="自定义命令" tabindex="-1"><a class="header-anchor" href="#自定义命令" aria-hidden="true">#</a> 自定义命令</h4><p>javascript</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> P7zip <span class="token operator">=</span> $plugins<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span><span class="token string">&#39;cn.lzx284.p7zip&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> mP7zip <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">P7zip</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 源路径(目录或文件皆可，必须是完整路径)</span>
<span class="token keyword">let</span> srcPath <span class="token operator">=</span> <span class="token string">&#39;/storage/emulated/0/脚本/&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 目标目录(必须是完整路径)</span>
<span class="token keyword">let</span> dirPath <span class="token operator">=</span> <span class="token string">&#39;/storage/emulated/0/&#39;</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩类型</span>
<span class="token comment">// 支持的压缩类型包括: zip 7z bz2 bzip2 tbz2 tbz gz gzip tgz tar wim swm xz txz。</span>
<span class="token keyword">let</span> type <span class="token operator">=</span> <span class="token string">&quot;7z&quot;</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩等级: 0-9。</span>
<span class="token keyword">let</span> level <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token comment">// 压缩密码（注意，在p7zip中，类似&quot;&quot;这样的空字符也算是密码的一种，与没有密码不一样）</span>
<span class="token keyword">let</span> password <span class="token operator">=</span> <span class="token string">&quot;password&quot;</span>
<span class="token comment">// 压缩文件路径(必须是完整路径)</span>
<span class="token keyword">let</span> compressedFile <span class="token operator">=</span> <span class="token string">&quot;/storage/emulated/0/test.&quot;</span> <span class="token operator">+</span> type<span class="token punctuation">;</span>
<span class="token keyword">let</span> rarFile <span class="token operator">=</span> files<span class="token punctuation">.</span><span class="token function">path</span><span class="token punctuation">(</span><span class="token string">&quot;./test.rar&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// rar格式仅支持解压缩</span>
<span class="token keyword">let</span> cmdStr <span class="token operator">=</span> <span class="token string">&quot;7z x -y -aos -p&quot;</span> <span class="token operator">+</span> password <span class="token operator">+</span> <span class="token string">&quot; -o&quot;</span> <span class="token operator">+</span> dirPath <span class="token operator">+</span> <span class="token string">&quot; &quot;</span> <span class="token operator">+</span> rarFile


<span class="token comment">// 自定义命令:解压加密的rar压缩文件</span>
<span class="token keyword">switch</span> <span class="token punctuation">(</span>mP7zip<span class="token punctuation">.</span><span class="token function">cmdExec</span><span class="token punctuation">(</span>cmdStr<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">case</span> <span class="token number">0</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;解压缩成功！请到 &quot;</span> <span class="token operator">+</span> dirPath <span class="token operator">+</span> <span class="token string">&quot; 目录下查看。&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">1</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;压缩结束，存在非致命错误（例如某些文件正在被使用，没有被压缩）&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">2</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;致命错误&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">7</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;命令行错误&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">8</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;没有足够内存&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">case</span> <span class="token number">255</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;用户中止操作&quot;</span><span class="token punctuation">)</span>
        <span class="token keyword">break</span><span class="token punctuation">;</span>
    <span class="token keyword">default</span><span class="token operator">:</span>
        <span class="token function">toastLog</span><span class="token punctuation">(</span><span class="token string">&quot;未知错误&quot;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-附录-p7zip命令行使用参考" tabindex="-1"><a class="header-anchor" href="#_3-附录-p7zip命令行使用参考" aria-hidden="true">#</a> 3. 附录（p7zip命令行使用参考）</h3><h4 id="_7z-7za-子命令-参数开关-压缩包-文件名称-列表文件" tabindex="-1"><a class="header-anchor" href="#_7z-7za-子命令-参数开关-压缩包-文件名称-列表文件" aria-hidden="true">#</a> 7z|7za 子命令 [参数开关] 压缩包 [&lt;文件名称&gt;|&lt;@列表文件…&gt;]</h4><p>在方括号内的表达式(“[” 和 “]”之间的字符)是可选的。在书名号内的表达式(“&lt;” 和 “&gt;”之间的字符)是必须替换的表达式(而且要去掉括号)。<br> 7-Zip 支持和 Windows 相类似的通配符：<br> “*”可以使用星号代替零个或多个字符。<br> “?”可以用问号代替名称中的单个字符。<br> 如果只用 <code>*</code>，7-Zip 会将其视为任何扩展名的全部文件。</p><h5 id="子命令" tabindex="-1"><a class="header-anchor" href="#子命令" aria-hidden="true">#</a> 子命令</h5><ul><li>a: 添加到压缩文件</li><li>b: 基准测试</li><li>d: 从档案中删除文件</li><li>e: 解压档案文件 (无目录名称)</li><li>l: 列出压缩文件内容</li><li>t: 测试压缩文件的完整性</li><li>u: 更新文件到压缩文件中</li><li>x: 完整路径下解压文件</li></ul><h5 id="参数开关" tabindex="-1"><a class="header-anchor" href="#参数开关" aria-hidden="true">#</a> 参数开关</h5><ul><li>-ai[r[-|0]]{@列表文件|!通配符}: 包括 压缩文件</li><li>-ax[r[-|0]]{@列表文件|!通配符}: 排除 压缩文件</li><li>-bd: 禁用百分比显示功能</li><li>-i[r[-|0]]{@列表文件|!通配符}: 包括 文件名称</li><li>-m&lt;参数&gt;，关于它有许多参数及指令，这里仅介绍简单且常用的用法。<br> -m0=&lt;压缩算法&gt; 默认使用 lzma<br> -md=&lt;字典大小&gt; 设置字典大小,例如 -md=32m<br> -mfb=64 number of fast bytes for LZMA = 64<br> -ms=&lt;on|off&gt; 是否固实压缩<br> -mx=&lt;1<s>9&gt; 压缩级别-m0=压缩算法 默认使用 lzma<br> -mx=数字 1</s>9 压缩级别</li><li>-o{目录}: 设置输出目录</li><li>-p{密码}: 设置密码</li><li>-r[数字]: 递归子目录，使用数字定义递归子目录的深度</li><li>-scs{UTF-8 | WIN | DOS}: 设置列表文件的编码格式</li><li>-sfx[{名称}]: 创建 SFX 自解压文件</li><li>-si[{名称}]: 从stdin(标准输入设备)读取数据</li><li>-slt: 为 l (列表) 命令显示技术信息</li><li>-so: 将数据写入stdout(标准输出设备)</li><li>-ssc[-]: 设置大小写区分模式</li><li>-ssw: 压缩共享文件</li><li>-t{类型}: 设置压缩文件格式，(7z, zip, gzip, bzip2 or tar. 7z是默认的格式)</li><li>-v{大小}[b|k|m|g]: 分卷压缩</li><li>-u[-][p#][q#][r#][x#][y#][z#][!新建档案_名称]: 更新选项</li><li>-w[{路径}]: 指定工作目录，路径为空时代表临时文件夹目录</li><li>-x[r[-|0]]]{@列表文件|!通配符}: 排除 文件名称</li><li>-y: 所有询问选是</li></ul><h5 id="退出代码" tabindex="-1"><a class="header-anchor" href="#退出代码" aria-hidden="true">#</a> 退出代码</h5><ul><li>0 ：正常，没有错误</li><li>1 ：警告，没有致命的错误，例如某些文件正在被使用，* 没有被压缩</li><li>2 ：致命错误</li><li>7 ：命令行错误</li><li>8 ：没有足够的内存</li><li>255 ：用户中止了操作</li></ul><h3 id="开源地址" tabindex="-1"><a class="header-anchor" href="#开源地址" aria-hidden="true">#</a> 开源地址</h3>`,21),w={href:"https://github.com/LZX284/p7zip_autojs_plugin",target:"_blank",rel:"noopener noreferrer"};function h(z,q){const a=p("ExternalLinkIcon");return o(),l("div",null,[u,k,d,m,v,s("p",null,[n("下载地址： "),s("a",b,[n("https://wwwq.lanzouc.com/iyQIl167x38j"),t(a)])]),g,s("p",null,[n("已过期 GitHub："),s("a",w,[n("p7zip_autojs_plugin"),t(a)])])])}const x=e(r,[["render",h],["__file","7zip-plugin.html.vue"]]);export{x as default};