package com.shiro.campus.common;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class TimeUtils {
    // 检查数字范围交集（如"1-16"和"15-18"）
    public static boolean hasOverlap(String range1, String range2) {
        int[] a = parseRange(range1);
        int[] b = parseRange(range2);
        return a[0] <= b[1] && b[0] <= a[1];
    }

    // 检查星期交集（如"2,4"和"4,5"）
    public static boolean hasIntersection(String days1, String days2) {
        Set<String> set1 = new HashSet<>(Arrays.asList(days1.split(",")));
        Set<String> set2 = new HashSet<>(Arrays.asList(days2.split(",")));
        set1.retainAll(set2);
        return !set1.isEmpty();
    }

    private static int[] parseRange(String range) {
        String[] parts = range.split("-");
        return new int[]{Integer.parseInt(parts[0]), Integer.parseInt(parts[1])};
    }
}