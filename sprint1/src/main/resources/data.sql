INSERT INTO stock (symbol, name, invested_amt, quantity , revenue) VALUES
  ('AAPL', 'Apple Inc.', 100, 1, 100)
WHERE NOT EXISTS (SELECT * FROM stock WHERE symbol = 'AAPL');

INSERT INTO transaction_history (transaction_id,price, quantity, stock_symbol, time_stamp, total, trade)
VALUES
  (1,100, 1, 'AAPL', '22-10-2023 12:34:56', 100.00, 'BUY')
WHERE NOT EXISTS (SELECT * FROM transaction_history WHERE transaction_id = 1);
