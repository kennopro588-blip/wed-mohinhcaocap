-- ============================================================
-- SQL DUMP FOR DATABASE: wed-mohinh / wed-mohinhcaocap
-- LUXE MODELS - Scale Models & Figures Store Database
-- Compatible with MySQL / MariaDB / phpMyAdmin
-- ============================================================

CREATE DATABASE IF NOT EXISTS `wed-mohinh` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wed-mohinh`;

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS=1;

-- ------------------------------------------------------------
-- Table structure for `categories`
-- ------------------------------------------------------------
CREATE TABLE `categories` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `item_count` INT DEFAULT 0,
  `gradient` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `item_count`, `gradient`) VALUES
('gundam', 'Gundam & Mecha', 'gundam', 'Mô hình Bandai Gunpla PG, MG, RG, Metal Build cao cấp', 48, 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'),
('figure', 'Anime & Game Figures', 'figure', 'Figure 1/4, 1/6, 1/7 từ Good Smile, Alter, Hot Toys', 63, 'linear-gradient(135deg, #2d1b69 0%, #6d3b6e 100%)'),
('diecast', 'Siêu Xe Diecast', 'diecast', 'Mô hình xe ô tô tỉ lệ 1/18, 1/24 từ Autoart, Almost Real', 35, 'linear-gradient(135deg, #1a0e00 0%, #8B6914 100%)'),
('resin', 'Tượng Resin & Diorama', 'resin', 'Statue giới hạn số lượng từ Prime 1 Studio, Tsume', 24, 'linear-gradient(135deg, #0d1117 0%, #238636 100%)');

-- ------------------------------------------------------------
-- Table structure for `products`
-- ------------------------------------------------------------
CREATE TABLE `products` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `brand` VARCHAR(100) NOT NULL,
  `price` DECIMAL(15,2) NOT NULL,
  `original_price` DECIMAL(15,2) DEFAULT NULL,
  `description` TEXT,
  `category_id` VARCHAR(50) NOT NULL,
  `subcategory` VARCHAR(50) DEFAULT NULL,
  `scale_ratio` VARCHAR(50) DEFAULT NULL,
  `manufacturer` VARCHAR(100) DEFAULT NULL,
  `material` VARCHAR(100) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `review_count` INT DEFAULT 0,
  `is_new` TINYINT(1) DEFAULT 0,
  `is_sale` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `in_stock` TINYINT(1) DEFAULT 1,
  `stock_count` INT DEFAULT 10,
  `image_url` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `products`
INSERT INTO `products` (`id`, `name`, `brand`, `price`, `original_price`, `description`, `category_id`, `subcategory`, `scale_ratio`, `manufacturer`, `material`, `rating`, `review_count`, `is_new`, `is_sale`, `is_featured`, `in_stock`, `stock_count`, `image_url`) VALUES
('1', 'PG 1/60 RX-0 Unicorn Gundam Perfect Grade LED Set', 'Bandai Spirits', 6850000.00, 7900000.00, 'Mô hình Bandai PG 1/60 RX-0 Unicorn Gundam phiên bản cao cấp tích hợp bộ đèn LED Psycho Frame phát sáng 3 chế độ.', 'gundam', 'pg', '1/60', 'Bandai Spirits', 'ABS / Diecast / LED', 4.90, 142, 0, 1, 1, 1, 8, '/images/gundam.png'),
('2', 'Figure 1/6 Iron Man Mark LXXXV Diecast Limited', 'Hot Toys', 11500000.00, NULL, 'Mô hình 1/6 Iron Man Mark LXXXV chính hãng Hot Toys với chất liệu hợp kim Diecast kim loại nặng tay, giáp sáng bóng.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Diecast Metal & PVC', 5.00, 98, 1, 0, 1, 1, 5, '/images/supercar.png'),
('3', 'Mô Hình Xe 1/18 Autoart Lamborghini Aventador SVJ Carbon', 'Autoart Models', 7800000.00, NULL, 'Mô hình tĩnh siêu xe Lamborghini Aventador SVJ tỉ lệ 1/18 chế tác thủ công bởi Autoart. Full mở cửa cắt kéo.', 'diecast', 'supercar', '1/18', 'Autoart', 'Composite & Carbon', 4.90, 176, 0, 0, 1, 1, 10, '/images/figure.png'),
('4', 'Tượng Resin Prime 1 Studio Batman Dark Knight 1/3 Statue', 'Prime 1 Studio', 32500000.00, 36000000.00, 'Tượng Resin nghệ thuật kích thước khủng 1/3 Batman The Dark Knight của Prime 1 Studio.', 'resin', 'statue', '1/3', 'Prime 1 Studio', 'Polystone Resin', 5.00, 34, 0, 1, 1, 1, 3, '/images/statue.png'),
('5', 'Figure 1/7 Alter Saber Extra Bride Fate/Grand Order', 'Alter', 5200000.00, NULL, 'Figure 1/7 Saber Extra Bride chính hãng Alter nổi tiếng với độ hoàn thiện sơn đầm tay, nếp váy cưới tung bay mềm mại.', 'figure', 'anime', '1/7', 'Alter', 'PVC / ABS', 4.80, 112, 1, 0, 0, 1, 12, '/images/gundam.png'),
('6', 'Metal Build Freedom Gundam CONCEPT 2 SNOW SPARKLE', 'Bandai Tamashii Nations', 9800000.00, NULL, 'Mô hình hoàn thiện cao cấp Metal Build Freedom Gundam Concept 2 phiên bản Snow Sparkle Ver. Khung xương đúc kim loại.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 5.00, 67, 0, 0, 1, 1, 6, '/images/supercar.png'),
('7', 'Mô Hình Tàu Titanic 1/200 Wooden Handmade Model 100cm', 'Maritime Crafts', 4900000.00, 5800000.00, 'Mô hình tàu RMS Titanic làm thủ công 100% bằng gỗ tự nhiên cao cấp tỉ lệ 1/200.', 'diecast', 'ship', '1/200', 'Maritime Crafts', 'Natural Wood & Brass', 4.70, 88, 0, 1, 0, 1, 15, '/images/figure.png'),
('8', 'Figure 1/7 Hatsune Miku Symphony 5th Anniversary', 'Good Smile Company', 6400000.00, NULL, 'Figure Hatsune Miku kỉ niệm 5 năm Symphonic Concert từ Good Smile Company.', 'figure', 'vocaloid', '1/7', 'Good Smile Company', 'PVC / ABS', 4.90, 145, 1, 0, 1, 1, 9, '/images/statue.png'),
('9', 'MG 1/100 Freedom Gundam 2.0 Titanium Finish', 'Bandai Spirits', 2850000.00, NULL, 'Mô hình Bandai MG 1/100 Freedom Gundam 2.0 phiên bản giới hạn Titanium Finish sáng bóng gương sắc nét.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS Plated', 4.80, 205, 0, 0, 0, 1, 14, '/images/gundam.png'),
('10', 'Mô Hình Xe 1/18 Almost Real Pagani Zonda R Carbon', 'Almost Real', 8900000.00, 9800000.00, 'Mô hình tĩnh Diecast 1/18 Pagani Zonda R vỏ Carbon đúc kim loại siêu cao cấp từ Almost Real.', 'diecast', 'supercar', '1/18', 'Almost Real', 'Diecast Metal', 4.90, 52, 0, 1, 0, 1, 4, '/images/supercar.png'),
('11', 'Tượng Resin Tsume Art Naruto Sage Mode 1/4 HQS+', 'Tsume Art', 24500000.00, NULL, 'Tượng sa bàn nhựa Resin Tsume Art Naruto Shippuden Sage Mode tỉ lệ 1/4 chính hãng Luxembourg.', 'resin', 'statue', '1/4', 'Tsume Art', 'Polystone Resin', 5.00, 41, 1, 0, 0, 1, 2, '/images/statue.png'),
('12', 'RG 1/144 Hi-Nu Gundam Real Grade Bandai', 'Bandai Spirits', 1450000.00, NULL, 'Mô hình Bandai RG 1/144 Hi-Nu Gundam được đánh giá là một trong những bộ Gunpla RG xuất sắc nhất lịch sử.', 'gundam', 'rg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.90, 310, 0, 0, 0, 1, 25, '/images/figure.png');

-- ------------------------------------------------------------
-- Table structure for `users`
-- ------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) NOT NULL DEFAULT 'USER',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `member_since` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping default users (ADMIN and USER roles)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `member_since`) VALUES
('Quản trị viên Luxe', 'admin@luxe.vn', 'admin123', 'ADMIN', '2024-01-01'),
('Nguyễn Văn Khoa', 'user@luxe.vn', '123456', 'USER', '2024-01-01');

-- ------------------------------------------------------------
-- Table structure for `orders`
-- ------------------------------------------------------------
CREATE TABLE `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE,
  `user_id` INT DEFAULT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(50) DEFAULT NULL,
  `district` VARCHAR(50) DEFAULT NULL,
  `payment_method` VARCHAR(20) DEFAULT 'cod',
  `total_amount` DECIMAL(15,2) NOT NULL,
  `status` VARCHAR(20) DEFAULT 'Pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Orders
