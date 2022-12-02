package com.zjh.zxw.common.util;

import cn.hutool.core.collection.CollectionUtil;
import com.zjh.zxw.common.util.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static cn.hutool.core.date.DatePattern.CHINESE_DATE_TIME_PATTERN;


/**
 * 描述：日期工具类
 *
 * @author duanX
 * @Date ：2019-11-29 10:15
 */
@Slf4j
public class DateUtils {
    public final static String DEFAULT_YEAR_FORMAT = "yyyy";
    public final static String DEFAULT_MONTH_FORMAT = "yyyy-MM";
    public final static String DEFAULT_MONTH_FORMAT_SLASH = "yyyy/MM";
    public final static String DEFAULT_MONTH_FORMAT_EN = "yyyy年MM月";
    public final static String DEFAULT_WEEK_FORMAT = "yyyy-ww";
    public final static String DEFAULT_WEEK_FORMAT_EN = "yyyy年ww周";
    public final static String DEFAULT_DATE_FORMAT = "yyyy-MM-dd";
    public final static String DEFAULT_DATE_FORMAT_EN = "yyyy年MM月dd日";
    public final static String DEFAULT_DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
    public final static String DEFAULT_TIME_FORMAT = "HH:mm:ss";
    public final static String DEFAULT_SIMPLETE_DATE_TIME_FORMAT = "yyyyMMddHHmmss";
    public final static String DAY = "DAY";
    public final static String MONTH = "MONTH";
    public final static String WEEK = "WEEK";
    public static final String DATE_SMALL_STR = "yyyyMMdd";
    public static final String DEFAULT_DATE_TIME_FORMAT_EN = CHINESE_DATE_TIME_PATTERN;

    public static final String DEFAULT_DATE_FORMAT_MATCHES = "^\\d{4}-\\d{1,2}-\\d{1,2}$";
    public static final String DEFAULT_DATE_TIME_FORMAT_MATCHES = "^\\d{4}-\\d{1,2}-\\d{1,2} {1}\\d{1,2}:\\d{1,2}:\\d{1,2}$";
    public static final String DEFAULT_DATE_FORMAT_EN_MATCHES = "^\\d{4}年\\d{1,2}月\\d{1,2}日$";
    public static final String DEFAULT_DATE_TIME_FORMAT_EN_MATCHES = "^\\d{4}年\\d{1,2}月\\d{1,2}日\\d{1,2}时\\d{1,2}分\\d{1,2}秒$";
    public static final String SLASH_DATE_FORMAT_MATCHES = "^\\d{4}/\\d{1,2}/\\d{1,2}$";
    public static final String SLASH_DATE_TIME_FORMAT_MATCHES = "^\\d{4}/\\d{1,2}/\\d{1,2} {1}\\d{1,2}:\\d{1,2}:\\d{1,2}$";
    public static final String SLASH_DATE_FORMAT = "yyyy/MM/dd";
    public static final String SLASH_DATE_TIME_FORMAT = "yyyy/MM/dd HH:mm:ss";
    public static final String CRON_FORMAT = "ss mm HH dd MM ? yyyy";
    public final static String DEFAULT_MONTH_AND_DAY_FORMAT = "MM-dd";

    public final static String FULLYEAY_AND_MONTH = "YYYY.MM";

    /**
     * 中文年月
     */
    public final static String DEFAULT_MONDTH_AND_FORMAT_ZN = "M月dd日";

    /**
     * 年 月 日 时 分
     */
    public final static String DATE_TIME_FORMAT_NOT_SECOND = "yyyy-MM-dd HH:mm";
    /**
     * 一个月平均天数
     */
    public final static long MAX_MONTH_DAY = 30;
    /**
     * 3个月平均天数
     */
    public final static long MAX_3_MONTH_DAY = 90;
    /**
     * 一年平均天数
     */
    public final static long MAX_YEAR_DAY = 365;


    private DateUtils() {
    }
//--格式化日期start-----------------------------------------

    /**
     * 格式化日期,返回格式为 yyyy-MM
     *
     * @param date 日期
     * @return
     */
    public static String format(LocalDateTime date, String pattern) {
        if (date == null) {
            date = LocalDateTime.now();
        }
        if (pattern == null) {
            pattern = DEFAULT_MONTH_FORMAT;
        }
        return date.format(DateTimeFormatter.ofPattern(pattern));
    }


    /**
     * 格式化日期,返回格式为 yyyy-MM
     *
     * @param date 日期
     * @return
     */
    public static String format(LocalDate date, String pattern) {
        return date.format(DateTimeFormatter.ofPattern(pattern));
    }



    public static LocalDate String2LocalDate(String date){
        if(date == null ) {
            return LocalDate.now();
        }
       return LocalDate.parse(date, DateTimeFormatter.ofPattern(DateUtils.DEFAULT_DATE_FORMAT));
    }

    /**
     * 日期格式字符串自动补零
     * @param date
     * @return
     */
    public static String stringDateFillZero(String date) {
        String[] dates = date.split("-");
        for(int i=0;i<dates.length;i++) {
            dates[i] = Integer.parseInt(dates[i]) < 10 ? "0"+ Integer.parseInt(dates[i]) : dates[i];
        }
        return CollectionUtil.join(Arrays.asList(dates), "-");
    }

    public static LocalDateTime String2LocalDateTime(String date){
        if(date == null ) {
            return LocalDateTime.now();
        }
        return LocalDateTime.parse(date, DateTimeFormatter.ofPattern(DateUtils.DEFAULT_DATE_TIME_FORMAT));
    }

