import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as i,c as o,a,b as n,d as t,e as s,r as c}from"./app.6aa2b576.js";const r={},l=s(`<h1 id="app" tabindex="-1"><a class="header-anchor" href="#app" aria-hidden="true">#</a> app</h1><p>The app module provides a set of functions to use other applications and interact with other applications. For example, sending intents, opening files, sending emails, etc.</p><p>It also provides convenient advanced functions startActivity and sendBroadcast, which can be used to do interactions with other applications that are not built into the app module.</p><h2 id="app-versioncode" tabindex="-1"><a class="header-anchor" href="#app-versioncode" aria-hidden="true">#</a> app.versionCode</h2><ul><li>{number}</li></ul><p>Current software version number, integer value. For example, 160, 256, etc.</p><p>If running in Auto.js, it is the version number of Auto.js; in packaged software, it is the version number of the packaged software.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function">toastLog</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>versionCode<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="app-versionname" tabindex="-1"><a class="header-anchor" href="#app-versionname" aria-hidden="true">#</a> app.versionName</h2><ul><li>{string}</li></ul><p>The current software version name, e.g. &quot;3.0.0 Beta&quot;.</p><p>This is the version name of Auto.js if running in Auto.js, or the version name of the packaged software if running in a packaged software.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function">toastLog</span><span class="token punctuation">(</span>app<span class="token punctuation">.</span>versionName<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="app-autojs-versioncode" tabindex="-1"><a class="header-anchor" href="#app-autojs-versioncode" aria-hidden="true">#</a> app.autojs.versionCode</h2><ul><li>{number}</li></ul><p>Auto.js version number, integer value. For example 160, 256, etc.</p><h2 id="app-autojs-versionname" tabindex="-1"><a class="header-anchor" href="#app-autojs-versionname" aria-hidden="true">#</a> app.autojs.versionName</h2><ul><li>{string}</li></ul><p>Auto.js version name, e.g. &quot;3.0.0 Beta&quot;.</p><h2 id="app-launchapp-appname" tabindex="-1"><a class="header-anchor" href="#app-launchapp-appname" aria-hidden="true">#</a> app.launchApp(appName)</h2><ul><li><code><span class="token property">appName</span></code> {string} The name of the application.</li></ul><p>Launches the app by its name. Returns false if the app corresponding to the name does not exist, or true if the name corresponds to more than one app, then only one of them will be launched.</p><p>This function can also be used as a global function.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token function">launchApp</span><span class="token punctuation">(</span><span class="token string">&quot;Auto.js&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="app-launch-packagename" tabindex="-1"><a class="header-anchor" href="#app-launch-packagename" aria-hidden="true">#</a> app.launch(packageName)</h2><ul><li>\`\`packageName\` {string} Application package name</li></ul><p>Launches the application by its package name. Returns false if the application corresponding to the package name does not exist; otherwise, returns true.</p><p>This function can also be used as a global function.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">//launch WeChat</span>
<span class="token function">launch</span><span class="token punctuation">(</span><span class="token string">&quot;com.tencent.mm&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="app-launchpackage-packagename" tabindex="-1"><a class="header-anchor" href="#app-launchpackage-packagename" aria-hidden="true">#</a> app.launchPackage(packageName)</h2><ul><li><code><span class="token property">packageName</span></code> {string} Application package name</li></ul><p>Equivalent to <code>app<span class="token punctuation">.</span><span class="token function">launch</span><span class="token punctuation">(</span>packageName<span class="token punctuation">)</span></code>.</p><h2 id="app-getpackagename-appname" tabindex="-1"><a class="header-anchor" href="#app-getpackagename-appname" aria-hidden="true">#</a> app.getPackageName(appName)</h2><ul><li><code><span class="token property">appName</span></code> {string} the name of the application</li></ul><p>Get the package name of the installed app corresponding to the app name. If the app is not found, return null; if the name corresponds to more than one app, return the package name of only one of them.</p><p>This function can also be used as a global function.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token function">getPackageName</span><span class="token punctuation">(</span><span class="token string">&quot;QQ&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//returns &quot;com.tencent.mobileqq&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="app-getappname-packagename" tabindex="-1"><a class="header-anchor" href="#app-getappname-packagename" aria-hidden="true">#</a> app.getAppName(packageName)</h2><ul><li><code><span class="token property">packageName</span></code> {string} The name of the app package</li></ul><p>Get the name of the installed app corresponding to the app package name. If the app is not found, return null.</p><p>This function can also be used as a global function.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">var</span> name <span class="token operator">=</span> <span class="token function">getAppName</span><span class="token punctuation">(</span><span class="token string">&quot;com.tencent.mobileqq&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//returns &quot;QQ&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="app-openappsetting-packagename" tabindex="-1"><a class="header-anchor" href="#app-openappsetting-packagename" aria-hidden="true">#</a> app.openAppSetting(packageName)</h2><ul><li>\`\`packageName\` {string} Application package name</li></ul><p>Open the app&#39;s details page (settings page). Returns false if the app is not found; otherwise returns true.</p><p>This function can also be used as a global function.</p><h2 id="app-viewfile-path" tabindex="-1"><a class="header-anchor" href="#app-viewfile-path" aria-hidden="true">#</a> app.viewFile(path)</h2><ul><li><code><span class="token property">path</span></code> {string} file path</li></ul><p>View the file with another application. The case that the file does not exist is handled by the application that viewed it.</p><p>If no application can be found that can view the file, <code><span class="token property">ActivityNotException</span></code> is thrown.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">//Viewing a text file</span>
app<span class="token punctuation">.</span><span class="token function">viewFile</span><span class="token punctuation">(</span><span class="token string">&quot;/sdcard/1.txt&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="app-editfile-path" tabindex="-1"><a class="header-anchor" href="#app-editfile-path" aria-hidden="true">#</a> app.editFile(path)</h2><ul><li><code><span class="token property">path</span></code> {string} file path</li></ul><p>Edit the file with another application. The case that the file does not exist is handled by the application that edited the file.</p><p>If no application can be found that can edit the file, <code><span class="token property">ActivityNotException</span></code> is thrown.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">// Edit a text file</span>
app<span class="token punctuation">.</span><span class="token function">editFile</span><span class="token punctuation">(</span>&quot;<span class="token operator">/</span>sdcard<span class="token operator">/</span><span class="token number">1</span><span class="token punctuation">.</span>txt<span class="token operator">/</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="app-uninstall-packagename" tabindex="-1"><a class="header-anchor" href="#app-uninstall-packagename" aria-hidden="true">#</a> app.uninstall(packageName)</h2><ul><li><code><span class="token property">packageName</span></code> {string} Application package name</li></ul><p>Uninstall the application. After execution, a popup box will appear to uninstall the application. If the application of this package name is not installed, it will be handled by the application uninstaller, which may pop up a &quot;Application not found&quot; message.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">//Uninstall QQ</span>
app<span class="token punctuation">.</span><span class="token function">uninstall</span><span class="token punctuation">(</span><span class="token string">&quot;com.tencent.mobileqq&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="app-openurl-url" tabindex="-1"><a class="header-anchor" href="#app-openurl-url" aria-hidden="true">#</a> app.openUrl(url)</h2><ul><li><code><span class="token property">url</span></code> {string} Url of the website, or by default &quot;http://&quot; if it doesn&#39;t start with &quot;http://&quot; or &quot;https://&quot;.</li></ul><p>Open the website url with a browser.</p><p>If no browser application is installed, <code><span class="token property">ActivityNotException</span></code> is thrown.</p><h2 id="app-sendemail-options" tabindex="-1"><a class="header-anchor" href="#app-sendemail-options" aria-hidden="true">#</a> app.sendEmail(options)</h2><ul><li><code><span class="token property">options</span></code> {Object} The parameters to send the email. Include : <ul><li><code><span class="token property">email</span></code> {string} | {Array} The email address of the recipient. If there is more than one recipient, it will be represented as an array of strings</li><li><code><span class="token property">cc</span></code> {string} | {Array} The email address of the cc recipient. If there is more than one cc recipient, it is represented as an array of strings</li><li><code><span class="token property">bcc</span></code> {string} | {Array} The email address of the bcc recipient. If there is more than one bcc recipient, it is represented as an array of strings</li><li><code><span class="token property">subject</span></code> {string} The subject of the message.</li><li><code><span class="token property">text</span></code> {string} The body of the message.</li><li><code><span class="token property">attachment</span></code> {string} The path of the attachment.</li></ul></li></ul><p>The mailbox application is invoked to send the message based on the optionsoptions. These options are optional.</p><p>If the mailbox app is not installed, <code><span class="token property">ActivityNotException</span></code> is thrown.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token comment">//\u53D1\u9001\u90AE\u4EF6\u7ED910086@qq.com\u548C10001@qq.com.</span>
app<span class="token punctuation">.</span><span class="token function">sendEmail</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">email</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;10086@qq.com&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;10001@qq.com&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">subject</span><span class="token operator">:</span> <span class="token string">&quot;This is an email subject&quot;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">&quot;This is the body of the email&quot;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="app-startactivity-name" tabindex="-1"><a class="header-anchor" href="#app-startactivity-name" aria-hidden="true">#</a> app.startActivity(name)</h2><ul><li><code><span class="token property">name</span></code> {string} The name of the activity, with the optional value : <ul><li><code><span class="token property">console</span></code> logging interface</li><li><code><span class="token property">settings</span></code> settings interface</li></ul></li></ul><p>Starts Auto.js with a specific interface. This function will open the interface within Auto.js if run from within Auto.js, or the corresponding interface of the packaged application if run from within the packaged application.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>app<span class="token punctuation">.</span><span class="token function">startActivity</span><span class="token punctuation">(</span><span class="token string">&quot;console&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h1 id="advanced-intent" tabindex="-1"><a class="header-anchor" href="#advanced-intent" aria-hidden="true">#</a> Advanced: Intent</h1><p>An Intent (intent) is a messaging object that you can use to request actions from other application components. While Intent can facilitate communication between components in a variety of ways, its basic use cases include three main ones.</p><ul><li><p>Launching an activity (Activity). An Activity represents a &quot;screen&quot; in an application. By passing an Intent to startActivity(), you can start a new instance of Activity. The Intent describes the Activity to be started and carries any necessary data.</p></li><li><p>Start a Service (Service). A Service is a component that performs operations in the background without using the user interface. You can start a service to perform a one-time operation (for example, downloading a file) by passing an Intent to startService(). the Intent describes the service to be started and carries any necessary data.</p></li><li><p>Passing a broadcast. Broadcasts are messages that can be received by any application. The system will deliver various broadcasts in response to system events (for example, when the system starts up or when a device starts charging). You can pass broadcasts to other applications by passing the Intent to sendBroadcast(), sendOrderedBroadcast(), or sendStickyBroadcast().</p></li></ul><p>This module provides functions for building Intent (<code>app<span class="token punctuation">.</span><span class="token function">intent</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code>), starting Activity (<code>app<span class="token punctuation">.</span><span class="token function">startActivity</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code>), and sending broadcasts (<code>app<span class="token punctuation">.</span><span class="token function">sendBroadcast</span><span class="token punctuation">(</span><span class="token punctuation">)</span></code>).</p><p>Using these methods can be used to easily call other applications. For example, open the personal card page of a QQ number directly, open the chat window of a QQ number, etc.</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">var</span> qq <span class="token operator">=</span> <span class="token string">&quot;2732014414&quot;</span><span class="token punctuation">;</span>
app<span class="token punctuation">.</span><span class="token function">startActivity</span><span class="token punctuation">(</span><span class="token punctuation">{</span> 
    action<span class="token operator">:</span> <span class="token string">&quot;android.intent.action.VIEW&quot;</span><span class="token punctuation">,</span> 
    data<span class="token operator">:</span> <span class="token string">&quot;mqq://im/chat?chat_type=wpa&amp;version=1&amp;src_type=web&amp;uin=&quot;</span> <span class="token operator">+</span> qq<span class="token punctuation">,</span> 
    packageName<span class="token operator">:</span> <span class="token string">&quot;com.tencent.mobileqq&quot;</span><span class="token punctuation">,</span> 
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="app-intent-options" tabindex="-1"><a class="header-anchor" href="#app-intent-options" aria-hidden="true">#</a> app.intent(options)</h2>`,80),d=a("code",null,[a("span",{class:"token property"},"options")],-1),u=a("code",null,[a("span",{class:"token property"},"action")],-1),h={href:"https://developer.android.com/reference/android/content/Intent.html#standard-activity-actions",target:"_blank",rel:"noopener noreferrer"},m=a("li",null,[a("p",null,[a("code",null,[a("span",{class:"token property"},"type")]),n(' {string} The MimeType of the intent, indicating the type of the data directly related to the intent, e.g. "text/plain" for plain text.')])],-1),k=a("li",null,[a("p",null,[a("code",null,[a("span",{class:"token property"},"data")]),n(' {string} The Data of the intent, which is the data directly related to the intent, is a Uri, which can be a file path or Url, etc. For example, to open a file, action is "android.intent.action.VIEW", data is "file:///sdcard/1.txt".')])],-1),g=a("code",null,[a("span",{class:"token property"},"category")],-1),v={href:"https://developer.android.com/reference/android/content/Intent.html#standard-categories",target:"_blank",rel:"noopener noreferrer"},f=a("li",null,[a("p",null,[a("code",null,[a("span",{class:"token property"},"packageName")]),n(" {string} The name of the target package.")])],-1),b=a("li",null,[a("p",null,[a("code",null,[a("span",{class:"token property"},"className")]),n(" {string} The name of the target component such as Activity or Service.")])],-1),y=a("code",null,[a("span",{class:"token property"},"extras")],-1),q={href:"https://developer.android.com/reference/android/content/Intent.html#standard-extra-data",target:"_blank",rel:"noopener noreferrer"},x=a("code",null,[a("span",{class:"token property"},"flags")],-1),w=s('<code><span class="token punctuation">[</span><span class="token string">&quot;activity_new_task&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;grant_read_uri_permission&quot;</span><span class="token punctuation">]</span></code>',1),j={href:"https://developer.android.com/reference/android/content/Intent.html#setFlags%28int%29",target:"_blank",rel:"noopener noreferrer"};function _(A,T){const e=c("ExternalLinkIcon");return i(),o("div",null,[l,a("ul",null,[a("li",null,[d,n(" {Object} options, including. "),a("ul",null,[a("li",null,[a("p",null,[u,n(' {string} The intended Action, which refers to the action intended to be completed, is a string constant, such as "android.intent.action.SEND". When the action starts with "android.intent.action", you can omit the prefix and use "SEND" instead. See '),a("a",h,[n("Actions"),t(e)]),n(".")])]),m,k,a("li",null,[a("p",null,[g,n(" {Array} The category of the intent. Used relatively rarely. See "),a("a",v,[n("Categories"),t(e)]),n(".")])]),f,b,a("li",null,[a("p",null,[y,n(" {Object} Extras (additional information) for this Intent composed as a key-value pair. Provides additional information about this Intent, such as the email title, email body when sending the email. See "),a("a",q,[n("Extras"),t(e)]),n(".")])]),a("li",null,[a("p",null,[x,n(" {Array} The identifier of the intent, an array of strings, e.g. "),w,n(". See "),a("a",j,[n("Flags"),t(e)]),n(".")])])])])])])}const E=p(r,[["render",_],["__file","app.html.vue"]]);export{E as default};