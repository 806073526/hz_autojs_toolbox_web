import{_ as r}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as p,c as d,a as e,d as n,w as t,b as a,e as o,r as l}from"./app.6aa2b576.js";const c={},i=e("h1",{id:"class-mediaplayer",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#class-mediaplayer","aria-hidden":"true"},"#"),a(" Class: MediaPlayer")],-1),u=o(`<p>Multimedia player. Provide more rich music playing management function. For example, play, pause, progress listener, etc.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> MediaPlayer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;media&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> player <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MediaPlayer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
player<span class="token punctuation">.</span><span class="token function">play</span><span class="token punctuation">(</span><span class="token string">&quot;/sdcard/Music/test.mp3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>player<span class="token punctuation">.</span>currentPosition<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer</p><h2 id="table-of-contents" tabindex="-1"><a class="header-anchor" href="#table-of-contents" aria-hidden="true">#</a> Table of contents</h2><h3 id="constructors" tabindex="-1"><a class="header-anchor" href="#constructors" aria-hidden="true">#</a> Constructors</h3>`,7),h=e("h3",{id:"accessors",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#accessors","aria-hidden":"true"},"#"),a(" Accessors")],-1),y=e("h3",{id:"methods",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#methods","aria-hidden":"true"},"#"),a(" Methods")],-1),k=o(`<h2 id="constructors-1" tabindex="-1"><a class="header-anchor" href="#constructors-1" aria-hidden="true">#</a> Constructors</h2><h3 id="constructor" tabindex="-1"><a class="header-anchor" href="#constructor" aria-hidden="true">#</a> constructor</h3><p>\u2022 <strong>new MediaPlayer</strong>()</p><h2 id="accessors-1" tabindex="-1"><a class="header-anchor" href="#accessors-1" aria-hidden="true">#</a> Accessors</h2><h3 id="androidmediaplayer" tabindex="-1"><a class="header-anchor" href="#androidmediaplayer" aria-hidden="true">#</a> androidMediaPlayer</h3><p>\u2022 <code><span class="token keyword">get</span></code> <strong>androidMediaPlayer</strong>(): <code><span class="token property">MediaPlayer</span></code></p><p>The native player of Android.</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer</p><h4 id="returns" tabindex="-1"><a class="header-anchor" href="#returns" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">MediaPlayer</span></code></p><hr><h3 id="currentposition" tabindex="-1"><a class="header-anchor" href="#currentposition" aria-hidden="true">#</a> currentPosition</h3><p>\u2022 <code><span class="token keyword">get</span></code> <strong>currentPosition</strong>(): <code><span class="token property">number</span></code></p><p>The current position of the music. Unit is millisecond.</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#getCurrentPosition()</p><h4 id="returns-1" tabindex="-1"><a class="header-anchor" href="#returns-1" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">number</span></code></p><hr><h3 id="duration" tabindex="-1"><a class="header-anchor" href="#duration" aria-hidden="true">#</a> duration</h3><p>\u2022 <code><span class="token keyword">get</span></code> <strong>duration</strong>(): <code><span class="token property">number</span></code></p><p>The duration of the music. Unit is millisecond.</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#getDuration()</p><h4 id="returns-2" tabindex="-1"><a class="header-anchor" href="#returns-2" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">number</span></code></p><hr><h3 id="isplaying" tabindex="-1"><a class="header-anchor" href="#isplaying" aria-hidden="true">#</a> isPlaying</h3><p>\u2022 <code><span class="token keyword">get</span></code> <strong>isPlaying</strong>(): <code><span class="token property">boolean</span></code></p><p>Whether the music is playing</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#isPlaying()</p><h4 id="returns-3" tabindex="-1"><a class="header-anchor" href="#returns-3" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">boolean</span></code></p><h2 id="methods-1" tabindex="-1"><a class="header-anchor" href="#methods-1" aria-hidden="true">#</a> Methods</h2><h3 id="awaitforcompletion" tabindex="-1"><a class="header-anchor" href="#awaitforcompletion" aria-hidden="true">#</a> awaitForCompletion</h3><p>\u25B8 <strong>awaitForCompletion</strong>(): <code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><p>Wait for the music to be played</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#setOnCompletionListener(android.media.MediaPlayer.OnCompletionListener)</p><h4 id="returns-4" tabindex="-1"><a class="header-anchor" href="#returns-4" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><hr><h3 id="pause" tabindex="-1"><a class="header-anchor" href="#pause" aria-hidden="true">#</a> pause</h3><p>\u25B8 <strong>pause</strong>(): <code><span class="token keyword">void</span></code></p><p>Pause playing</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#pause()</p><h4 id="returns-5" tabindex="-1"><a class="header-anchor" href="#returns-5" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="play" tabindex="-1"><a class="header-anchor" href="#play" aria-hidden="true">#</a> play</h3><p>\u25B8 <strong>play</strong>(<code><span class="token property">uri</span></code>, <code>volume<span class="token operator">?</span></code>, <code>looping<span class="token operator">?</span></code>): <code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><p>Play music. In &#39;async function&#39; can be used keyword &#39;await&#39; to wait for the music to be played.</p><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">uri</span></code></td><td style="text-align:left;"><code><span class="token property">string</span></code></td><td style="text-align:left;">The music file path, or the URL.</td></tr><tr><td style="text-align:left;"><code>volume<span class="token operator">?</span></code></td><td style="text-align:left;"><code><span class="token property">number</span></code></td><td style="text-align:left;">The volume of the music, a float number between 0 and 1, default is 1.</td></tr><tr><td style="text-align:left;"><code>looping<span class="token operator">?</span></code></td><td style="text-align:left;"><code><span class="token property">boolean</span></code></td><td style="text-align:left;">Whether to loop the music, if looping is true, the music will be looped, default is false.</td></tr></tbody></table><h4 id="returns-6" tabindex="-1"><a class="header-anchor" href="#returns-6" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><hr><h3 id="prepare" tabindex="-1"><a class="header-anchor" href="#prepare" aria-hidden="true">#</a> prepare</h3><p>\u25B8 <strong>prepare</strong>(): <code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><p>Prepares the player for playback,. After setting the datasource and the display surface, you need to either call prepare() or prepareSync().</p><p>For files, it is OK to call prepare(), which blocks until MediaPlayer is ready for playback.</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> MediaPlayer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;media&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> player <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MediaPlayer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    player<span class="token punctuation">.</span><span class="token function">setDataSource</span><span class="token punctuation">(</span><span class="token string">&quot;https://www.example.com/test.mp3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">await</span> player<span class="token punctuation">.</span><span class="token function">prepare</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    player<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">await</span> player<span class="token punctuation">.</span><span class="token function">awaitForCompletion</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#prepareAsync()</p><h4 id="returns-7" tabindex="-1"><a class="header-anchor" href="#returns-7" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><hr><h3 id="preparesync" tabindex="-1"><a class="header-anchor" href="#preparesync" aria-hidden="true">#</a> prepareSync</h3><p>\u25B8 <strong>prepareSync</strong>(): <code><span class="token keyword">void</span></code></p><p>Prepares the player for playback, synchronously. After setting the datasource and the display surface, you need to either call prepare() or prepareAsync().</p><p>For files, it is OK to call prepare(), which blocks until MediaPlayer is ready for playback.</p><p>If you call play() directly, you do not need to call prepareSync(), because play() will automatically call prepare().</p><p><strong><code><span class="token property">Example</span></code></strong></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token string">&quot;nodejs&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token punctuation">{</span> MediaPlayer <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;media&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> player <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MediaPlayer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
player<span class="token punctuation">.</span><span class="token function">setDataSource</span><span class="token punctuation">(</span><span class="token string">&quot;/sdcard/Music/test.mp3&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
player<span class="token punctuation">.</span><span class="token function">prepareSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
player<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
$autojs<span class="token punctuation">.</span><span class="token function">keepRunning</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#prepare()</p><h4 id="returns-8" tabindex="-1"><a class="header-anchor" href="#returns-8" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="release" tabindex="-1"><a class="header-anchor" href="#release" aria-hidden="true">#</a> release</h3><p>\u25B8 <strong>release</strong>(): <code><span class="token keyword">void</span></code></p><p>Releases resources associated with this MediaPlayer object. It is considered good practice to call this method when you&#39;re done using the MediaPlayer. In particular, whenever an Activity of an application is paused (its onPause() method is called), or stopped (its onStop() method is called), this method should be invoked to release the MediaPlayer object, unless the application has a special need to keep the object around.</p><p>In addition to unnecessary resources (such as memory and instances of codecs) being held, failure to call this method immediately if a MediaPlayer object is no longer needed may also lead to continuous battery consumption for mobile devices, and playback failure for other applications if no multiple instances of the same codec are supported on a device. Even if multiple instances of the same codec are supported, some performance degradation may be expected when unnecessary multiple instances are used at the same time.</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#release()</p><h4 id="returns-9" tabindex="-1"><a class="header-anchor" href="#returns-9" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="reset" tabindex="-1"><a class="header-anchor" href="#reset" aria-hidden="true">#</a> reset</h3><p>\u25B8 <strong>reset</strong>(): <code><span class="token keyword">void</span></code></p><p>Reset the player</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#reset()</p><h4 id="returns-10" tabindex="-1"><a class="header-anchor" href="#returns-10" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="seekto" tabindex="-1"><a class="header-anchor" href="#seekto" aria-hidden="true">#</a> seekTo</h3><p>\u25B8 <strong>seekTo</strong>(<code><span class="token property">msec</span></code>): <code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><p>Seeks to specified time position. Unit is millisecond.</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#seekTo(int)</p><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">msec</span></code></td><td style="text-align:left;"><code><span class="token property">number</span></code></td><td style="text-align:left;">the offset in milliseconds from the start to seek to</td></tr></tbody></table><h4 id="returns-11" tabindex="-1"><a class="header-anchor" href="#returns-11" aria-hidden="true">#</a> Returns</h4><p><code><span class="token property">Promise</span></code>&lt;<code><span class="token keyword">void</span></code>&gt;</p><hr><h3 id="setdatasource" tabindex="-1"><a class="header-anchor" href="#setdatasource" aria-hidden="true">#</a> setDataSource</h3><p>\u25B8 <strong>setDataSource</strong>(<code><span class="token property">path</span></code>): <code><span class="token keyword">void</span></code></p><p>Set the data source, support local file path, or network url address.</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#setDataSource(java.lang.String)</p><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">path</span></code></td><td style="text-align:left;"><code><span class="token property">string</span></code></td><td style="text-align:left;">The data source path, for example, /sdcard/test.mp3, http://www.example.com/test.mp3</td></tr></tbody></table><h4 id="returns-12" tabindex="-1"><a class="header-anchor" href="#returns-12" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="setlooping" tabindex="-1"><a class="header-anchor" href="#setlooping" aria-hidden="true">#</a> setLooping</h3><p>\u25B8 <strong>setLooping</strong>(<code><span class="token property">looping</span></code>): <code><span class="token keyword">void</span></code></p><p>Set the looping</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#setLooping(boolean)</p><h4 id="parameters-3" tabindex="-1"><a class="header-anchor" href="#parameters-3" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">looping</span></code></td><td style="text-align:left;"><code><span class="token property">boolean</span></code></td><td style="text-align:left;">Whether to loop the music, if looping is true, the music will be looped, default is false.</td></tr></tbody></table><h4 id="returns-13" tabindex="-1"><a class="header-anchor" href="#returns-13" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="setscreenonwhileplaying" tabindex="-1"><a class="header-anchor" href="#setscreenonwhileplaying" aria-hidden="true">#</a> setScreenOnWhilePlaying</h3><p>\u25B8 <strong>setScreenOnWhilePlaying</strong>(<code><span class="token property">keep</span></code>): <code><span class="token keyword">void</span></code></p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#setScreenOnWhilePlaying(boolean)</p><h4 id="parameters-4" tabindex="-1"><a class="header-anchor" href="#parameters-4" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">keep</span></code></td><td style="text-align:left;"><code><span class="token property">boolean</span></code></td><td style="text-align:left;">Whether to keep screen on</td></tr></tbody></table><h4 id="returns-14" tabindex="-1"><a class="header-anchor" href="#returns-14" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="setvolume" tabindex="-1"><a class="header-anchor" href="#setvolume" aria-hidden="true">#</a> setVolume</h3><p>\u25B8 <strong>setVolume</strong>(<code><span class="token property">leftVolume</span></code>, <code>rightVolume<span class="token operator">?</span></code>): <code><span class="token keyword">void</span></code></p><p>Set the volume</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#setVolume(float,%20float)</p><h4 id="parameters-5" tabindex="-1"><a class="header-anchor" href="#parameters-5" aria-hidden="true">#</a> Parameters</h4><table><thead><tr><th style="text-align:left;">Name</th><th style="text-align:left;">Type</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td style="text-align:left;"><code><span class="token property">leftVolume</span></code></td><td style="text-align:left;"><code><span class="token property">number</span></code></td><td style="text-align:left;">The volume of the left channel, a float number between 0 and 1.</td></tr><tr><td style="text-align:left;"><code>rightVolume<span class="token operator">?</span></code></td><td style="text-align:left;"><code><span class="token property">number</span></code></td><td style="text-align:left;">The volume of the right channel, a float number between 0 and 1, default is equal to left channel.</td></tr></tbody></table><h4 id="returns-15" tabindex="-1"><a class="header-anchor" href="#returns-15" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="start" tabindex="-1"><a class="header-anchor" href="#start" aria-hidden="true">#</a> start</h3><p>\u25B8 <strong>start</strong>(): <code><span class="token keyword">void</span></code></p><p>Start playing</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#start()</p><h4 id="returns-16" tabindex="-1"><a class="header-anchor" href="#returns-16" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p><hr><h3 id="stop" tabindex="-1"><a class="header-anchor" href="#stop" aria-hidden="true">#</a> stop</h3><p>\u25B8 <strong>stop</strong>(): <code><span class="token keyword">void</span></code></p><p>Stop playing</p><p><strong><code><span class="token property">See</span></code></strong></p><p>https://developer.android.com/reference/android/media/MediaPlayer#stop()</p><h4 id="returns-17" tabindex="-1"><a class="header-anchor" href="#returns-17" aria-hidden="true">#</a> Returns</h4><p><code><span class="token keyword">void</span></code></p>`,164);function m(g,f){const s=l("RouterLink");return p(),d("div",null,[e("p",null,[n(s,{to:"/en/v9/generated/"},{default:t(()=>[a("Auto.js Pro 9 Docs")]),_:1}),a(" / "),n(s,{to:"/en/v9/generated/modules/media.html"},{default:t(()=>[a("media")]),_:1}),a(" / MediaPlayer")]),i,e("p",null,[n(s,{to:"/en/v9/generated/modules/media.html"},{default:t(()=>[a("media")]),_:1}),a(".MediaPlayer")]),u,e("ul",null,[e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#constructor"},{default:t(()=>[a("constructor")]),_:1})])]),h,e("ul",null,[e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#androidmediaplayer"},{default:t(()=>[a("androidMediaPlayer")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#currentposition"},{default:t(()=>[a("currentPosition")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#duration"},{default:t(()=>[a("duration")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#isplaying"},{default:t(()=>[a("isPlaying")]),_:1})])]),y,e("ul",null,[e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#awaitforcompletion"},{default:t(()=>[a("awaitForCompletion")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#pause"},{default:t(()=>[a("pause")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#play"},{default:t(()=>[a("play")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#prepare"},{default:t(()=>[a("prepare")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#preparesync"},{default:t(()=>[a("prepareSync")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#release"},{default:t(()=>[a("release")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#reset"},{default:t(()=>[a("reset")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#seekto"},{default:t(()=>[a("seekTo")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#setdatasource"},{default:t(()=>[a("setDataSource")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#setlooping"},{default:t(()=>[a("setLooping")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#setscreenonwhileplaying"},{default:t(()=>[a("setScreenOnWhilePlaying")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#setvolume"},{default:t(()=>[a("setVolume")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#start"},{default:t(()=>[a("start")]),_:1})]),e("li",null,[n(s,{to:"/en/v9/generated/classes/media.MediaPlayer.html#stop"},{default:t(()=>[a("stop")]),_:1})])]),k])}const x=r(c,[["render",m],["__file","media.MediaPlayer.html.vue"]]);export{x as default};