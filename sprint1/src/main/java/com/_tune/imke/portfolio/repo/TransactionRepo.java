package com._tune.imke.portfolio.repo;

import com._tune.imke.portfolio.entities.Trade;
import com._tune.imke.portfolio.entities.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TransactionRepo extends JpaRepository<TransactionHistory,Long> {

    List<TransactionHistory> findByTrade(Trade trade);
}
