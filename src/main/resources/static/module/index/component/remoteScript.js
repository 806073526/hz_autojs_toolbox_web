import {getContext} from "./../../../utils/utils.js";
let template='<div></div>';
$.ajax({
    url: "/module/index/template/remoteScript.html",
    type:'get',
    async:false,
    success:function(res){
        template = String(res);
    }
});

export default {
    template: template,
    name: 'RemoteScript',
    inject: ['validSelectDevice', 'sendMsgToClient', 'remoteExecuteScript'],
    props: {
        deviceInfo: { // 设备信息
            type: Object,
            default() {
                return {
                    startPreview: false,
                    deviceUuid: '',
                    standardWidth: null,
                    standardHeight: null,
                    standardConvert: false,
                    offsetX: 0,
                    offsetY: 0
                }
            }
        },
        screenDirection: {
            type: String,
            default: '横屏'
        }
    },
    data() {
        return {
            remoteHandler: {
                param4: {
                    scriptText: ''
                }
            }
        }
    },
    methods: {
        // 远程运行脚本
        remoteRunScript() {
        }
    }
}