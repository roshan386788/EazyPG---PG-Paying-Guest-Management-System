package com.cdacproject.eazypg.pg_property_service.mapper;

import com.cdacproject.eazypg.pg_property_service.dto.RoomDto;
import com.cdacproject.eazypg.pg_property_service.dto.RoomResponseDto;
import com.cdacproject.eazypg.pg_property_service.model.Room;
import org.mapstruct.*;

@Mapper(componentModel = "spring", uses = ImageUrlMapper.class)
public interface RoomMapper {

    @Mapping(target = "imageUrl", source = "imageUrl", qualifiedByName = "buildImageUrl")
    @Mapping(target = "pgId", source = "pg.id")
    RoomResponseDto toResponseDto(Room room, @Context String gatewayUrl);

    @Mapping(target = "pg", source = "pgId")  // Tells MapStruct to use the mapPgId method
    Room toEntity(RoomDto dto);

    // Custom mapping from pgId → PG
    default com.cdacproject.eazypg.pg_property_service.model.PG mapPgId(Long pgId) {
        if (pgId == null) return null;
        com.cdacproject.eazypg.pg_property_service.model.PG pg = new com.cdacproject.eazypg.pg_property_service.model.PG();
        pg.setId(pgId);
        return pg;
    }
}