    /**
     * 兼容"yyyy-MM-dd"转成LocalDateTime
     * @param date
     * @return
     */
    public static LocalDateTime StringForceLocalDateTime(String date){
        if(date == null ) {
            return LocalDateTime.now();
        }
        if(date.length() < 11){
            return LocalDateTime.of(String2LocalDate(date),LocalTime.MIN);
        }
        return LocalDateTime.parse(date, DateTimeFormatter.ofPattern(DateUtils.DEFAULT_DATE_TIME_FORMAT));
    }

    /**
     * 根据传入的格式格式化日期.默认格式为MM月dd日
     *
     * @param d 日期
     * @param f 格式
     * @return
     */
    public static String format(Date d, String f) {
        Date date = d;
        String format = f;
        if (date == null) {
            date = new Date();
        }
        if (format == null) {
            format = DEFAULT_DATE_TIME_FORMAT;
        }
        SimpleDateFormat df = new SimpleDateFormat(format);
        return df.format(date);
    }

    /**
     * 格式化日期,返回格式为 yyyy-MM-dd
     *
     * @param date 日期
     * @return
     */
    public static String formatAsDate(LocalDateTime date) {
        return format(date, DEFAULT_DATE_FORMAT);
    }

    /**
     * yyyyMMddHHmmss
     * @param date
     * @return
     */
    public static String formatAsDateTime(LocalDateTime date) {
        return format(date, DEFAULT_SIMPLETE_DATE_TIME_FORMAT);
    }

    public static String formatAsDateEn(LocalDateTime date) {
        return format(date, DEFAULT_DATE_FORMAT_EN);
    }

    /**
     * 转换成2021.11形式
      * @param date
     * @return
     */
    public static  String formatAsYearMonth(LocalDate date) {
        return format(date,FULLYEAY_AND_MONTH);
    }

    /**
     * 格式化日期,返回格式为 yyyy-MM-dd
     *
     * @param date 日期
     * @return
     */
    public static String formatAsDate(LocalDate date) {
        return format(date, DEFAULT_DATE_FORMAT);
    }

    public static String formatAsYearMonth(LocalDateTime date) {
        return format(date, DEFAULT_MONTH_FORMAT);
    }

    public static String formatAsYearMonthEn(LocalDateTime date) {
        return format(date, DEFAULT_MONTH_FORMAT_EN);
    }

    /**
     * 格式化日期,返回格式为 yyyy-ww
     *
     * @param date 日期
     * @return
     */
    public static String formatAsYearWeek(LocalDateTime date) {
        return format(date, DEFAULT_WEEK_FORMAT);
    }

    public static String formatAsYearWeekEn(LocalDateTime date) {
        return format(date, DEFAULT_WEEK_FORMAT_EN);
    }

    /**
     * 格式化日期,返回格式为 yyyy-MM
     *
     * @param date 日期
     * @return
     */
    public static String formatAsYearMonth(Date date) {
        SimpleDateFormat df = new SimpleDateFormat(DEFAULT_MONTH_FORMAT);
        return df.format(date);
    }

    /**
     * 格式化为月日
     * @param date
     * @return
     */
    public static String formatAsMonthAndDay(LocalDate date) {
        return format(date,DEFAULT_MONTH_AND_DAY_FORMAT);
    }

    /**
     * 格式化日期,返回格式为 yyyy-ww
     *
     * @param date 日期
     * @return
     */
    public static String formatAsYearWeek(Date date) {
        SimpleDateFormat df = new SimpleDateFormat(DEFAULT_WEEK_FORMAT);
        return df.format(date);
    }

    /**
     * 格式化日期,返回格式为 HH:mm:ss 例:12:24:24
     *
     * @param date 日期
     * @return
     */
    public static String formatAsTime(Date date) {
        SimpleDateFormat df = new SimpleDateFormat(DEFAULT_TIME_FORMAT);
        return df.format(date);
    }

    /**
     * 格式化日期,返回格式为 yyyy-MM-dd
     *
     * @param date 日期
     * @return
     */
    public static String formatAsDate(Date date) {
        SimpleDateFormat df = new SimpleDateFormat(DEFAULT_DATE_FORMAT);
        return df.format(date);
    }

    /**
     * 格式化日期,返回格式为 yyyy-MM-dd HH:mm:ss
     *
     * @param date 日期
     * @return
     */
    public static String formatAsDateTime(Date date) {
        SimpleDateFormat df = new SimpleDateFormat(DEFAULT_DATE_TIME_FORMAT);
        return df.format(date);
    }

    /**
     * 格式化日期,返回格式为 dd ,即对应的天数.
     *
     * @param date 日期
     * @return
     */
    public static String formatAsDay(Date date) {
        SimpleDateFormat df = new SimpleDateFormat("dd");
        return df.format(date);
    }


    public static int compareDateWithNow(Date date1){
        Date date2 = new Date();
        int rnum =date1.compareTo(date2);

        return rnum;
    }
    //--格式化日期end-----------------------------------------

    //--解析日期start-----------------------------------------

    /**
     * 将字符转换成日期
     *
     * @param dateStr
     * @param format
     * @return
     */
    public static Date parse(String dateStr, String format) {
        Date date = null;
        SimpleDateFormat sdateFormat = new SimpleDateFormat(format);
        sdateFormat.setLenient(false);
        try {
            date = sdateFormat.parse(dateStr);

        } catch (Exception e) {
            log.info("DateUtils error {} ", e);
        }
        return date;
    }

    /**
     * 根据传入的String返回对应的date
     *
     * @param dateString
     * @return
     */
    public static Date parseAsDate(String dateString) {
        SimpleDateFormat df = new SimpleDateFormat(DEFAULT_DATE_FORMAT);
        try {
            return df.parse(dateString);
        } catch (ParseException e) {
            return new Date();
        }
    }

