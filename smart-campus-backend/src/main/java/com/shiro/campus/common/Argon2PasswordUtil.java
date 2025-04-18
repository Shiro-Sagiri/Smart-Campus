package com.shiro.campus.common;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

public class Argon2PasswordUtil {
    // 使用 Argon2id (抗侧信道攻击的最佳变体)
    private static final Argon2 ARGON2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);

    // 推荐参数 (根据服务器性能调整)
    private static final int ITERATIONS = 3;      // 迭代次数
    private static final int MEMORY = 65536;     // 内存使用量(KB)，64MB
    private static final int PARALLELISM = 1;    // 并行线程数

    /**
     * 生成密码哈希
     */
    public static String hash(String plainPassword) {
        try {
            return ARGON2.hash(ITERATIONS, MEMORY, PARALLELISM, plainPassword.toCharArray());
        } finally {
            // 清除内存中的敏感数据
            ARGON2.wipeArray(plainPassword.toCharArray());
        }
    }

    /**
     * 验证密码
     */
    public static boolean verify(String hashedPassword, String plainPassword) {
        try {
            return ARGON2.verify(hashedPassword, plainPassword.toCharArray());
        } finally {
            ARGON2.wipeArray(plainPassword.toCharArray());
        }
    }

    /**
     * 检查哈希是否需要重新计算(参数升级时使用)
     */
    public static boolean needsRehash(String hashedPassword) {
        return ARGON2.needsRehash(hashedPassword, ITERATIONS, MEMORY, PARALLELISM);
    }
}