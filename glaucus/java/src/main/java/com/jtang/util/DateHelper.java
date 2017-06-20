package com.jtang.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;

/**
 * Dealing with Time and Date function kit
 * Created by lucas on 2016/10/19.
 */
public class DateHelper {

    public static int monthCalculator(String fromDate, String toDate, String form) throws Exception {
        DateFormat formatter = new SimpleDateFormat(form, Locale.ENGLISH);
        try {
            Date startDate = formatter.parse(fromDate);
            Date endDate = formatter.parse(toDate);
            Calendar startCalendar = new GregorianCalendar();
            startCalendar.setTime(startDate);
            Calendar endCalendar = new GregorianCalendar();
            endCalendar.setTime(endDate);

            int diffYear = endCalendar.get(Calendar.YEAR) - startCalendar.get(Calendar.YEAR);
            int diffMonth = diffYear * 12 + endCalendar.get(Calendar.MONTH) - startCalendar.get(Calendar.MONTH);
            return diffMonth;
        } catch (ParseException e) {
            e.printStackTrace();
            throw e;
        }
    }
   /* //"EEE MMM dd HH:mm:ss Z yyyy" is the default test of the organ transplant thing.
    public static void main(String[] args) throws Exception {
        System.out.println(monthCalculator("Wed Feb 25 08:00:00 CST 1998", "Wed Mar 25 08:00:00 CST 1999", "EEE MMM dd HH:mm:ss Z yyyy"));
    }*/
}
