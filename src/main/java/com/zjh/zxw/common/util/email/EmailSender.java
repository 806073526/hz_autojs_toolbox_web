package com.zjh.zxw.common.util.email;


import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Enumeration;
import java.util.Properties;
import java.util.Vector;


public class EmailSender {
    
   public static void main (String[] args)
    {
        MailInfo mailInfo = new MailInfo();
        mailInfo.setMailServerHost ("smtp.qq.com");
        mailInfo.setMailServerPort ("465");
        mailInfo.setUserName ("2431949231@qq.com");
        mailInfo.setPassword ("stranhhuzepbdigj");
        mailInfo.setValidate (true);
        mailInfo.setContent ("测试是否发生成功");
        mailInfo.setFromAddress ("2431949231@qq.com");
        mailInfo.setToAddress ("806073526@qq.com");
        boolean is465Flag=sendTextMail (mailInfo);
        System.out.println ("----------------------------------------------------465端口发送是否成功:"+is465Flag);

        
       /*MailInfo mailInfo2 = new MailInfo();
        mailInfo2.setMailServerHost ("smtp.qq.com");
        mailInfo2.setMailServerPort ("25");
        mailInfo2.setUserName ("2431949231@qq.com");
        mailInfo2.setPassword ("stranhhuzepbdigj");
        mailInfo2.setValidate (true);
		mailInfo2.setSubject("验证码");
        mailInfo2.setContent ("您的验证码是256514");
        mailInfo2.setFromAddress ("2431949231@qq.com");
        mailInfo2.setToAddress ("806073526@qq.com");
        boolean is25Flag=sendTextMail (mailInfo2);
        System.out.println ("----------------------------------------------------25端口发送是否成功:"+is25Flag);*/
    }

    public static boolean sendAutoJsEmail(String toEmail,String title,String content){
		MailInfo mailInfo2 = new MailInfo();
		mailInfo2.setMailServerHost ("smtp.qq.com");
		mailInfo2.setMailServerPort ("465");
		mailInfo2.setUserName ("2431949231@qq.com");
		mailInfo2.setPassword ("stranhhuzepbdigj");
		mailInfo2.setValidate (true);
		mailInfo2.setSubject(title);
		mailInfo2.setContent (content);
		mailInfo2.setFromAddress ("2431949231@qq.com");
		mailInfo2.setToAddress (toEmail);
		return sendTextMail (mailInfo2);
	}

    
	/**
	 * 以文本格式发送邮件
	 *
	 * @param mailInfo
	 *            待发送的邮件的信息
	 */
	public static boolean sendTextMail(MailInfo mailInfo) {

		// 获得发送邮件的环境，如服务器名称等
		Properties pro = mailInfo.getProperties();
	/*	pro.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");*/
		// 根据邮件会话属性和密码验证器构造一个发送邮件的session
		Session sendMailSession = Session.getDefaultInstance(pro);
		sendMailSession.setDebug(true);
		try {
			// 根据session创建一个邮件消息
			MimeMessage mailMessage = new MimeMessage(sendMailSession);
			// 创建邮件发送者地址
			Address from = new InternetAddress(mailInfo.getUserName());
			// 设置邮件消息的发送者
			mailMessage.setFrom(from);
			// 创建邮件的接收者地址，并设置到邮件消息中
			if (mailInfo.getToAddress().indexOf(",") > 0) {
				mailMessage.setRecipients(Message.RecipientType.TO, InternetAddress.parse(mailInfo.getToAddress()));
			} else {
				Address to = new InternetAddress(mailInfo.getToAddress());
				mailMessage.setRecipient(Message.RecipientType.TO, to);
			}
			// 设置邮件消息的主题
			mailMessage.setSubject(mailInfo.getSubject());
			/*MimeMultipart msgMultipart = new MimeMultipart();
			mailMessage.setContent(msgMultipart);
			MimeBodyPart contentPart = new MimeBodyPart();
			contentPart.setContent(mailInfo.getClass(),"text/html;charset=utf-8");*/
			// 设置邮件消息发送的时间
			mailMessage.setSentDate(new Date());
			// 设置邮件消息的主要内容

			String mailContent=mailInfo.getContent();
			/*try {
				mailContent = new String(mailInfo.getContent().getBytes("iso-8859-1"),"gb2312");
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}*/
			mailMessage.setContent(mailContent,"text/html;charset=UTF-8");
			//mailMessage.setHeader("Content-Transfer-Encoding", "Base64");
			// 发送邮件
			///System.out.println("content:"+mailMessage.getContent().toString());
			Transport transport = sendMailSession.getTransport();
			transport.connect(mailInfo.getUserName(), mailInfo.getPassword());
			transport.sendMessage(mailMessage, mailMessage.getRecipients(Message.RecipientType.TO));
			transport.close();
			return true;
		} catch (MessagingException ex) {
			ex.printStackTrace();
		}
		return false;
	}

