package com._tune.imke.portfolio.service;

import com._tune.imke.portfolio.entities.Trade;
import com._tune.imke.portfolio.entities.TransactionHistory;

import java.util.List;

public interface TransactionService {

    void recordTransaction(String symbol, Trade trade, Long qty, Double price);
    List<TransactionHistory> getAllTransactions();
    List<Double> getInvestments();
}
