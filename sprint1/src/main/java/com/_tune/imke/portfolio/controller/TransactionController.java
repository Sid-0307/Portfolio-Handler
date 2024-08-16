package com._tune.imke.portfolio.controller;

import com._tune.imke.portfolio.entities.TransactionHistory;
import com._tune.imke.portfolio.service.impl.TransactionImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/api/")
@RestController
@CrossOrigin
public class TransactionController {

    @Autowired
    private TransactionImpl transactionImpl;

    @GetMapping("/myTransactions")
    public ResponseEntity<List<TransactionHistory>> myTransactions(){
        List<TransactionHistory> response = transactionImpl.getAllTransactions();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/myInvestments")
    public ResponseEntity<List<Double>> myInvestments(){
        List<Double> response = transactionImpl.getInvestments();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


}
