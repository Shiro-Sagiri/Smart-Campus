package com.shiro.campus.common;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.model.ObjectMetadata;
import com.qcloud.cos.model.PutObjectRequest;
import com.shiro.campus.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Component
public class CosUtils {

    @Value("${tencent.cos.bucket-name}")
    private String bucketName;
    @Value("${tencent.cos.baseUrl}")
    private String baseUrl;

    private final COSClient cosClient;

    public CosUtils(COSClient cosClient) {
        this.cosClient = cosClient;
    }

    /**
     * 上传文件到 COS
     *
     * @return 文件访问链接(如果是公共读桶 ， 可以直接访问 ； 若是私有读 ， 需要后面另行签名或鉴权)
     */
    public String uploadFile(MultipartFile file) {
        try {
            // 1. 生成唯一文件名（防止覆盖）
            String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
            // 2. 上传文件
            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file.getInputStream(), new ObjectMetadata());
            cosClient.putObject(putObjectRequest);
            // 3. 返回文件访问 URL
            return baseUrl + "/" + fileName;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR);
        }
    }
}

