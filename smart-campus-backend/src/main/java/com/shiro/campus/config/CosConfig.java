package com.shiro.campus.config;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.http.HttpProtocol;
import com.qcloud.cos.region.Region;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "tencent.cos")
public class CosConfig {

    private String secretId;
    private String secretKey;
    private String region;

    @Bean(destroyMethod = "shutdown")
    public COSClient cosClient() {
        COSCredentials cred = new BasicCOSCredentials(secretId, secretKey);
        ClientConfig clientConfig = new ClientConfig(new Region(region));

        // 优化连接池配置
        clientConfig.setMaxConnectionsCount(100);
        clientConfig.setConnectionTimeout(30_000);
        clientConfig.setSocketTimeout(30_000);
        clientConfig.setConnectionRequestTimeout(30_000);

        // 启用HTTPS
        clientConfig.setHttpProtocol(HttpProtocol.https);

        return new COSClient(cred, clientConfig);
    }

}