    /**
     * 按给定参数返回Date对象
     *
     * @param dateTime 时间对象格式为("yyyy-MM-dd HH:mm:ss");
     * @return
     */
    public static Date parseAsDateTime(String dateTime) {
        SimpleDateFormat simpledateformat = new SimpleDateFormat(DEFAULT_DATE_TIME_FORMAT);
        try {
            return simpledateformat.parse(dateTime);
        } catch (ParseException e) {
            return null;
        }
    }

    /**
     * 获取指定日期的开始时间
     * 如：00:00:00
     *
     * @param value
     * @return
     */
    public static Date getDate0000(LocalDateTime value) {
        return getDate0000(value.toLocalDate());
    }

    /**
     * 获取指定日期的开始时间
     * 如：00:00:00
     *
     * @param value
     * @return
     */
    public static Date getDate0000(Date value) {
        return getDate0000(DateUtils.date2LocalDate(value));
    }

    /**
     * 获取指定日期的开始时间
     * 如：00:00:00
     *
     * @param value
     * @return
     */
    public static Date getDate0000(LocalDate value) {
        LocalDateTime todayStart = LocalDateTime.of(value, LocalTime.MIN);
        return DateUtils.localDateTime2Date(todayStart);
    }

    /**
     * 获取指定日期的结束时间
     * 如：23:59:59
     *
     * @param value
     * @return
     */
    public static Date getDate2359(LocalDateTime value) {
        return getDate2359(value.toLocalDate());

    }

    /**
     * 获取指定日期的结束时间
     * 如：23:59:59
     *
     * @param value
     * @return
     */
    public static Date getDate2359(Date value) {
        return getDate2359(DateUtils.date2LocalDate(value));
    }

    /**
     * 获取指定日期的结束时间
     * 如：23:59:59
     *
     * @param value
     * @return
     */
    public static Date getDate2359(LocalDate value) {
        LocalDateTime dateEnd = LocalDateTime.of(value, LocalTime.MAX);
        return DateUtils.localDateTime2Date(dateEnd);
    }

    /**
     * LocalDateTime转换为Date
     *
     * @param localDateTime
     */
    public static Date localDateTime2Date(LocalDateTime localDateTime) {
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime zdt = localDateTime.atZone(zoneId);
        return Date.from(zdt.toInstant());
    }

    //--解析日期 end-----------------------------------------


    /**
     * Date转换为LocalDateTime
     *
     * @param date
     */
    public static LocalDateTime date2LocalDateTime(Date date) {
        if (date == null) {
            return LocalDateTime.now();
        }
        Instant instant = date.toInstant();
        ZoneId zoneId = ZoneId.systemDefault();
        return instant.atZone(zoneId).toLocalDateTime();
    }

    /**
     * 日期转 LocalDate
     *
     * @param date
     * @return
     */
    public static LocalDate date2LocalDate(Date date) {
        if (date == null) {
            return LocalDate.now();
        }
        Instant instant = date.toInstant();
        ZoneId zoneId = ZoneId.systemDefault();
        return instant.atZone(zoneId).toLocalDate();
    }

    /**
     * 日期转 LocalTime
     *
     * @param date
     * @return
     */
    public static LocalTime date2LocalTime(Date date) {
        if (date == null) {
            return LocalTime.now();
        }
        Instant instant = date.toInstant();
        ZoneId zoneId = ZoneId.systemDefault();
        return instant.atZone(zoneId).toLocalTime();
    }

    //-计算日期 start------------------------------------------


    /**
     * 计算结束时间与当前时间中的天数
     *
     * @param endDate 结束日期
     * @return
     */
    public static long until(Date endDate) {
        return LocalDateTime.now().until(date2LocalDateTime(endDate), ChronoUnit.DAYS);
    }

    /**
     * 计算结束时间与开始时间中的天数
     *
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return
     */
    public static long until(Date startDate, Date endDate) {
        return date2LocalDateTime(startDate).until(date2LocalDateTime(endDate), ChronoUnit.DAYS);
    }


    /**
     * 计算结束时间与开始时间中的天数
     *
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return
     */
    public static long until(LocalDateTime startDate, LocalDateTime endDate) {
        return startDate.until(endDate, ChronoUnit.DAYS);
    }

    public static long until(LocalDate startDate, LocalDate endDate) {
        return startDate.until(endDate, ChronoUnit.DAYS);
    }

