package com._tune.imke.portfolio.service.impl;

import com._tune.imke.portfolio.entities.Stock;
import com._tune.imke.portfolio.entities.Trade;
import com._tune.imke.portfolio.entities.TransactionHistory;
import com._tune.imke.portfolio.repo.StockRepo;
import com._tune.imke.portfolio.repo.TransactionRepo;
import com._tune.imke.portfolio.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionImpl implements TransactionService {

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private StockRepo stockRepo;

    @Override
    public void recordTransaction(String symbol, Trade trade, Long qty, Double price) {
        System.out.println("Inside recordTransaciton: " + symbol + "," + trade + "," + qty + "," + price );
        TransactionHistory record = new TransactionHistory(symbol, trade, qty,price);
        transactionRepo.save(record);
    }

    @Override
    public List<TransactionHistory> getAllTransactions(){
        System.out.println("Inside getAllTransactions ");
        List<TransactionHistory> transactions = transactionRepo.findAll();
        Collections.reverse(transactions);
        return transactions;
    }

    @Override
    public List<Double> getInvestments(){
        System.out.println("Inside getInvestments");
//        List<TransactionHistory> buyTransactions = transactionRepo.findByTrade(Trade.BUY);
        List<Stock> buyTransactions = stockRepo.findAll();
        List<TransactionHistory> sellTransactions = transactionRepo.findByTrade(Trade.SELL);
        double totalBuyInvestment = buyTransactions.stream()
                .mapToDouble(Stock::getInvestedAmt) // Extract total from each transaction
                .sum();
        double totalSellInvestment = sellTransactions.stream()
                .mapToDouble(TransactionHistory::getTotal) // Extract total from each transaction
                .sum();
        List<Double> values = new ArrayList<>();
        values.add(totalBuyInvestment);
        values.add(totalSellInvestment);
        return values;
    }
}
