package com._tune.imke.portfolio.service.impl;

import com._tune.imke.portfolio.entities.Stock;
import com._tune.imke.portfolio.entities.Trade;
import com._tune.imke.portfolio.exception.NotEnoughStockException;
import com._tune.imke.portfolio.repo.StockRepo;
import com._tune.imke.portfolio.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepo stockRepo;


    @Autowired
    private TransactionImpl transaction;

//    @Override
//    public Double getLtp(String symbol) {
//        return 100.0;
//    }

    @Override
    public Stock buyStock(Stock newStock) {
        System.out.println("Inside buyStock: " + newStock);
        transaction.recordTransaction(newStock.getSymbol(), Trade.BUY,newStock.getQuantity(), newStock.getPrice());
        Stock oldStock = stockRepo.findById(newStock.getSymbol()).orElse(null);
        if(oldStock == null ){
            newStock.setInvestedAmt((newStock.getQuantity()* newStock.getPrice()));
            stockRepo.save(newStock);
            return newStock;
        }
        else{
            oldStock.setQuantity(oldStock.getQuantity()+newStock.getQuantity());
            oldStock.setInvestedAmt(oldStock.getInvestedAmt()+(newStock.getQuantity()* newStock.getPrice()));
            stockRepo.save(oldStock);
            return oldStock;
        }
    }

    @Override
    public Stock sellStock(Stock sellStock) {
        System.out.println("Inside sellStock: " + sellStock);
        Stock stock = stockRepo.findById(sellStock.getSymbol()).orElseThrow(() -> new NoSuchElementException("Stock not under your holdings!"));
        if(stock.getQuantity()<sellStock.getQuantity()){
            throw new NotEnoughStockException("Selling Stocks more than holding is not accepted ");
        }
        stock.setInvestedAmt(stock.getInvestedAmt()-(stock.getInvestedAmt()*sellStock.getQuantity()/stock.getQuantity()));
        stock.setQuantity(stock.getQuantity() - sellStock.getQuantity());
        stock.setRevenue(stock.getRevenue()+(sellStock.getQuantity()*sellStock.getPrice()));
        stockRepo.save(stock);
        transaction.recordTransaction(sellStock.getSymbol(), Trade.SELL,sellStock.getQuantity(),sellStock.getPrice());
        return stock;
    }

    @Override
    public void deleteStock(Stock stock){
        System.out.println("Inside deleteStock: " + stock);
        Stock s = stockRepo.findById(stock.getSymbol())
                .orElseThrow(() ->
                        new NoSuchElementException("Stock not under your holdings!")
                );
        stockRepo.delete(s);
    }

    @Override
    public List<Stock> getAllStock(){
        System.out.println("Inside displayStock");
        return stockRepo.findAll();
    }

//    @Override
//    public Double getStockValue(){
//        System.out.println("Inside getStockValue");
//        List<Stock> stocks = stockRepo.findAll();
//        Double value = stocks.stream()
//                .mapToDouble(stock -> stock.getQuantity() * this.getLtp(stock.getSymbol()))
//                .sum();
//        return value;
//    }
}
