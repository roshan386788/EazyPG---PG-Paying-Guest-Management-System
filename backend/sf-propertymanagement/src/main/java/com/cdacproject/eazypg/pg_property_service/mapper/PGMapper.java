package com.cdacproject.eazypg.pg_property_service.mapper;

import com.cdacproject.eazypg.pg_property_service.dto.PGDto;
import com.cdacproject.eazypg.pg_property_service.dto.PGResponseDto;
import com.cdacproject.eazypg.pg_property_service.model.PG;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = {RoomMapper.class, ImageUrlMapper.class})
public interface PGMapper {

    @Mapping(target = "imageUrl", source = "imageUrl", qualifiedByName = "buildImageUrl")
    @Mapping(target = "rooms", source = "rooms")
    @Mapping(target = "latitude", source = "latitude")
    @Mapping(target = "longitude", source = "longitude")

    PGResponseDto toResponseDto(PG pg, @Context String gatewayUrl);

    PG toEntity(PGDto dto);
}
