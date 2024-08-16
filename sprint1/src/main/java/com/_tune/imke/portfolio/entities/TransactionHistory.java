package com._tune.imke.portfolio.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long transactionId;

    @NonNull
    private String timeStamp;

    @NonNull
    private String stockSymbol;

    @Enumerated(EnumType.STRING)
    @Column(name="trade")
    @NonNull
    private Trade trade; // buy or sell

    @NonNull
    private Long quantity;

    @NonNull
    private Double price; //  tp at the time of transaction of each share

    @NonNull
    private Double total; // total money invested/revenue

    public TransactionHistory(@NonNull String stockSymbol, @NonNull Trade trade, @NonNull Long quantity, @NonNull Double price) {
        this.stockSymbol = stockSymbol;
        this.trade = trade;
        this.quantity = quantity;
        this.price = price;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        this.timeStamp = LocalDateTime.now().format(formatter);
        this.total = quantity*price;
    }

    @Override
    public String toString() {
        return "TransactionHistory{" +
                "transactionId=" + transactionId +
                ", timeStamp=" + timeStamp +
                ", stockSymbol='" + stockSymbol + '\'' +
                ", trade=" + trade +
                ", quantity=" + quantity +
                ", price=" + price +
                ", total=" + total +
                '}';
    }
}
