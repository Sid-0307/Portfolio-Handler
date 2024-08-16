package com._tune.imke.portfolio.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.*;
import org.springframework.boot.context.properties.bind.DefaultValue;
import org.springframework.lang.NonNull;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class Stock {

    @Id
    private String symbol;

    @NonNull
    private String name;

    @NonNull
    private Long quantity;

    @NonNull
    @Transient
    private Double price;

    private Double investedAmt;

    private Double revenue=0.0;

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setName(@NonNull String name) {
        this.name = name;
    }

    public void setQuantity(@NonNull Long quantity) {
        this.quantity = quantity;
    }

    public void setPrice(@NonNull Double price) {
        this.price = price;
    }

    public void setInvestedAmt(@NonNull Double investedAmt) {
        this.investedAmt = investedAmt;
    }

    public void setRevenue(@NonNull Double revenue) {
        this.revenue = revenue;
    }

    public Stock(String symbol, String name, Long quantity, Double price) {
        this.symbol = symbol;
        this.name = name;
        this.quantity = quantity;
        this.price = price;
        this.investedAmt = price * quantity;
    }

    public String getSymbol() {
        return symbol;
    }

    @NonNull
    public String getName() {
        return name;
    }

    @NonNull
    public Long getQuantity() {
        return quantity;
    }

    @NonNull
    public Double getPrice() {
        return price;
    }

    @NonNull
    public Double getInvestedAmt() {
        return investedAmt;
    }

    @NonNull
    public Double getRevenue() {
        return revenue;
    }
}
