package com.zjh.zxw.common.util.md5;


import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;


/**
 * 密码生成与校验.（生成密码不可逆）
 * 
 */
public class PasswordAuthenticatorUtil {
	public static final String ALGORITHM = "MD5";

	public static final int SALT = 12;

	public static final int ALEN = 16;
	
	public static final String defaultPassWord="123456abc";


	/**
	 * @param password
	 *            需要产行密文的明文
	 * @return String MD5加密后的密文
	 * @exception Exception
	 *                出错后抛出异常
	 */	
	public static String encryptPassword(String password) {
		SecureRandom random = new SecureRandom();
		byte salt[] = new byte[SALT];
		random.nextBytes(salt);
		MessageDigest md;
		try {
			md = MessageDigest.getInstance("MD5");
			md.update(salt);
			md.update(password.getBytes("UTF8"));
			byte digest[] = md.digest();
			String saltText = new String(Base64.getEncoder().encode(salt));
			String encryptPwd = new String(Base64.getEncoder().encode(digest));
			return saltText + encryptPwd;
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 密码校验
	 * @param inputPassword 输入的密码
	 * @param originalPassword 原始密码
	 * @return boolean如果能匹配返回true，否则返回false
	 */
	public static boolean comparePassword(String inputPassword,
			String originalPassword) {
		String encryptPwd = originalPassword.substring(
				PasswordAuthenticatorUtil.ALEN, originalPassword.length());
		String salt = originalPassword.substring(0, PasswordAuthenticatorUtil.ALEN);
		boolean flag;
		try {
//			BASE64Decoder dncoder = new BASE64Decoder();
//			byte saltData[] = dncoder.decodeBuffer(salt);
			byte[] saltData = Base64.getDecoder().decode(salt);
			MessageDigest md;
			md = MessageDigest.getInstance("MD5");
			md.update(saltData);
			md.update(inputPassword.getBytes("UTF8"));
			byte[] digest = md.digest();
//			BASE64Encoder encoder = new BASE64Encoder();
//			String encryptInputPwd = encoder.encode(digest);
			byte[] encryptInputPwd = Base64.getDecoder().decode(digest);
			flag = encryptPwd.equals(new String(encryptInputPwd));
		} catch (IOException e) {
			throw new RuntimeException(e);
		} catch (NoSuchAlgorithmException e) {
			throw new RuntimeException(e);
		}
		return flag;
	}
	
	public static void main(String[] args) {
		System.err.println(PasswordAuthenticatorUtil.encryptPassword("123456"));
	}
}
