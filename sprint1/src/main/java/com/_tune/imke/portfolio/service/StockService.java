package com._tune.imke.portfolio.service;

import com._tune.imke.portfolio.entities.Stock;
import com._tune.imke.portfolio.repo.StockRepo;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public interface StockService {

//    public Double getLtp(String symbol);
    public Stock buyStock(Stock newStock);
    public Stock sellStock(Stock sellStock);
    public void deleteStock(Stock stock);
    public List<Stock> getAllStock();
//    public Double getStockValue();
}
