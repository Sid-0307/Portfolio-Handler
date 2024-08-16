package com._tune.imke.portfolio.controller;
import com._tune.imke.portfolio.entities.Stock;
import com._tune.imke.portfolio.service.impl.StockServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/")
@RestController
@CrossOrigin
public class StockController {

    @Autowired
    private StockServiceImpl stockServiceImpl;

    @GetMapping("/myHoldings")
    public ResponseEntity<List<Stock>> myHolding(){
        List<Stock> response = stockServiceImpl.getAllStock();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/sell")
    public ResponseEntity<Stock>  sellStock(@RequestBody Stock s) {
        Stock soldStock = stockServiceImpl.sellStock(s);
        if(soldStock.getQuantity()==0){
            stockServiceImpl.deleteStock(soldStock);
        }
        return new ResponseEntity<>(soldStock,HttpStatus.OK);
    }

    @PostMapping("/buy")
    public ResponseEntity<Stock> buyStock(@RequestBody Stock s) {
        Stock boughtStock = stockServiceImpl.buyStock(s);
        if(!s.getQuantity().equals(boughtStock.getQuantity()))
            return new ResponseEntity<>(boughtStock,HttpStatus.OK);
        return new ResponseEntity<>(boughtStock,HttpStatus.CREATED);
    }

//    @GetMapping("/stockvalue")
//    public ResponseEntity<Double> getStockValue(){
//        Double response = stockServiceImpl.getStockValue();
//        return  new ResponseEntity<>(response, HttpStatus.OK);
//
//    }


}
