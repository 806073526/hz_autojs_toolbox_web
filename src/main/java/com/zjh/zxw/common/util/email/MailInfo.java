package com.zjh.zxw.common.util.email;


import java.io.Serializable;
import java.util.Properties;
import java.util.Vector;

/**
 * 邮件信息实体类
 *
 */
public class MailInfo implements Serializable
{

    /**
     * serialVersionUID:TODO
     *
     * @since Ver 1.1
     */

    private static final long serialVersionUID = 1L;
    // 发送邮件的服务器的IP如qq服务器为smtp.qq.com
    private String _mailServerHost;
    // 发送邮件的服务器的端口
    private String _mailServerPort;
    // 邮件发送者的地址
    private String _fromAddress;
    // 邮件接收者的地址
    private String _toAddress;
    // 登陆邮件发送服务器的用户名和密码
    private String _userName;
    private String _password;
    // 是否需要身份验证
    private boolean _validate = false;
    // 邮件主题
    private String _subject;
    // 邮件的文本内容
    private String _content;
    // 邮件附件的集合
    private Vector files;


    /**
     * 获得邮件会话属性
     */
    public Properties getProperties ()
    {
        Properties p = new Properties ();
        p.put ("mail.smtp.host", this._mailServerHost);
        p.put ("mail.smtp.port", this._mailServerPort);
        p.put ("mail.transport.protocol", "smtp");
        p.put ("mail.smtp.auth", this._validate ? "true" : "false");
        p.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        return p;
    }

    @Override
    public String toString ()
    {
        return "MailInfo{" +
               "_mailServerHost='" + _mailServerHost + '\'' +
               ", _mailServerPort='" + _mailServerPort + '\'' +
               ", _fromAddress='" + _fromAddress + '\'' +
               ", _toAddress='" + _toAddress + '\'' +
               ", _userName='" + _userName + '\'' +
               ", _password='" + _password + '\'' +
               ", _validate=" + _validate +
               ", _subject='" + _subject + '\'' +
               ", _content='" + _content + '\'' +
               ", files=" + files +
               '}';
    }

    public String getMailServerHost ()
    {
        return _mailServerHost;
    }

    public void setMailServerHost (String mailServerHost)
    {
        _mailServerHost = mailServerHost;
    }

    public String getMailServerPort ()
    {
        return _mailServerPort;
    }

    public void setMailServerPort (String mailServerPort)
    {
        _mailServerPort = mailServerPort;
    }

    public String getFromAddress ()
    {
        return _fromAddress;
    }

    public void setFromAddress (String fromAddress)
    {
        _fromAddress = fromAddress;
    }

    public String getToAddress ()
    {
        return _toAddress;
    }

    public void setToAddress (String toAddress)
    {
        _toAddress = toAddress;
    }

    public String getUserName ()
    {
        return _userName;
    }

    public void setUserName (String userName)
    {
        _userName = userName;
    }

    public String getPassword ()
    {
        return _password;
    }

    public void setPassword (String password)
    {
        _password = password;
    }

    public boolean isValidate ()
    {
        return _validate;
    }

    public void setValidate (boolean validate)
    {
        _validate = validate;
    }

    public String getSubject ()
    {
        return _subject;
    }

    public void setSubject (String subject)
    {
        _subject = subject;
    }

    public String getContent ()
    {
        return _content;
    }

    public void setContent (String content)
    {
        _content = content;
    }

    public Vector getFiles ()
    {
        return files;
    }

    public void setFiles (Vector files)
    {
        this.files = files;
    }

}
