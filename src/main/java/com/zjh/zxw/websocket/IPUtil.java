package com.zjh.zxw.websocket;

import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.spring.UploadPathHelper;
import org.apache.commons.lang3.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.net.*;
import java.util.Enumeration;

public class IPUtil {

    private static String cacheIpInfo = "";

    /**
     * 获取用户真实IP地址，不使用request.getRemoteAddr();的原因是有可能用户使用了代理软件方式避免真实IP地址。
     * 可是，如果通过了多级反向代理的话，X-Forwarded-For的值并不止一个，而是一串IP值，究竟哪个才是真正的用户端的真实IP呢？
     * 答案是取X-Forwarded-For中第一个非unknown的有效IP字符串
     *
     * @param request
     * @return
     */
    public static String getIpAddress(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
            if ("127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip)) {
                //根据网卡取本机配置的IP
                InetAddress inet = null;
                try {
                    inet = InetAddress.getLocalHost();
                } catch (UnknownHostException e) {
                    e.printStackTrace();
                }
                ip = inet.getHostAddress();
            }
        }
        return ip;
    }
    public static String getMacRealIp(){
        String wlanIp = "";
        String otherIp = "";
        try {
            Enumeration<NetworkInterface> allNetInterfaces = NetworkInterface.getNetworkInterfaces();
            while (allNetInterfaces.hasMoreElements()) {
                NetworkInterface netInterface = allNetInterfaces.nextElement();
                if (netInterface.isLoopback() || netInterface.isVirtual() || !netInterface.isUp()) {
                    continue;
                }
                Enumeration<InetAddress> addresses = netInterface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    InetAddress ip = addresses.nextElement();
                    if (ip instanceof Inet4Address) {
                        if (netInterface.getName().toLowerCase().contains("en")) { // 以en开头的通常是以太网接口
                            otherIp = ip.getHostAddress();
                        } else if (netInterface.getName().toLowerCase().contains("wl")) { // 以wl开头的通常是无线网接口
                            wlanIp = ip.getHostAddress();
                        }
                    }
                }
            }
        } catch (SocketException e) {
            e.printStackTrace();
        }
        return StringUtils.isNotBlank(wlanIp) ? wlanIp : otherIp;
    }


    public static String getRealIP() {
        if(StringUtils.isNotBlank(cacheIpInfo)){
            return cacheIpInfo;
        }
        String result = "";
        // 兼容非windows系统
        if(!UploadPathHelper.isWindowsSystem()){
            result = getMacRealIp();
            cacheIpInfo = result;
            return result;
        }
        String wlanIp = "";
        String otherIp = "";
        try {
            //获取到所有的网卡
            Enumeration<NetworkInterface> allNetInterfaces = NetworkInterface.getNetworkInterfaces();
            while (allNetInterfaces.hasMoreElements()) {
                NetworkInterface netInterface =  allNetInterfaces.nextElement();
                // 去除回环接口127.0.0.1，子接口，未运行的接口
                if (netInterface.isLoopback() || netInterface.isVirtual() || !netInterface.isUp()) {
                    continue;
                }
                String name = netInterface.getName();
                //获取名称中是否包含 Intel Realtek 的网卡
                if (!netInterface.getDisplayName().contains("Intel")
                        && !netInterface.getDisplayName().contains("Realtek")
                        && !netInterface.getDisplayName().contains("Atheros")
                        && !netInterface.getDisplayName().contains("Broadcom")) {
                    continue;
                }
                Enumeration<InetAddress> addresses = netInterface.getInetAddresses();
                //System.out.println(netInterface.getDisplayName());
                while (addresses.hasMoreElements()) {
                    InetAddress ip = addresses.nextElement();
                    if (ip != null) {
                        if (ip instanceof Inet4Address) {
                            // 包含wlan
                            if(StrHelper.getObjectValue(name).toLowerCase().contains("wlan")){
                                wlanIp = ip.getHostAddress();
                            } else {
                                otherIp = ip.getHostAddress();
                            }
                        }
                    }
                }
            }
        } catch (SocketException e) {
            e.getMessage();
        }
        result = StringUtils.isNotBlank(wlanIp) ? wlanIp : otherIp;
        cacheIpInfo = result;
        return result;
    }

}