    /**
     * 计算2个日期之间的所有的日期 yyyy-MM-dd
     * 含头含尾
     *
     * @param start yyyy-MM-dd
     * @param end   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenDay(Date start, Date end) {
        return getBetweenDay(date2LocalDate(start), date2LocalDate(end));
    }

    /**
     * 计算2个日期之间的所有的日期 yyyy-MM-dd
     * 含头含尾
     *
     * @param start yyyy-MM-dd
     * @param end   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenDay(String start, String end) {
        return getBetweenDay(LocalDate.parse(start), LocalDate.parse(end));
    }

    /**
     * 计算2个日期之间的所有的日期 yyyy-MM-dd
     * 含头含尾
     *
     * @param startDate yyyy-MM-dd
     * @param endDate   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenDay(LocalDate startDate, LocalDate endDate) {
        return getBetweenDay(startDate, endDate, DEFAULT_DATE_FORMAT);
    }

    public static List<String> getBetweenDayEn(LocalDate startDate, LocalDate endDate) {
        return getBetweenDay(startDate, endDate, DEFAULT_DATE_FORMAT_EN);
    }

    public static List<String> getBetweenDay(LocalDate startDate, LocalDate endDate, String pattern) {
        if (pattern == null) {
            pattern = DEFAULT_DATE_FORMAT;
        }
        List<String> list = new ArrayList<>();
        long distance = ChronoUnit.DAYS.between(startDate, endDate);
        if (distance < 1) {
            return list;
        }
        String finalPattern = pattern;
        Stream.iterate(startDate, d -> d.plusDays(1)).
                limit(distance + 1)
                .forEach(f -> list.add(f.format(DateTimeFormatter.ofPattern(finalPattern))));
        return list;
    }


    /**
     * 计算2个日期之间的所有的周 yyyy-ww
     * 含头含尾
     *
     * @param start yyyy-MM-dd
     * @param end   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenWeek(Date start, Date end) {
        return getBetweenWeek(date2LocalDate(start), date2LocalDate(end));
    }

    /**
     * 计算2个日期之间的所有的周 yyyy-ww
     * 含头含尾
     *
     * @param start yyyy-MM-dd
     * @param end   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenWeek(String start, String end) {
        return getBetweenWeek(LocalDate.parse(start), LocalDate.parse(end));
    }

    /**
     * 计算2个日期之间的所有的周 yyyy-ww
     * 含头含尾
     *
     * @param startDate yyyy-MM-dd
     * @param endDate   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenWeek(LocalDate startDate, LocalDate endDate) {
        return getBetweenWeek(startDate, endDate, DEFAULT_WEEK_FORMAT);
    }

    public static List<String> getBetweenWeek(LocalDate startDate, LocalDate endDate, String pattern) {
        List<String> list = new ArrayList<>();

        long distance = ChronoUnit.WEEKS.between(startDate, endDate);
        if (distance < 1) {
            return list;
        }
        Stream.iterate(startDate, d -> d.plusWeeks(1)).
                limit(distance + 1).forEach(f -> list.add(f.format(DateTimeFormatter.ofPattern(pattern))));
        return list;
    }

    /**
     * 计算2个日期之间的所有的月 yyyy-MM
     *
     * @param start yyyy-MM-dd
     * @param end   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenMonth(Date start, Date end) {
        return getBetweenMonth(date2LocalDate(start), date2LocalDate(end));
    }

    /**
     * 计算2个日期之间的所有的月 yyyy-MM
     *
     * @param start yyyy-MM-dd
     * @param end   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenMonth(String start, String end) {
        return getBetweenMonth(LocalDate.parse(start), LocalDate.parse(end));
    }

    /**
     * 计算2个日期之间的所有的月 yyyy-MM
     *
     * @param startDate yyyy-MM-dd
     * @param endDate   yyyy-MM-dd
     * @return
     */
    public static List<String> getBetweenMonth(LocalDate startDate, LocalDate endDate) {
        return getBetweenMonth(startDate, endDate, DEFAULT_MONTH_FORMAT);
    }

    public static List<String> getBetweenMonth(LocalDate startDate, LocalDate endDate, String pattern) {
        List<String> list = new ArrayList<>();
        long distance = ChronoUnit.MONTHS.between(startDate, endDate);
        if (distance < 1) {
            return list;
        }

        Stream.iterate(startDate, d -> d.plusMonths(1))
                .limit(distance + 1)
                .forEach(f -> list.add(f.format(DateTimeFormatter.ofPattern(pattern))));
        return list;
    }

    /**
     * 计算时间区间内的日期列表，并返回
     *
     * @param startTime
     * @param endTime
     * @param dateList
     * @return
     */
    public static String calculationEn(LocalDateTime startTime, LocalDateTime endTime, List<String> dateList) {
        if (startTime == null) {
            startTime = LocalDateTime.now();
        }
        if (endTime == null) {
            endTime = LocalDateTime.now().plusDays(30);
        }
        return calculationEn(startTime.toLocalDate(), endTime.toLocalDate(), dateList);
    }

    public static String calculation(LocalDate startDate, LocalDate endDate, List<String> dateList) {
        if (startDate == null) {
            startDate = LocalDate.now();
        }
        if (endDate == null) {
            endDate = LocalDate.now().plusDays(30);
        }
        if (dateList == null) {
            dateList = new ArrayList<>();
        }
        long day = until(startDate, endDate);

        String dateType = MONTH;
        if (day >= 0 && day <= MAX_MONTH_DAY) {
            dateType = DAY;
            dateList.addAll(DateUtils.getBetweenDay(startDate, endDate, DEFAULT_DATE_FORMAT));
        } else if (day > MAX_MONTH_DAY && day <= MAX_3_MONTH_DAY) {
            dateType = WEEK;
            dateList.addAll(DateUtils.getBetweenWeek(startDate, endDate, DEFAULT_WEEK_FORMAT));
        } else if (day > MAX_3_MONTH_DAY && day <= MAX_YEAR_DAY) {
            dateType = MONTH;
            dateList.addAll(DateUtils.getBetweenMonth(startDate, endDate, DEFAULT_MONTH_FORMAT));
        } else {
            throw new BusinessException("日期参数只能介于0-365天之间");
        }
        return dateType;
    }

    public static String calculationEn(LocalDate startDate, LocalDate endDate, List<String> dateList) {
        if (startDate == null) {
            startDate = LocalDate.now();
        }
        if (endDate == null) {
            endDate = LocalDate.now().plusDays(30);
        }
        if (dateList == null) {
            dateList = new ArrayList<>();
        }
        long day = until(startDate, endDate);

        String dateType = MONTH;
        if (day >= 0 && day <= MAX_MONTH_DAY) {
            dateType = DAY;
            dateList.addAll(DateUtils.getBetweenDay(startDate, endDate, DEFAULT_DATE_FORMAT_EN));
        } else if (day > MAX_MONTH_DAY && day <= MAX_3_MONTH_DAY) {
            dateType = WEEK;
            dateList.addAll(DateUtils.getBetweenWeek(startDate, endDate, DEFAULT_WEEK_FORMAT_EN));
        } else if (day > MAX_3_MONTH_DAY && day <= MAX_YEAR_DAY) {
            dateType = MONTH;
            dateList.addAll(DateUtils.getBetweenMonth(startDate, endDate, DEFAULT_MONTH_FORMAT_EN));
        } else {
            throw new BusinessException("日期参数只能介于0-365天之间");
        }
        return dateType;
    }