	/**
	 * 以HTML格式发送邮件
	 *
	 * @param mailInfo
	 *            待发送的邮件信息
	 */
	public static boolean sendHtmlMail(MailInfo mailInfo) {
		// 判断是否需要身份认证
		// MyAuthenticator authenticator = null;
		Properties pro = mailInfo.getProperties();
		// 如果需要身份认证，则创建一个密码验证器
		// if (mailInfo.isValidate()) {
		// authenticator = new MyAuthenticator(mailInfo.getUserName(),
		// mailInfo.getPassword());
		// }
		// 根据邮件会话属性和密码验证器构造一个发送邮件的session
		Session sendMailSession = Session.getDefaultInstance(pro);
		try {
			// 根据session创建一个邮件消息
			Message mailMessage = new MimeMessage(sendMailSession);
			// 创建邮件发送者地址
			Address from = new InternetAddress(mailInfo.getFromAddress());
			// 设置邮件消息的发送者
			mailMessage.setFrom(from);
			// 创建邮件的接收者地址，并设置到邮件消息中
			Address to = new InternetAddress(mailInfo.getToAddress());
			// Message.RecipientType.TO属性表示接收者的类型为TO
			mailMessage.setRecipient(Message.RecipientType.TO, to);
			// 设置邮件消息的主题
			mailMessage.setSubject(mailInfo.getSubject());
			// 设置邮件消息发送的时间
			mailMessage.setSentDate(new Date());
			// MiniMultipart类是一个容器类，包含MimeBodyPart类型的对象
			Multipart mainPart = new MimeMultipart();
			// 创建一个包含HTML内容的MimeBodyPart
			BodyPart html = new MimeBodyPart();
			// 设置HTML内容
			html.setContent(mailInfo.getContent(), "text/html; charset=utf-8");
			mainPart.addBodyPart(html);
			// 将MiniMultipart对象设置为邮件内容
			mailMessage.setContent(mainPart);
			// 发送邮件
			Transport transport = sendMailSession.getTransport();
			transport.connect(mailInfo.getUserName(), mailInfo.getPassword());
			transport.sendMessage(mailMessage,
					mailMessage.getRecipients(Message.RecipientType.TO));
			transport.close();
			return true;
		} catch (MessagingException ex) {
			ex.printStackTrace();
		}
		return false;
	}

	public static boolean sendAttachment(MailInfo mailInfo) {
		// 判断是否需要身份认证
		//MyAuthenticator authenticator = null;
		Properties pro = mailInfo.getProperties();
		// 如果需要身份认证，则创建一个密码验证器
		/*if (mailInfo.isValidate()) {
			authenticator = new MyAuthenticator(mailInfo.getUserName(),
					mailInfo.getPassword());
		}*/
		// 根据邮件会话属性和密码验证器构造一个发送邮件的session
		Session sendMailSession = Session
				.getDefaultInstance(pro);
		sendMailSession.setDebug(true);
		try {
			// 根据session创建一个邮件消息
			Message mailMessage = new MimeMessage(sendMailSession);
			// 创建邮件发送者地址
			Address from = new InternetAddress(mailInfo.getFromAddress());
			// 设置邮件消息的发送者
			mailMessage.setFrom(from);
			// 创建邮件的接收者地址，并设置到邮件消息中
			Address to = new InternetAddress(mailInfo.getToAddress());
			// Message.RecipientType.TO属性表示接收者的类型为TO
			mailMessage.setRecipient(Message.RecipientType.TO, to);
			// 设置邮件消息的主题
			mailMessage.setSubject(mailInfo.getSubject());
			// 设置邮件消息发送的时间
			mailMessage.setSentDate(new Date());
			// MiniMultipart类是一个容器类，包含MimeBodyPart类型的对象
			Multipart mainPart = new MimeMultipart("mixed");
			// 创建一个包含附件的MimeBodyPart
			MimeBodyPart mimeBodyPart = null;
			String filename;
			if (!mailInfo.getFiles().isEmpty()) {
				Vector file = mailInfo.getFiles();
				Enumeration efile = file.elements();
				while (efile.hasMoreElements()) {
					mimeBodyPart = new MimeBodyPart();
					filename = efile.nextElement().toString(); // 选择出每一个附件名
					FileDataSource fds = new FileDataSource(filename); // 得到数据源
					mimeBodyPart.setDataHandler(new DataHandler(fds)); // 得到附件本身并至入BodyPart
					try {
						mimeBodyPart.setFileName(MimeUtility.encodeText(fds.getName()));
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					} // 得到文件名同样至入BodyPart
					mainPart.addBodyPart(mimeBodyPart);
					//mailMessage.setContent(mainPart,"file");
				}
				file.removeAllElements();

			}
			// 将MiniMultipart对象设置为邮件内容
			mailMessage.setContent(mainPart);
			// 发送邮件
			Transport transport = sendMailSession.getTransport();
			transport.connect(mailInfo.getUserName(), mailInfo.getPassword());
			transport.sendMessage(mailMessage,
					mailMessage.getRecipients(Message.RecipientType.TO));
			transport.close();
			return true;
		} catch (MessagingException ex) {
			ex.printStackTrace();
		}
		return false;
	}
}