INSERT INTO `orders` (`order_code`, `user_id`, `full_name`, `phone`, `email`, `address`, `city`, `district`, `payment_method`, `total_amount`, `status`) VALUES
('LX-849201', 2, 'Nguyễn Văn Khoa', '0901234567', 'user@luxe.vn', '123 Nguyễn Huệ', 'TP. Hồ Chí Minh', 'Quận 1', 'momo', 6850000.00, 'Processing'),
('LX-849202', 2, 'Trần Thị B', '0987654321', 'tranthib@gmail.com', '456 Lê Lợi', 'Đà Nẵng', 'Quận Hải Châu', 'cod', 11500000.00, 'Completed');

-- ------------------------------------------------------------
-- Table structure for `order_items`
-- ------------------------------------------------------------
CREATE TABLE `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(15,2) NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `image_url` VARCHAR(255) DEFAULT NULL,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Order Items
INSERT INTO `order_items` (`order_id`, `product_id`, `product_name`, `price`, `quantity`, `image_url`) VALUES
(1, '1', 'PG 1/60 RX-0 Unicorn Gundam Perfect Grade LED Set', 6850000.00, 1, '/images/gundam.png'),
(2, '2', 'Figure 1/6 Iron Man Mark LXXXV Diecast Limited', 11500000.00, 1, '/images/supercar.png');

-- ------------------------------------------------------------
-- Table structure for `reviews`
-- ------------------------------------------------------------
CREATE TABLE `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `user_name` VARCHAR(100) NOT NULL,
  `rating` INT NOT NULL DEFAULT 5,
  `comment` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reviews` (`product_id`, `user_name`, `rating`, `comment`) VALUES
('1', 'Nguyễn Văn Khoa', 5, 'Mô hình quá sắc nét, bộ đèn LED sáng lung linh rất xứng đáng giá tiền!'),
('2', 'Trần Thị B', 5, 'Sản phẩm Hot Toys chính hãng cầm rất đầm tay, đóng gói cẩn thận.');