    /**
     * 判断是否是日期字符串
     * @param date
     * @return
     */
    public static boolean isDate(String date){
        /**
         * 判断日期格式和范围
         */
        String rex = "^((\\d{2}(([02468][048])|([13579][26]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))[\\-\\/\\s]?((((0?[13578])|(1[02]))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\\-\\/\\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\\-\\/\\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))";
        Pattern pat = Pattern.compile(rex);
        Matcher mat = pat.matcher(date);
        boolean dateType = mat.matches();
        return dateType;
    }

    /**
     * 取得给定日期加上一定天数后的日期对象.
     * @param date 给定的日期对象
     * @param amount 需要添加的天数，如果是向前的天数，使用负数就可以.
     * @return Date 加上一定天数以后的Date对象.
     */
    public static Date getFormatDateAdd(Date date, int amount) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        cal.add(GregorianCalendar.DATE, amount);
        return  cal.getTime();
    }

    /**
     * 获取是周几
     */
    public static int getDayOfWeek(String year, String month, String day) {
        Calendar cal = new GregorianCalendar(new Integer(year).intValue(),
                new Integer(month).intValue() - 1, new Integer(day).intValue());
        int weekNum = 0;
        //周一为一
        if (cal.get(Calendar.DAY_OF_WEEK)==1) {
            weekNum=7;
        }else{
            weekNum = cal.get(Calendar.DAY_OF_WEEK)-1;
        }
        return weekNum;
    }

    /**
     * 根据某个日期获取一周的时间链表
     * @return
     */
    private static String[] weekNames = {"周一","周二","周三","周四","周五","周六","周日"};
    public static List<Map<String,Object>> getWeekDays(String dayTime) {
        String[] a = dayTime.split("-");
        int week = getDayOfWeek(a[0], a[1], a[2]);//获取周几
        String formatPatter = "yyyy-MM-dd";
        List<Map<String,Object>> weekList = new ArrayList<>();
        SimpleDateFormat format = new SimpleDateFormat(formatPatter);
        for (int i = 1,amount=0; i <= 7; i++) {
            amount =  i - week;
            Date curTime =getFormatDateAdd(parse(dayTime, formatPatter), amount);
            Map<String,Object> temp = new HashMap<>();
            temp.put("date",format.format(curTime));
            temp.put("weeks",i);
            temp.put("weekName",weekNames[i-1]);
            weekList.add(temp);
        }
        return weekList;
    }


    public static List<Map<String,Object>> getWeekDaysByBetweenDay(LocalDate startDate, LocalDate endDate) {
        List<Map<String,Object>> weekList = new ArrayList<>();
        List<String> days=DateUtils.getBetweenDay(startDate,endDate);
        long distance = ChronoUnit.DAYS.between(startDate, endDate);
        // 当前是同一天时
        if(distance==0){
            // 添加默认值
            days.add(startDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        if(CollectionUtil.isNotEmpty(days)){
            for(String day:days){
                String[] a = day.split("-");
                int week = getDayOfWeek(a[0], a[1], a[2]);//获取周几
                Map<String,Object> temp = new HashMap<>();
                temp.put("date",day);
                temp.put("weeks",week);
                temp.put("weekName",weekNames[week-1]);
                weekList.add(temp);
            }
        }

        return weekList;
    }


    /**
     * LocalDateTime
     * @param str
     * @param pattern
     * @return
     */
    public static LocalDateTime parseToLocalDateTime(String str, String pattern) {
        if (StringUtils.isAnyBlank(str, pattern)) {
            return null;
        }

        LocalDateTime localDateTime;
        try {
            localDateTime = LocalDateTime.parse(str, DateTimeFormatter.ofPattern(pattern));
        } catch (Exception ex) {
            ex.printStackTrace();
            LocalDate localDate = parseLocalDate(str, pattern);
            localDateTime = Objects.isNull(localDate) ? null : localDate.atStartOfDay();
        }
        return localDateTime;
    }

    /**
     * 字符串转LocalDate
     * @param str
     * @param pattern
     * @return
     */
    public static LocalDate parseLocalDate(String str, String pattern) {
        if (StringUtils.isAnyBlank(str, pattern)) {
            return null;
        }

        LocalDate localDate = null;
        try {
            localDate = LocalDate.parse(str, DateTimeFormatter.ofPattern(pattern));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return localDate;
    }

    /**
     * 获取某月的第一天
     * @Title:getFirstDayOfMonth
     * @Description:
     * @param:@param year
     * @param:@param month
     * @param:@return
     * @return:String
     * @throws
     */
    public static String getFirstDayOfMonth(int year,int month)
    {
        Calendar cal = Calendar.getInstance();
        //设置年份
        cal.set(Calendar.YEAR,year);
        //设置月份
        cal.set(Calendar.MONTH, month-1);
        //获取某月最小天数
        int firstDay = cal.getActualMinimum(Calendar.DAY_OF_MONTH);
        //设置日历中月份的最小天数
        cal.set(Calendar.DAY_OF_MONTH, firstDay);
        //格式化日期
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String firstDayOfMonth = sdf.format(cal.getTime());

        return firstDayOfMonth;
    }

    /**
     * 获取指定日期的当月第一天
     * @return
     */
    public static LocalDate getFirstLocalDate(LocalDate date){
        LocalDate firstday = date.with(TemporalAdjusters.firstDayOfMonth());
        return firstday;
    }

    /**
     * 获取指定日期的当月最后一天
     * @return
     */
    public static LocalDate getLastLocalDate(LocalDate date){
        LocalDate lastDay = date.with(TemporalAdjusters.lastDayOfMonth());
        return  lastDay;
    }


    private static  SimpleDateFormat sdf = new SimpleDateFormat(DEFAULT_DATE_FORMAT);

    /**
     * 获取指定范围时间内的所有周次，包含周一和周日信息
     * @param firstDay
     * @param endDay
     * @return
     * @throws ParseException
     */
    public static Map<Integer,Map<String,Object>> getCustomWeekMaps(String firstDay,String endDay) throws ParseException {
        Calendar c_begin = new GregorianCalendar();
        Calendar c_end = new GregorianCalendar();
        c_begin.setTime(sdf.parse(firstDay));
        c_end.setTime(sdf.parse(endDay));
        int count = 1;
        c_end.add(Calendar.DAY_OF_YEAR, 1);  //结束日期下滚一天是为了包含最后一天
        Map<Integer,Map<String,Object>> weekMaps = new HashMap<>();
        while(c_begin.before(c_end)){
            int week = c_begin.get(Calendar.DAY_OF_WEEK);
            if(week == Calendar.MONDAY  || week == Calendar.SUNDAY) {
                Map<String,Object> weekMap = weekMaps.get(count);
                if(CollectionUtil.isEmpty(weekMap)){
                    weekMap = new HashMap<>();
                    weekMaps.put(count,weekMap);
                }
                weekMap.put("count",count);
                if(week== Calendar.MONDAY) {
                    weekMap.put("monday", sdf.format(c_begin.getTime().getTime()));
                }  else if(week == Calendar.SUNDAY){
                    weekMap.put("sunday", sdf.format(c_begin.getTime().getTime()));
                    count++;
                }
            }
            c_begin.add(Calendar.DAY_OF_YEAR, 1);
        }

        if(CollectionUtil.isEmpty(weekMaps)) {
            c_begin.setTime(sdf.parse(firstDay));
            c_begin.setFirstDayOfWeek(Calendar.MONDAY);
            int dayWeek = c_begin.get(Calendar.DAY_OF_WEEK);
            if(dayWeek>1){
                c_begin.add(Calendar.DATE, c_begin.getFirstDayOfWeek() - dayWeek);
            }
            weekMaps.put(count,new HashMap<String,Object>(){{
                put("monday",sdf.format(c_begin.getTime().getTime()));
                c_begin.add(Calendar.DATE, 6);
                put("sunday",sdf.format(c_begin.getTime().getTime()));
            }});
        } else if(weekMaps.size() == 1) {
            c_begin.setTime(sdf.parse(firstDay));
            c_begin.setFirstDayOfWeek(Calendar.MONDAY);
            int dayWeek = c_begin.get(Calendar.DAY_OF_WEEK);
            if(dayWeek>1){
                c_begin.add(Calendar.DATE, c_begin.getFirstDayOfWeek() - dayWeek);
            }
            if(weekMaps.get(1).get("monday") == null) {
                weekMaps.get(1).put("monday",sdf.format(c_begin.getTime().getTime()));
            }
            if(weekMaps.get(1).get("sunday") == null) {
                c_begin.add(Calendar.DATE, 6);
                weekMaps.get(1).put("sunday",sdf.format(c_begin.getTime().getTime()));
            }
        }else if(weekMaps.size() > 1 && weekMaps.get(1).get("monday") == null) {
            c_begin.setTime(sdf.parse(weekMaps.get(1).get("sunday").toString()));
            c_begin.add(Calendar.DATE, -6);
            weekMaps.get(1).put("monday",sdf.format(c_begin.getTime().getTime()));
        }

        if(count <=weekMaps.size() &&  weekMaps.get(count).get("sunday") == null){
            c_begin.setTime(sdf.parse(weekMaps.get(count).get("monday").toString()));
            c_begin.add(Calendar.DATE, 6);
            weekMaps.get(count).put("sunday",sdf.format(c_begin.getTime().getTime()));
        }
        return weekMaps;
    }


    private static  SimpleDateFormat yearMonthSDF = new SimpleDateFormat(DEFAULT_MONTH_FORMAT);


    /**
     * 根据两个日期获取月第一天和最后一天的链表集合
     * @param minDate
     * @param maxDate
     * @return
     * @throws ParseException
     */
    public static Map<Integer,Map<String,Object>> getMonthBetweenCollections(String minDate, String maxDate) throws ParseException {

        Calendar min = Calendar.getInstance();
        Calendar max = Calendar.getInstance();

        min.setTime(yearMonthSDF.parse(minDate));
        min.set(min.get(Calendar.YEAR), min.get(Calendar.MONTH), 1);

        max.setTime(yearMonthSDF.parse(maxDate));
        max.set(max.get(Calendar.YEAR), max.get(Calendar.MONTH), 2);

        Calendar curr = min;

        Map<Integer,Map<String,Object>> monthMaps = new HashMap<>();

        int i = 0;
        while (curr.before(max)) {
            String startDate =  sdf.format(curr.getTime());
            if(i == 0) {
                 startDate = minDate;
            }
            //本月最后一天
            curr.set(Calendar.DAY_OF_MONTH, curr.getActualMaximum(Calendar.DAY_OF_MONTH));
            String endDate = sdf.format(curr.getTime());

            Map<String,Object> temp = new HashMap<>();
            temp.put("start",startDate);
            temp.put("end",endDate);
            monthMaps.put(i,temp);
            curr.set(Calendar.DAY_OF_MONTH, 1);
            curr.add(Calendar.MONTH, 1);
            i++;
        }

        if(CollectionUtil.isNotEmpty(monthMaps)) {
            monthMaps.get(monthMaps.size() - 1).put("end",maxDate);
        }
        return monthMaps;
    }

    /**
     * 获取月第一天和最后一天的链表集合
     * @param dates 日期集合
     * @param maxDate 结束日期
     * @return
     * @throws ParseException
     */
    public static Map<Integer,Map<String,Object>> getMonthBetweenCollections(List<String> dates,String maxDate) throws ParseException {
        if(CollectionUtil.isEmpty(dates)) {
            return null;
        }
        List<LocalDate> collect = dates.stream().map(date -> DateUtils.String2LocalDate(date))
                .sorted(Comparator.comparing(date -> date)).distinct().collect(Collectors.toList());
        Map<Integer,Map<String,Object>> monthMaps = new HashMap<>();
        collect.forEach(LambdaUtils.consumerWithIndex((date,index)->{

            String startDate = DateUtils.formatAsDate(date);

            String endDate = "";
            if(index == collect.size() - 1){
                endDate = maxDate;
            }else {
                endDate =  DateUtils.formatAsDate(collect.get(index + 1).plusDays(-1));
            }
            Map<String,Object> temp = new HashMap<>();
            temp.put("start",startDate);
            temp.put("end",endDate);
            monthMaps.put(index,temp);
        }));

        return monthMaps;
    }



    /**
     * 获取某月的最后一天
     * @Title:getLastDayOfMonth
     * @Description:
     * @param:@param year
     * @param:@param month
     * @param:@return
     * @return:String
     * @throws
     */
    public static String getLastDayOfMonth(int year,int month)
    {
        Calendar cal = Calendar.getInstance();
        //设置年份
        cal.set(Calendar.YEAR,year);
        //设置月份
        cal.set(Calendar.MONTH, month-1);
        //获取某月最大天数
        int lastDay = cal.getActualMaximum(Calendar.DAY_OF_MONTH);
        //设置日历中月份的最大天数
        cal.set(Calendar.DAY_OF_MONTH, lastDay);
        //格式化日期
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String lastDayOfMonth = sdf.format(cal.getTime());

        return lastDayOfMonth;
    }
//----------//----------//----------//----------//----------//----------//----------//----------//----------//----------//----------


    /**
     * 判断两个时间段是否存在相交部分
     * 存在相交 TRUE 不存在 FALSE
     * */
    // 公用time对象 零点零秒零分
    private static final LocalTime of = LocalTime.of(0, 0,0);

    /** 对比两个时间*/
    public static final Boolean contrast(LocalDate leftStartDate,String Symbol,
                                        LocalDate leftEndDate){
       return contrast( LocalDateTime.of(leftStartDate, of),Symbol,LocalDateTime.of(leftEndDate, of));
    }

    public static final Boolean contrast(LocalDateTime leftStartDate,String Symbol,
                                   LocalDateTime leftEndDate){
        long l = leftStartDate.toEpochSecond(ZoneOffset.of("+8"));
        long lr = leftEndDate.toEpochSecond(ZoneOffset.of("+8"));
        switch (Symbol) {
            case "==":return l == lr;
            case ">":return l > lr;
            case "<":return l < lr;
            case ">=":return l >= lr;
            case "<=":return l <= lr;
            default:return Boolean.FALSE;
        }
    }

    // 两个时间段是否有交集
    public static final Boolean isOverlapping(LocalDateTime leftStartDate,
                                LocalDateTime leftEndDate,
                                LocalDateTime rightStartDate,
                                LocalDateTime rightEndDate
    ){
        if(Objects.isNull(leftStartDate) || Objects.isNull(leftEndDate) || Objects.isNull(rightStartDate)|| Objects.isNull(rightEndDate)){
            return Boolean.FALSE;
        }
        boolean result =  ((leftStartDate.toEpochSecond(ZoneOffset.of("+8")) >= rightStartDate.toEpochSecond(ZoneOffset.of("+8")))
                && leftStartDate.toEpochSecond(ZoneOffset.of("+8")) <= rightEndDate.toEpochSecond(ZoneOffset.of("+8")))
                ||
                ((leftStartDate.toEpochSecond(ZoneOffset.of("+8")) > rightStartDate.toEpochSecond(ZoneOffset.of("+8")))
                        && leftStartDate.toEpochSecond(ZoneOffset.of("+8")) <= rightEndDate.toEpochSecond(ZoneOffset.of("+8")))
                ||
                ((rightStartDate.toEpochSecond(ZoneOffset.of("+8")) >= leftStartDate.toEpochSecond(ZoneOffset.of("+8")))
                        && rightStartDate.toEpochSecond(ZoneOffset.of("+8")) <= leftEndDate.toEpochSecond(ZoneOffset.of("+8")))
                ||
                ((rightStartDate.toEpochSecond(ZoneOffset.of("+8")) > leftStartDate.toEpochSecond(ZoneOffset.of("+8")))
                        && rightStartDate.toEpochSecond(ZoneOffset.of("+8")) <= leftEndDate.toEpochSecond(ZoneOffset.of("+8")));
        return result;
    }

    // 两个时间段是否有交集
    public static final Boolean isOverlapping(LocalDate leftStartDate,
                                        LocalDate leftEndDate,
                                        LocalDate rightStartDate,
                                        LocalDate rightEndDate){
        if(Objects.isNull(leftStartDate) || Objects.isNull(leftEndDate) || Objects.isNull(rightStartDate)|| Objects.isNull(rightEndDate)){
            return Boolean.FALSE;
        }
       return isOverlapping(LocalDateTime.of(leftStartDate,of),LocalDateTime.of(leftEndDate,of),
               LocalDateTime.of(rightStartDate,of),LocalDateTime.of(rightEndDate,of));
    }



    // 判断时间是否包含再时间段内

    /**
     *
     * @param leftStartDate 开始日期
     * @param leftEndDate  结束日期
     * @param date 判断值
     * @return
     */
    public static final Boolean isContain(LocalDate leftStartDate,
                                        LocalDate leftEndDate,
                                        LocalDate date)
    {
        if(Objects.isNull(leftStartDate) || Objects.isNull(leftEndDate) || Objects.isNull(date)){
            return Boolean.FALSE;
        }
        return isContain(LocalDateTime.of(leftStartDate,of),LocalDateTime.of(leftEndDate,of),
                LocalDateTime.of(date,of));
    }
    // 判断时间是否包含再时间段内
    public static final Boolean isContain(LocalDateTime leftStartDate,
                                    LocalDateTime leftEndDate,
                                    LocalDateTime date)
    {
        if(Objects.isNull(leftStartDate) || Objects.isNull(leftEndDate) || Objects.isNull(date)){
            return Boolean.FALSE;
        }
        return leftStartDate.toEpochSecond(ZoneOffset.of("+8")) <= date.toEpochSecond(ZoneOffset.of("+8")) &&
                leftEndDate.toEpochSecond(ZoneOffset.of("+8")) >= date.toEpochSecond(ZoneOffset.of("+8"));
    }


    /**
     * 通过时间秒毫秒数判断两个时间的间隔
     * @param date1
     * @param date2
     * @return
     */

    public static final int differentDaysByMillisecond(LocalDateTime date1,LocalDateTime date2)
    {

        Long start = date1.toInstant(ZoneOffset.of("+8")).toEpochMilli();
        Long end =date2.toInstant(ZoneOffset.of("+8")).toEpochMilli();
        int days = (int) ((end - start) / (1000*3600*24));
        return days;
    }
    public static final int differentDaysByMillisecond(LocalDate date1,LocalDate date2)
    {
        Long start = LocalDateTime.of(date1,of).toInstant(ZoneOffset.of("+8")).toEpochMilli();
        Long end =LocalDateTime.of(date2,of).toInstant(ZoneOffset.of("+8")).toEpochMilli();
        int days = (int) ((end - start) / (1000*3600*24));
        return days;
    }

    /** 获取传入时间的 当前周 第一天和最后一天*/
    public static final LocalDate[] getNowWeek(LocalDate now){
        DayOfWeek dayOfWeek = now.getDayOfWeek();
        return new LocalDate[]{
                now.plusDays(-dayOfWeek.getValue() + 1),
                now.plusDays(7-(dayOfWeek.getValue()))
        };
    }


    /** 获取传入时间的 当前月 第一天和最后一天*/
    public static final LocalDate[] getNowMonth(LocalDate now){
        return new LocalDate[]{
                getFirstLocalDate(now),
                getLastLocalDate(now)
        };
    }

    /**
     * 转成时间戳
     * @param dateTime
     * @return
     */
    public static long getLongTimeByDate(LocalDateTime dateTime) {
        return dateTime.toInstant(ZoneOffset.of("+8")).toEpochMilli();
    }

    /**
     * 判断两个时间段的重叠天数
     * @param startDate1
     * @param endDate1
     * @param startDate2
     * @param endDate2
     * @return
     */
    public static long overLappingDayCount(LocalDate startDate1,LocalDate endDate1,LocalDate startDate2,LocalDate endDate2){
        long dayCount=0l;
        Boolean startBeforeFlag=startDate1.isBefore(startDate2);
        Boolean endBeforeFlag=endDate1.isBefore(endDate2);
        // 比较开始时间
        LocalDate compareStartDate=null;
        // 比较结束时间
        LocalDate compareEndDate=null;
        // 取比较晚的开始时间
        if(startBeforeFlag){
            compareStartDate=startDate2;
        }else{
            compareStartDate=startDate1;
        }
        // 取比较早的结束时间
        if(endBeforeFlag){
            compareEndDate=endDate1;
        }else{
            compareEndDate=endDate2;
        }
        // 计算相差天数  用比较早的结束时间-比较晚的开始时间
        dayCount=DateUtils.until(compareStartDate,compareEndDate);
        // 如果相差天数小于0 则说明没有重复天数 返回0即可
        if(dayCount<0){
            return  0;
        }
        // 如果相差天数大于等于0 则 重叠天数需要+1
        dayCount++;
        return  dayCount;
    }

    /**
     * 计算年龄
     * @param birthday
     * @return
     */
    public static  int getAge(String birthday) {
        LocalDate today = LocalDate.now();
        LocalDate playerDate = LocalDate.from(DateTimeFormatter.ofPattern(DateUtils.DEFAULT_DATE_FORMAT).parse(birthday));
        long years = ChronoUnit.YEARS.between(playerDate, today);
        return (int) years;
    }

    /**
     * 计算年龄
     * @param birthday
     * @return
     */
    public static  int getAge(LocalDate birthday) {
        LocalDate today = LocalDate.now();
        long years = ChronoUnit.YEARS.between(birthday, today);
        return (int) years;
    }

    /**
     * 计算两个日期的间隔时间
     * @param startDate
     * @param endDate
     * @return {1}年{2}月{3}天
     */
    public  static String getIntervalIDays(LocalDate startDate, LocalDate endDate) {
        if(Objects.isNull(startDate) || Objects.isNull(endDate) ) {
            return "";
        }
        Period between = Period.between(startDate, endDate);
        String res = "";
        if(between.getYears() > 0) {
            res += between.getYears() +"年";
        }
        if(between.getMonths() >0) {
            res += between.getMonths() +"月";
        }
        if(between.getDays() >0) {
            res += between.getDays() +"天";
        }
        return res;
    }

    /**
     * 计算两个日期间隔天数
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return
     */
    public static  int getDateIntervalIDays(LocalDate startDate, LocalDate endDate) {
        if(Objects.isNull(startDate) || Objects.isNull(endDate) ) {
            return 0;
        }
        Period between = Period.between(startDate, endDate);
        return between.getDays();
    }

    /**
     * 获取当前月份所在季度
     * @param date
     * @return
     */
    public static int getQuarter(LocalDate date) {
       return  (date.getMonthValue()-1)/3 + 1;
    }
}
