package com.cdacproject.eazypg.pg_booking_service.sf_bookingmanagement.dto;

public class RoomResponseDto {
    private Long id;
    private Long pgId;
    private String number;
    private String type;
    private double rent;
    private boolean available;
    private String imageUrl;

    public RoomResponseDto() {}

    public RoomResponseDto(Long id, Long pgId, String number, String type, double rent, boolean available, String imageUrl) {
        this.id = id;
        this.pgId = pgId;
        this.number = number;
        this.type = type;
        this.rent = rent;
        this.available = available;
        this.imageUrl = imageUrl;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getPgId() {
        return pgId;
    }

    public void setPgId(Long pgId) {
        this.pgId = pgId;
    }
}