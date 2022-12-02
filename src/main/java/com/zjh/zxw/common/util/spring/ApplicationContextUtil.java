/*   
 * Copyright (c) 2017-2020 Founder. All Rights Reserved.   
 *   
 * This software is the confidential and proprietary information of   
 * Founder. You shall not disclose such Confidential Information   
 * and shall use it only in accordance with the terms of the agreements   
 * you entered into with Founder.   
 *   
 */     
package com.zjh.zxw.common.util.spring;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class ApplicationContextUtil implements ApplicationContextAware{
	
	private static ApplicationContext _applicationContext;

	/**
	 * (non-Javadoc)
	 * @see ApplicationContextAware#setApplicationContext(ApplicationContext)
	 */
	@SuppressWarnings("static-access")
	@Override
	public void setApplicationContext(ApplicationContext context)
			throws BeansException {
		this._applicationContext = context;
	}
	
	/**
	 * <p>获取Spring ApplicationContext对象</p>
	 * @return ApplicationContext    
	 */
	public static ApplicationContext getContext () {
		return _applicationContext;
	}

}
   