package com.zjh.zxw.base.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

/**
 * jwt 存储的 内容
 * @author: duanX
 * @date: 2019-12-2 14:01
 * @Description:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtUserInfo implements Serializable {
    /**
     * 账号id
     */
    private String userId;
    /**
     * 账号
     */
    private String account;
    /**
     * 姓名
     */
    private String name;

    /**
     * 病区id
     */
    private String wardId;

    /**
     * 当前登录人科室id
     */
    private String deptId;

    /**
     * 当前登录人岗位ID
     */
    private Integer jobId;

    /**
     * 当前租户前置机http地址（ip + prot  或者 domain）
     */
    private String httpPath;

    /**
     * 当前登录人租户信息
     */
    private String tenant;

    /** 云上医护APP 角色数据来源系统   护理管理 nurseManage  医务管理doctor */
    private String mobileRole;

    /** 登陆人 角色ids  */
    private String roles;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        JwtUserInfo that = (JwtUserInfo) o;
        // 判断是同一个人的方式 userId相等


        return Objects.equals(userId, that.userId) &&
                Objects.equals(account, that.account) &&
                Objects.equals(name, that.name) &&
                Objects.equals(tenant, that.tenant);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, account, name, tenant);
    }
}
