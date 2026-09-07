package com.cdacproject.eazypg.pg_property_service.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RoomDto {

    private Long id;
    private Long pgId;
    private String number;
    private String type;
    private double rent;
    private boolean available = true;

    public RoomDto() {

    }

    @JsonCreator
    public RoomDto(
            @JsonProperty("id") Long id,
            @JsonProperty("pgId")Long pgId,
            @JsonProperty("number") String number,
            @JsonProperty("type") String type,
            @JsonProperty("rent") double rent,
            @JsonProperty("available") boolean available) {
        this.id = id;
        this.pgId = pgId;
        this.number = number;
        this.type = type;
        this.rent = rent;
        this.available = available;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getRent() {
        return rent;
    }

    public void setRent(double rent) {
        this.rent = rent;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public Long getPgId() {
        return pgId;
    }

    public void setPgId(Long pgId) {
        this.pgId = pgId;
    }
}
