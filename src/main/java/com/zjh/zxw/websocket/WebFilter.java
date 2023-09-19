package com.zjh.zxw.websocket;


import com.zjh.zxw.common.util.StrHelper;
import com.zjh.zxw.common.util.ValidateInterfaceConfig;
import com.zjh.zxw.common.util.exception.BusinessException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.annotation.Order;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;


@javax.servlet.annotation.WebFilter(filterName = "sessionFilter", urlPatterns = "/*")
@Order(1)
public class WebFilter implements Filter {
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) servletRequest;
        // 获取请求地址
        String requestURI = req.getRequestURI();
        // 当是需要校验接口的请求
        if(ValidateInterfaceConfig.needValidateInterface(requestURI)){
            // 读取设备uuid
            String deviceUuid = StrHelper.getOrDef(req.getHeader("deviceUuid"),"");
            // 读取设备密码
            String devicePassword = StrHelper.getOrDef(req.getHeader("devicePassword"),"");

            if(StringUtils.isBlank(deviceUuid)){
                throw new BusinessException("未读取到设备uuid");
            }
            boolean validFlag = AutoJsWsServerEndpoint.validPassword(deviceUuid,devicePassword);
            if(!validFlag){
                throw new BusinessException("设备访问密码不正确");
            }
        }
        req.getSession().setAttribute("IP", IPUtil.getIpAddress(req));
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
