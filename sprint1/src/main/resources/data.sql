INSERT IGNORE INTO stock (symbol, name, invested_amt, quantity , revenue) VALUES
  ('AAPL', 'Apple Inc.', 100, 1, 100);

INSERT IGNORE INTO transaction_history (transaction_id,price, quantity, stock_symbol, time_stamp, total, trade)
VALUES
  (1,100, 1, 'AAPL', '22-10-2023 12:34:56', 100.00, 'BUY');
