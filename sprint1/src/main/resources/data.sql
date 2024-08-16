INSERT INTO stock (symbol, name, invested_amt, quantity , revenue) VALUES
  ('AAPL', 'Apple Inc.', 100, 1, 100);
--   ('MSFT', 'Microsoft Corporation', 300.75, 6, 501.50),
--   ('AMZN', 'Amazon.com Inc.', 350.00, 7, 0);

INSERT INTO transaction_history (transaction_id,price, quantity, stock_symbol, time_stamp, total, trade)
VALUES
  (1,100, 1, 'AAPL', '22-10-2023 12:34:56', 100.00, 'BUY');
--   (2,300.75, 8, 'MSFT', '2023-11-25 11:40:51', 2406.00, 'BUY'),
--   (3,200.25, 5, 'AAPL', '2023-12-05 15:23:40', 1001.25, 'SELL'),
--   (4,350.00, 7, 'AMZN', '2024-02-15 17:12:09', 2450.00, 'BUY'),
--   (5,250.75, 2, 'MSFT', '2024-03-20 11:30:21', 501.50, 'SELL');
