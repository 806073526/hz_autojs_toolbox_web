import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c as s,a as e,b as i,d as r,e as t,r as l}from"./app.6aa2b576.js";const c="/docs/assets/build-apk-menu.cb174a12.jpg",u={},d=t('<h1 id="build-apk" tabindex="-1"><a class="header-anchor" href="#build-apk" aria-hidden="true">#</a> Build Apk</h1><p>When we are done with the code, we can package the code as a standalone apk. Packaging can be divided into single-file packaging and project packaging. Single-file packaging can only package one js file. If this js file depends on other resources and code files, it cannot be packaged into apk. At this time, project packaging is required. For the function of the project, please refer to the next section &quot;Project and resources&quot;, here we focus on the packaging function.</p><p>In the file list, click the more icon (three dots) to the right of the file to be packaged, and select &quot;Package Single File&quot;.</p><p><img src="'+c+'" alt="Package single file" loading="lazy"></p><p>Enter the packaging interface. The packaging interface contains multiple configurations, and you can customize permissions, package name, application name, etc. After adjusting these configurations, click the Done (\u221A) icon in the lower right corner to start packaging.</p><p>Here we introduce the key packaging configurations in turn.</p><h2 id="application-configuration" tabindex="-1"><a class="header-anchor" href="#application-configuration" aria-hidden="true">#</a> Application configuration</h2><ul><li>Application name: the name displayed on the desktop after the packaged application is installed</li><li>Package name: the unique identifier of the application, the installation package with the same package name and signature can overwrite the installation. The package name can only contain letters, numbers, underscores, English dots, etc., and at least one English dot, such as &quot;com.example&quot;. Packages with invalid package names cannot be installed, and the message &quot;Installation package parsing failed&quot; may be displayed.</li><li>Version name: The version name displayed to the user, such as &quot;1.10.2&quot;.</li><li>Version number: An integer representing the internal version number. This integer needs to be incremented each time the version is updated.</li><li>Icon: The icon displayed on the desktop after the application is installed</li><li>Permissions: Configure the permissions in the application permission list, the default is 126 permissions. You can configure permissions as needed, and different functions require different permissions: <ul><li>Read and write files: READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE permissions are required</li><li>Screenshots, foreground services: FOREGROUND_SERVICE permission is required</li><li>Access to the network: INTERNET permission is required</li><li>Task: requires WAKE_LOCK permission</li><li>Booting: Requires RECEIVE_BOOT_COMPLETED permission</li><li>Floating window: SYSTEM_ALERT_WINDOW permission is required</li><li>adb permission to run shell commands: requires moe.shizuku.manager.permission.API_V23 permission</li></ul></li></ul><p>If some functions are used but the corresponding permissions are not configured, an error may be reported during runtime. For example, screenshots and foreground services are used, but the FOREGROUND_SERVICE permission is not configured, and it will crash when using the corresponding functions.</p><p>Permissions can also be configured to apply automatically at startup, such as automatically applying for the WRITE_EXTERNAL_STORAGE permission, and a permission application box will pop up after the app is started after packaging. Some permissions cannot be applied for and can only be configured in the permission list.</p><h2 id="features" tabindex="-1"><a class="header-anchor" href="#features" aria-hidden="true">#</a> Features</h2><ul><li>Image color module: To use functions such as OpenCV, image processing (cutting, binarization, etc.), image search and color search, this feature needs to be checked. If it is not checked, an error &quot;UnsatisfiedLinkError: No implementation found for org.opencv.core...&quot; will be reported at runtime.</li><li>Built-in icon pack: To use built-in icons, such as ic_add_black_48dp, etc., you need to check this feature.</li><li>Accessibility service: To use accessibility functions such as click, slide, and control selector, you need to check this feature. When this feature is not checked, the packaged application will not appear in the system&#39;s accessibility service management.</li><li>Handle external files: To use the IntentTask in the task (open, edit files, etc.), you need to check this feature. After checking, when you open some files in the file manager, you will be prompted to use the packaged application to open.</li><li>Node.js engine: Whether to use the Node.js engine (API v2). The Node.js engine is relatively large, with a single architecture reaching more than ten MB. <ul><li>Automatic: automatically determined according to the packaged files and whether the API v2 is used in the project</li><li>Disabled: Disable the Node.js engine</li><li>Enable: always enable the Node.js engine</li></ul></li><li>Built-in PaddleOCR: Select when using the built-in <code><span class="token property">$ocr</span></code> module. <ul><li>disabled: do not use the built-in ocr module</li><li>Comes with all models: use the built-in ocr module and come with default, slim models</li><li>With default model: use the built-in ocr module with default model</li><li>With slim model: use built-in ocr module with slim model</li></ul></li><li>Plug-ins: When using MLKit OCR, FFMpeg and other plug-ins, you need to check the plug-ins used here, so that the plug-ins can be packaged into the apk. The built-in OCR module does not need to check the plug-in here.</li></ul><h2 id="build-configuration" tabindex="-1"><a class="header-anchor" href="#build-configuration" aria-hidden="true">#</a> build configuration</h2>',13),h={href:"https://blog.autojs.org/2022/08/24/encryption/",target:"_blank",rel:"noopener noreferrer"},p=e("li",null,"CPU architecture: The default is the architecture of the current device. The CPU architecture will affect the size, compatibility, memory usage, and allowed speed of the software. The arm64-v8a architecture is faster, takes up more memory, and is only applicable to 64-bit machines. Generally speaking, the emulator does not support arm64-v8a. If you want better software compatibility, you can choose armeabi-v7a or dual architecture.",-1),g=e("li",null,"Obfuscate component names: whether to randomize the names of built-in components (such as broadcast, activity, service). After checking this option, the packing time will become very long, and you must keep in the foreground when packing to maintain a high scheduling priority.",-1),f=t('<h2 id="run-configuration" tabindex="-1"><a class="header-anchor" href="#run-configuration" aria-hidden="true">#</a> Run configuration</h2><ul><li>Hide log: Whether to display the log interface after packaging, this option does not take effect when the script has a UI interface. Generally speaking, it is recommended that scripts do not have any interface, otherwise some functions that depend on the interface will have errors or be easily killed by the system.</li><li>Display startup interface: Whether to display the startup interface, the default is the interface of the software icon. Even if set to off, it will still be shown once on first boot due to initialization.</li><li>Startup interface text: The default is Powered by Auto.js Pro, and the text content can be customized.</li><li>Startup interface icon: The default is the software icon. This icon cannot fill the screen. If you need to customize it, please use the custom startup image function. (See In-App Examples -&gt; Projects and Packaging -&gt; Custom Splash Map)</li></ul><h2 id="signature-configuration" tabindex="-1"><a class="header-anchor" href="#signature-configuration" aria-hidden="true">#</a> Signature configuration</h2><p>Only apps with the same package name and same signature can overwrite install and upgrade. If you need to continuously update an application, it is recommended that you use a custom signature. Because the default signature is randomly generated each time Auto.js Pro is installed, once you uninstall Auto.js Pro or clear the data, the default signature will be lost and cannot be retrieved. After the signature is lost, you need to ask users to uninstall the old version before installing the new version after you update the app and repackage it.</p><p>To create a custom signature, create a signature in the signature management, enter the password, alias and alias password to create. A signature can be used for multiple software, and each software uses a different alias and alias password, but the signature management that comes with Auto.js Pro only supports the creation of one alias.</p><p>Signature files, passwords, aliases, and alias passwords need to be kept well. Once lost or forgotten, there is no way to retrieve them.</p>',6);function m(k,b){const a=l("ExternalLinkIcon");return o(),s("div",null,[d,e("ul",null,[e("li",null,[i("Encryption: Select the encryption level. Refer to "),e("a",h,[i("Encryption and Level Description"),r(a)]),i(".")]),p,g]),f])}const _=n(u,[["render",m],["__file","build-apk.html.vue"]]);export{_ as default};