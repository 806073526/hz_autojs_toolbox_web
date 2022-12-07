import {getContext} from "./../../utils/utils.js";
let template='' +
    '<div>' +
    '<p class="basicInfo">远程脚本执行</p>' +
    '<el-row>' +
    '    <div class="width100 d-flex a-start">' +
    '        <el-form-item label="脚本内容:" prop="scriptText" class="width100">' +
    '            <el-input v-model="remoteHandler.param4.scriptText" :rows="10" type="textarea" placeholder="请输入脚本内容" class="width100"/>' +
    '        </el-form-item>' +
    '        <el-button type="primary" size="mini" style="margin-left:10px" id="remoteRunScript"' +
    '                   @click.stop.prevent="remoteExecuteScript(remoteHandler.param4.scriptText)">运行脚本' +
    '        </el-button>' +
    '    </div>' +
    '</el-row>' +
    '</div>';

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