package com.cdacproject.eazypg.pg_property_service.mapper;

import org.mapstruct.Context;
import org.mapstruct.Named;
import org.springframework.stereotype.Component;

@Component
public class ImageUrlMapper {

    @Named("buildImageUrl")
    public String buildImageUrl(String filename, @Context String gatewayUrl) {
        if (filename == null || filename.isEmpty()) return null;
        return gatewayUrl + "/api/images/" + filename;
    }
}
