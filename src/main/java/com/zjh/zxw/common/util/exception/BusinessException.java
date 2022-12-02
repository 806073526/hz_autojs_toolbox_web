package com.zjh.zxw.common.util.exception;


import java.io.Serializable;
import java.text.MessageFormat;
import java.util.MissingResourceException;

/**
 * 业务异常基类. 带有错误代码与错误信息. 用户在生成异常时既可以直接赋予错误代码与错误信息. 也可以只赋予错误代码与错误信息参数.
 * 如ErrorCode=ORDER.LACK_INVENTORY ,errorArg=without EJB
 * 系统会从errors.properties中查出 ORDER.LACK_INVENTORY=Book <{0}> lack of inventory
 * 最后返回错误信息为 Book <without EJB> lack of inventory.
 * 
 */
public class BusinessException extends RuntimeException implements Serializable
{

    /**
     * 序列化ID号.
     */
    private static final long serialVersionUID = 1L;

    /**
     * 默认的错误编码.
     */
    public static final String DEFAULT_ERROR_CODE = "UNKNOW_ERROR";

    /**
     * 错误代码,默认为未知错误.
     */
    private String m_errorCode = DEFAULT_ERROR_CODE;

    /**
     * 错误信息中的参数.
     */
    private String[] m_errorArgs = null;

    /**
     * 兼容纯错误信息，不含error code,errorArgs的情况.
     */
    private String m_errorMessage = null;

    /**
     * @return the errorMessage
     */
    protected String getErrorMessage ()
    {
        return m_errorMessage;
    }

    /**
     * @param errorMessage the errorMessage to set.
     */
    protected void setErrorMessage (String errorMessage)
    {
        m_errorMessage = errorMessage;
    }

    /**
     * @param errorCode the errorCode to set.
     */
    protected void setErrorCode (String errorCode)
    {
        m_errorCode = errorCode;
    }

    /**
     * 错误信息的i18n ResourceBundle. 默认Properties文件名定义于
     * {@link Constants#ERROR_BUNDLE_KEY}
     */
    // static private ResourceBundle rb =
    // ResourceBundle.getBundle(Constants.ERROR_BUNDLE_KEY);

    public BusinessException ()
    {
        super ();
        this.getMessage ();
    }

    /**
     * 构造器.
     * 
     * @param errorCode 错误编码
     * @param errorArgs 错误格式化参数
     */
    public BusinessException (String errorCode, String[] errorArgs)
    {
        super (errorCode);
        this.m_errorCode = errorCode;
        this.m_errorArgs = errorArgs;
    }

    /**
     * .
     * 
     * @param errorMessage
     * @param cause
     */
    public BusinessException (String errorMessage, Throwable cause)
    {
        super (errorMessage, cause);
        this.m_errorMessage = errorMessage;
    }

    public BusinessException (int code, String errorMessage, Throwable cause)
    {
        super (errorMessage, cause);
        this.m_errorCode = String.valueOf(code);
        this.m_errorMessage = errorMessage;
    }

    public BusinessException (String errorCode, String errorMessage)
    {
        super (errorCode);
        this.m_errorCode = errorCode;
        this.m_errorMessage = errorMessage;
    }


    public BusinessException (String errorCode, String[] errorArgs, Throwable cause)
    {
        super (errorCode, cause);
        this.m_errorCode = errorCode;
        this.m_errorArgs = errorArgs;
    }

    public BusinessException (String errorCode, String errorArg, Throwable cause)
    {
        super (cause);
        this.m_errorCode = errorCode;
        this.m_errorArgs = new String[]
        { errorArg };
    }

    public BusinessException (String errorMessage)
    {
        super (errorMessage);
        this.m_errorMessage = errorMessage;
    }

    /**
     * 获得出错信息. 读取i18N properties文件中Error Code对应的message,并组合参数获得i18n的出错信息.
     */
    public String getMessage ()
    {
        // 如果errorMessage不为空,直接返回出错信息.
        if (m_errorMessage != null)
        {
            return m_errorMessage;
        }
        // 否则用errorCode查询Properties文件获得出错信息
        String message = null;
        try
        {
            // message = rb.getString(errorCode);

            // 将出错信息中的参数代入到出错信息中
            if (m_errorArgs != null && message != null)
            {
                message = MessageFormat.format (message, (Object[]) m_errorArgs);
            }
            message += ", Error Code is: " + m_errorCode;
        }
        catch (MissingResourceException mse)
        {
            message = "ErrorCode is: " + m_errorCode + ", but can't get the message of the Error Code";
        }
        return message;

    }

    public String getErrorCode ()
    {
        return m_errorCode;
    }

    public String[] getErrorArgs ()
    {
        return m_errorArgs;
    }

    public void setErrorArgs (String[] errorArgs)
    {
        this.m_errorArgs = errorArgs;
    }
}