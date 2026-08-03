-- ============================================================
-- SQL DUMP FOR DATABASE: wed-mohinhcaocap & wed-mohinh
-- LUXE MODELS - Scale Models & Figures Store Database
-- Compatible with MySQL / MariaDB / phpMyAdmin / XAMPP
-- ============================================================

CREATE DATABASE IF NOT EXISTS `wed-mohinhcaocap` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `wed-mohinhcaocap`;

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
('12', 'RG 1/144 Hi-Nu Gundam Real Grade Bandai', 'Bandai Spirits', 1450000.00, NULL, 'Mô hình Bandai RG 1/144 Hi-Nu Gundam được đánh giá là một trong những bộ Gunpla RG xuất sắc nhất lịch sử.', 'gundam', 'rg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.90, 310, 0, 0, 0, 1, 25, '/images/figure.png'),

-- ============================================================
-- GUNDAM & MECHA (30 sản phẩm mới, id g01 - g30)
-- ============================================================
('g01', 'MG 1/100 Wing Gundam Zero EW Ver.Ka', 'Bandai Spirits', 1850000.00, NULL, 'Mô hình Master Grade 1/100 Wing Gundam Zero Custom phiên bản Katoki Hajime thiết kế lại.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.90, 188, 0, 0, 1, 1, 12, '/images/gundam.png'),
('g02', 'PG 1/60 Astray Red Frame', 'Bandai Spirits', 5200000.00, 5800000.00, 'Perfect Grade Astray Red Frame với khung diecast nội thất chi tiết, kèm thanh kiếm Gerbera Straight.', 'gundam', 'pg', '1/60', 'Bandai Spirits', 'ABS / Diecast', 4.80, 76, 0, 1, 0, 1, 6, '/images/gundam.png'),
('g03', 'RG 1/144 Evangelion Unit-01 Test Type', 'Bandai Spirits', 1250000.00, NULL, 'Real Grade 1/144 Neon Genesis Evangelion Unit 01, khớp cực mịn màng.', 'gundam', 'rg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.85, 241, 1, 0, 1, 1, 20, '/images/gundam.png'),
('g04', 'Metal Build Destiny Gundam Soul Red', 'Bandai Tamashii Nations', 10500000.00, 11800000.00, 'Dòng Metal Build Destiny Gundam phiên bản Soul Red với khung hợp kim toàn phần, wing effect parts.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 5.00, 55, 0, 1, 1, 1, 4, '/images/gundam.png'),
('g05', 'MG 1/100 Sazabi Ver.Ka', 'Bandai Spirits', 3200000.00, NULL, 'Masterpiece MG Ver.Ka của Sazabi với nội thất cabin Char Aznable chi tiết, màu đỏ rực rỡ.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.95, 320, 0, 0, 1, 1, 8, '/images/gundam.png'),
('g06', 'HG 1/144 Gundam Aerial Gundam Witch from Mercury', 'Bandai Spirits', 420000.00, NULL, 'High Grade Aerial Gundam từ series The Witch from Mercury, màu trắng xanh thanh lịch.', 'gundam', 'hg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.70, 512, 1, 0, 0, 1, 50, '/images/gundam.png'),
('g07', 'MG 1/100 Nu Gundam Ver.Ka', 'Bandai Spirits', 3800000.00, 4200000.00, 'Bản Ver.Ka của Nu Gundam với toàn bộ Fin Funnel di động, bề mặt waverider.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.90, 260, 0, 1, 1, 1, 7, '/images/gundam.png'),
('g08', 'PG 1/60 Strike Gundam Aile Strike Ver.', 'Bandai Spirits', 4800000.00, NULL, 'Perfect Grade Strike Gundam kèm Pack Aile Strike, khung nội thất cockpit đầy đủ.', 'gundam', 'pg', '1/60', 'Bandai Spirits', 'ABS / Diecast', 4.85, 110, 0, 0, 0, 1, 5, '/images/gundam.png'),
('g09', 'Metal Build Crossbone Gundam X1', 'Bandai Tamashii Nations', 9200000.00, NULL, 'Metal Build Crossbone Gundam X-1 skull face, khung hợp kim với skull deco.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 5.00, 42, 1, 0, 1, 1, 3, '/images/gundam.png'),
('g10', 'RG 1/144 Aile Strike Gundam', 'Bandai Spirits', 980000.00, 1100000.00, 'Real Grade Aile Strike Gundam với internal frame chi tiết, wing pack lắp rời.', 'gundam', 'rg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.75, 390, 0, 1, 0, 1, 30, '/images/gundam.png'),
('g11', 'MG 1/100 Gundam Barbatos Lupus Rex', 'Bandai Spirits', 2200000.00, NULL, 'Master Grade Barbatos Lupus Rex từ Iron-Blooded Orphans với chuỗi đuôi scorpion.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.80, 175, 1, 0, 0, 1, 15, '/images/gundam.png'),
('g12', 'HG 1/144 Gundam Caliburn Witch from Mercury', 'Bandai Spirits', 480000.00, NULL, 'High Grade Gundam Caliburn, hình thái cuối của Aerial trong Witch from Mercury.', 'gundam', 'hg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.60, 288, 1, 0, 0, 1, 35, '/images/gundam.png'),
('g13', 'Metal Build Gundam Exia R2 Repair II', 'Bandai Tamashii Nations', 8900000.00, 9600000.00, 'Metal Build Exia với damaged effects phần bao tay và áo giáp, siêu giới hạn.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 5.00, 38, 0, 1, 1, 1, 2, '/images/gundam.png'),
('g14', 'MG 1/100 Justice Gundam', 'Bandai Spirits', 1950000.00, NULL, 'Master Grade Justice Gundam với METEOR pack tháo lắp được, màu tím bắt mắt.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.70, 143, 0, 0, 0, 1, 11, '/images/gundam.png'),
('g15', 'PG 1/60 00 Raiser GN Sword III', 'Bandai Spirits', 5900000.00, 6500000.00, 'Perfect Grade 00 Raiser kèm 0-Raiser, bộ GN Drive phát sáng LED.', 'gundam', 'pg', '1/60', 'Bandai Spirits', 'ABS / LED', 4.90, 95, 0, 1, 1, 1, 4, '/images/gundam.png'),
('g16', 'RG 1/144 Sinanju Stein Narrative Ver.', 'Bandai Spirits', 1380000.00, NULL, 'Real Grade Sinanju Stein phiên bản Narrative với màu trắng xanh navy sang trọng.', 'gundam', 'rg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.80, 197, 1, 0, 0, 1, 18, '/images/gundam.png'),
('g17', 'MG 1/100 Zeta Gundam Ver.Ka Titanium', 'Bandai Spirits', 4100000.00, NULL, 'MG Zeta Gundam Ver.Ka phiên bản Titanium Finish, biến hình Wave Rider hoàn chỉnh.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS Plated', 4.85, 82, 0, 0, 1, 1, 6, '/images/gundam.png'),
('g18', 'HG 1/144 Lfrith Ur Witch from Mercury', 'Bandai Spirits', 390000.00, 450000.00, 'High Grade Lfrith Ur, Gundam đối thủ trong Witch from Mercury, màu đen tím ấn tượng.', 'gundam', 'hg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.55, 178, 0, 1, 0, 1, 40, '/images/gundam.png'),
('g19', 'Metal Build Gundam Dynames Repair III', 'Bandai Tamashii Nations', 11200000.00, NULL, 'Metal Build Dynames Repair III phiên bản đặc biệt với súng bắn tỉa GN Sniper Rifle.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 5.00, 29, 1, 0, 1, 1, 2, '/images/gundam.png'),
('g20', 'MG 1/100 Deathscythe Hell EW', 'Bandai Spirits', 2100000.00, 2400000.00, 'MG Deathscythe Hell Custom EW với đôi cánh Active Cloak hở rộng ấn tượng.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.80, 215, 0, 1, 0, 1, 9, '/images/gundam.png'),
('g21', 'PG 1/60 Millennium Falcon Star Wars', 'Bandai Spirits', 7800000.00, NULL, 'Perfect Grade Millennium Falcon Star Wars phiên bản Bandai bản quyền, chi tiết nội thất đầy đủ.', 'gundam', 'pg', '1/60', 'Bandai Spirits', 'ABS / LED', 4.90, 67, 0, 0, 1, 1, 3, '/images/gundam.png'),
('g22', 'RG 1/144 MSN-06S Sinanju', 'Bandai Spirits', 1650000.00, NULL, 'Real Grade Sinanju đỏ huyền thoại với nội thất frame chi tiết ấn tượng.', 'gundam', 'rg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.90, 298, 0, 0, 1, 1, 14, '/images/gundam.png'),
('g23', 'Metal Build Gundam Virtue Nadleeh', 'Bandai Tamashii Nations', 9800000.00, 10500000.00, 'Metal Build Gundam Virtue có thể tháo rời thành Gundam Nadleeh bên trong.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 5.00, 33, 0, 1, 0, 1, 3, '/images/gundam.png'),
('g24', 'MG 1/100 Turn A Gundam', 'Bandai Spirits', 2800000.00, NULL, 'MG Turn A Gundam với thiết kế moustache độc đáo, Moon Light Butterfly effect parts.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.75, 126, 0, 0, 0, 1, 8, '/images/gundam.png'),
('g25', 'HG 1/144 Gundam Age FX', 'Bandai Spirits', 350000.00, NULL, 'High Grade Gundam AGE-FX với burst mode hiệu ứng cánh sáng, màu xanh trắng.', 'gundam', 'hg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.50, 135, 0, 0, 0, 1, 25, '/images/gundam.png'),
('g26', 'Metal Build Gundam AGE-2 Dark Hound', 'Bandai Tamashii Nations', 8200000.00, NULL, 'Metal Build AGE-2 Dark Hound, chiếc Gundam cướp biển màu đen bạc đặc sắc.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 4.90, 27, 1, 0, 0, 1, 2, '/images/gundam.png'),
('g27', 'RG 1/144 Build Strike Gundam Full Package', 'Bandai Spirits', 1100000.00, 1250000.00, 'Real Grade Build Strike Full Package phiên bản Build Fighters, kèm Build Booster.', 'gundam', 'rg', '1/144', 'Bandai Spirits', 'PS / ABS', 4.70, 205, 0, 1, 0, 1, 20, '/images/gundam.png'),
('g28', 'MG 1/100 God Gundam Master Asia Set', 'Bandai Spirits', 3400000.00, NULL, 'MG God Gundam kèm nhân vật Master Asia, 2 mô hình trong 1 box Shuffle Alliance set.', 'gundam', 'mg', '1/100', 'Bandai Spirits', 'PS / ABS', 4.85, 98, 0, 0, 1, 1, 5, '/images/gundam.png'),
('g29', 'PG 1/60 Banshee Gundam Norn', 'Bandai Spirits', 7200000.00, 8000000.00, 'Perfect Grade Banshee Gundam Norn với Armed Armor DE và XC, LED Psycho Frame tím.', 'gundam', 'pg', '1/60', 'Bandai Spirits', 'ABS / Diecast / LED', 4.95, 88, 0, 1, 1, 1, 5, '/images/gundam.png'),
('g30', 'Metal Build Nu Gundam Bust Complete Works', 'Bandai Tamashii Nations', 13500000.00, NULL, 'Metal Build Nu Gundam phiên bản giới hạn với toàn bộ 6 Fin Funnel, bàn tay đa dạng.', 'gundam', 'metalbuild', '1/100', 'Tamashii Nations', 'Diecast / ABS', 5.00, 19, 1, 0, 1, 1, 1, '/images/gundam.png'),

-- ============================================================
-- ANIME & GAME FIGURES (30 sản phẩm mới, id f01 - f30)
-- ============================================================
('f01', 'Figure 1/7 Asuna Yuuki Wedding Ver. Sword Art Online', 'Good Smile Company', 5800000.00, NULL, 'Figure 1/7 Asuna Yuuki váy cưới trắng từ SAO chính hãng Good Smile Company.', 'figure', 'anime', '1/7', 'Good Smile Company', 'PVC / ABS', 4.90, 156, 1, 0, 1, 1, 10, '/images/figure.png'),
('f02', 'Figure 1/4 Rem Sleeping Ver. Re:Zero', 'Kadokawa', 7200000.00, 8000000.00, 'Figure khổng lồ 1/4 Rem đang ngủ trên giường từ Re:Zero chính hãng Kadokawa.', 'figure', 'anime', '1/4', 'Kadokawa', 'PVC / ABS', 4.85, 112, 0, 1, 1, 1, 6, '/images/figure.png'),
('f03', 'Nendoroid 2049 Loid Forger Spy x Family', 'Good Smile Company', 980000.00, NULL, 'Nendoroid Loid Forger với 3 face plates biểu cảm khác nhau, dụng cụ gián điệp.', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.80, 234, 1, 0, 0, 1, 25, '/images/figure.png'),
('f04', 'Figure 1/6 Spider-Man No Way Home Hot Toys', 'Hot Toys', 12800000.00, NULL, 'Hot Toys 1/6 Spider-Man Upgraded Suit từ No Way Home với 32 điểm khớp.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Diecast / Fabric', 5.00, 87, 0, 0, 1, 1, 4, '/images/figure.png'),
('f05', 'Figure 1/7 Megumin Explosion Ver. KonoSuba', 'Alter', 4900000.00, 5400000.00, 'Figure 1/7 Megumin tư thế thi phép Explosion ấn tượng từ KonoSuba chính hãng Alter.', 'figure', 'anime', '1/7', 'Alter', 'PVC / ABS', 4.85, 143, 0, 1, 0, 1, 8, '/images/figure.png'),
('f06', 'Nendoroid 1895 Nezuko Kamado Demon Slayer', 'Good Smile Company', 890000.00, NULL, 'Nendoroid Nezuko trong hộp tre chibi siêu cute, kèm bamboo muzzle.', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.85, 315, 0, 0, 1, 1, 30, '/images/figure.png'),
('f07', 'Figure 1/7 Zero Two Pilot Suit DARLING in the FRANXX', 'Good Smile Company', 5600000.00, NULL, 'Zero Two trong bộ pilot suit ôm body đỏ đặc trưng, tỉ lệ 1/7 siêu chi tiết.', 'figure', 'anime', '1/7', 'Good Smile Company', 'PVC / ABS', 4.90, 198, 0, 0, 1, 1, 7, '/images/figure.png'),
('f08', 'Figure 1/6 Thor Endgame Hot Toys', 'Hot Toys', 13500000.00, 14800000.00, 'Hot Toys 1/6 Thor Avengers Endgame bụng fat Thor siêu hài hước, với Stormbreaker và Mjolnir.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Diecast / Fabric', 5.00, 62, 0, 1, 1, 1, 3, '/images/figure.png'),
('f09', 'Figure 1/7 Darkness Darkness! KonoSuba Alter', 'Alter', 5100000.00, NULL, 'Figure 1/7 Darkness trong áo giáp hiệp sĩ bạc, biểu cảm masochist đặc trưng từ Alter.', 'figure', 'anime', '1/7', 'Alter', 'PVC / ABS', 4.80, 128, 1, 0, 0, 1, 9, '/images/figure.png'),
('f10', 'Nendoroid 2156 Tanjiro Kamado Demon Slayer', 'Good Smile Company', 920000.00, 1050000.00, 'Nendoroid Tanjiro Kamado với Water Breathing effect parts và Hinokami Kagura.', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.80, 278, 0, 1, 0, 1, 28, '/images/figure.png'),
('f11', 'Figure 1/4 Hatsune Miku NT Magical Mirai 2022', 'Good Smile Company', 9800000.00, NULL, 'Figure 1/4 Hatsune Miku Magical Mirai 2022, trang phục concert ấn tượng.', 'figure', 'vocaloid', '1/4', 'Good Smile Company', 'PVC / ABS', 5.00, 89, 1, 0, 1, 1, 5, '/images/figure.png'),
('f12', 'Figure 1/6 Thanos Infinity Gauntlet Hot Toys', 'Hot Toys', 14200000.00, NULL, 'Hot Toys 1/6 Thanos Endgame version với Infinity Gauntlet 6 viên đá, cape vải thật.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Diecast / Fabric', 5.00, 74, 0, 0, 1, 1, 3, '/images/figure.png'),
('f13', 'Figure 1/7 Makima Chainsaw Man ArtFX J', 'Kotobukiya', 4600000.00, 5100000.00, 'Figure 1/7 Makima Chainsaw Man từ Kotobukiya, áo vest tối màu quyến rũ.', 'figure', 'anime', '1/7', 'Kotobukiya', 'PVC / ABS', 4.85, 201, 0, 1, 1, 1, 10, '/images/figure.png'),
('f14', 'Nendoroid 2089 Power Chainsaw Man', 'Good Smile Company', 950000.00, NULL, 'Nendoroid Power Chainsaw Man với Blood manipulation effect chibi siêu dễ thương.', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.75, 245, 1, 0, 0, 1, 22, '/images/figure.png'),
('f15', 'Figure 1/7 Aqua Swimsuit Ver. KonoSuba', 'Alter', 4800000.00, NULL, 'Figure 1/7 Aqua KonoSuba trong bộ đồ bơi xanh đặc trưng, chân dài sáng bóng.', 'figure', 'anime', '1/7', 'Alter', 'PVC / ABS', 4.80, 162, 0, 0, 0, 1, 8, '/images/figure.png'),
('f16', 'Figure 1/6 Black Widow Hawkeye Hot Toys', 'Hot Toys', 11800000.00, 12900000.00, 'Hot Toys 1/6 Black Widow phiên bản Avengers Endgame với hair roots tóc thật.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Silicone / Fabric', 4.95, 58, 0, 1, 0, 1, 4, '/images/figure.png'),
('f17', 'Figure 1/7 Yor Forger Spy x Family ArtFX', 'Kotobukiya', 4200000.00, NULL, 'Figure 1/7 Yor Forger Thorn Princess trong trang phục đen đỏ ấn tượng.', 'figure', 'anime', '1/7', 'Kotobukiya', 'PVC / ABS', 4.85, 188, 1, 0, 1, 1, 12, '/images/figure.png'),
('f18', 'Nendoroid 2011 Anya Forger Spy x Family', 'Good Smile Company', 890000.00, 980000.00, 'Nendoroid Anya Forger siêu dễ thương với hà mặt funny biểu cảm, waku waku!', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.90, 401, 0, 1, 1, 1, 35, '/images/figure.png'),
('f19', 'Figure 1/7 Jinx Arcane League of Legends Kotobukiya', 'Kotobukiya', 5300000.00, NULL, 'Figure 1/7 Jinx từ series Arcane, tư thế cầm súng Pow-Pow siêu ngầu.', 'figure', 'game', '1/7', 'Kotobukiya', 'PVC / ABS', 4.90, 176, 1, 0, 1, 1, 8, '/images/figure.png'),
('f20', 'Figure 1/6 Batman Tactical Throne Hot Toys', 'Hot Toys', 15800000.00, NULL, 'Hot Toys 1/6 Batman ngồi ngai vàng từ Batman v Superman, cape vải thật dài.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Diecast / Fabric', 5.00, 43, 0, 0, 1, 1, 2, '/images/figure.png'),
('f21', 'Figure 1/7 Ram Maid Outfit Re:Zero Alter', 'Alter', 4700000.00, 5200000.00, 'Figure 1/7 Ram chị gái tóc hồng trong đồng phục hầu gái Roswaal Mansion.', 'figure', 'anime', '1/7', 'Alter', 'PVC / ABS', 4.80, 134, 0, 1, 0, 1, 9, '/images/figure.png'),
('f22', 'Nendoroid 2134 Levi Ackerman Attack on Titan', 'Good Smile Company', 920000.00, NULL, 'Nendoroid Levi Ackerman chibi với ODM Gear, biểu cảm lạnh lùng đặc trưng.', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.85, 319, 0, 0, 0, 1, 28, '/images/figure.png'),
('f23', 'Figure 1/7 Vi Arcane League of Legends', 'Kotobukiya', 5100000.00, NULL, 'Figure 1/7 Vi từ series Arcane với đôi bao tay Hextech khổng lồ đặc trưng.', 'figure', 'game', '1/7', 'Kotobukiya', 'PVC / ABS', 4.85, 158, 1, 0, 0, 1, 7, '/images/figure.png'),
('f24', 'Figure 1/6 Gal Gadot Wonder Woman Hot Toys', 'Hot Toys', 12200000.00, 13500000.00, 'Hot Toys 1/6 Wonder Woman 1984 với giáp golden eagle armor lấp lánh.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Diecast / Fabric', 5.00, 66, 0, 1, 1, 1, 4, '/images/figure.png'),
('f25', 'Figure 1/7 Miku Racing Ver. 2023 GSC', 'Good Smile Company', 5500000.00, NULL, 'Hatsune Miku Racing 2023 costume siêu đẹp, kỉ niệm dòng Miku Racing GSC.', 'figure', 'vocaloid', '1/7', 'Good Smile Company', 'PVC / ABS', 4.90, 122, 1, 0, 1, 1, 6, '/images/figure.png'),
('f26', 'Nendoroid 2201 Gojo Satoru Jujutsu Kaisen', 'Good Smile Company', 960000.00, 1100000.00, 'Nendoroid Gojo Satoru với blindfold và Infinity effect parts, siêu cool.', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.90, 367, 0, 1, 1, 1, 30, '/images/figure.png'),
('f27', 'Figure 1/7 Albedo Overlord Lingerie Ver.', 'Kotobukiya', 5800000.00, NULL, 'Figure 1/7 Albedo Overlord trong trang phục nội y trắng bướm đặc trưng.', 'figure', 'anime', '1/7', 'Kotobukiya', 'PVC / ABS', 4.85, 209, 0, 0, 0, 1, 7, '/images/figure.png'),
('f28', 'Figure 1/6 Deadpool Maximum Effort Hot Toys', 'Hot Toys', 13200000.00, NULL, 'Hot Toys 1/6 Deadpool với đầy đủ katana, súng, tay phụ thay thế nhiều kiểu.', 'figure', 'hottoys', '1/6', 'Hot Toys', 'Diecast / Fabric', 5.00, 81, 1, 0, 1, 1, 3, '/images/figure.png'),
('f29', 'Figure 1/7 Erza Scarlet Armor Fairy Tail Alter', 'Alter', 4500000.00, 5000000.00, 'Figure 1/7 Erza Scarlet trong Armadura Fairy Fairy Tail, giáp hồng lộng lẫy.', 'figure', 'anime', '1/7', 'Alter', 'PVC / ABS', 4.75, 116, 0, 1, 0, 1, 10, '/images/figure.png'),
('f30', 'Nendoroid 2158 Itadori Yuji Jujutsu Kaisen', 'Good Smile Company', 880000.00, NULL, 'Nendoroid Itadori Yuji với cursed energy effect, Detroit Smash Divergent Fist.', 'figure', 'nendoroid', '1/12', 'Good Smile Company', 'PVC / ABS', 4.80, 256, 0, 0, 0, 1, 25, '/images/figure.png'),

-- ============================================================
-- SIÊU XE DIECAST (30 sản phẩm mới, id d01 - d30)
-- ============================================================
('d01', 'Mô Hình Xe 1/18 Autoart Ferrari SF90 Stradale', 'Autoart Models', 8500000.00, NULL, 'Diecast 1/18 Ferrari SF90 Stradale màu rosso corsa, phiên bản hybrid siêu xe.', 'diecast', 'supercar', '1/18', 'Autoart', 'Composite Metal', 4.90, 98, 1, 0, 1, 1, 7, '/images/supercar.png'),
('d02', 'Mô Hình Xe 1/18 Almost Real Bugatti Chiron Pur Sport', 'Almost Real', 9200000.00, 10100000.00, 'Almost Real 1/18 Bugatti Chiron Pur Sport màu trắng đen, full open doors.', 'diecast', 'supercar', '1/18', 'Almost Real', 'Diecast Metal', 4.95, 54, 0, 1, 1, 1, 5, '/images/supercar.png'),
('d03', 'Mô Hình Xe 1/24 Maisto Ferrari Roma', 'Maisto', 850000.00, NULL, 'Maisto 1/24 Ferrari Roma màu grigio titanio metallic, giá phải chăng.', 'diecast', 'supercar', '1/24', 'Maisto', 'Diecast Metal', 4.30, 324, 0, 0, 0, 1, 50, '/images/supercar.png'),
('d04', 'Mô Hình Xe 1/18 Norev Porsche 911 GT3 RS 2022', 'Norev', 3800000.00, 4200000.00, 'Norev 1/18 Porsche 911 GT3 RS 2022 màu orange, cửa và nắp capo mở được.', 'diecast', 'supercar', '1/18', 'Norev', 'Diecast Metal', 4.75, 87, 0, 1, 0, 1, 12, '/images/supercar.png'),
('d05', 'Mô Hình Xe 1/18 Minichamps McLaren P1 GTR', 'Minichamps', 6800000.00, NULL, 'Minichamps 1/18 McLaren P1 GTR phiên bản track-only với livery đặc biệt.', 'diecast', 'supercar', '1/18', 'Minichamps', 'Diecast Metal', 4.85, 62, 1, 0, 1, 1, 6, '/images/supercar.png'),
('d06', 'Mô Hình Xe 1/12 Kyosho Yamaha YZF-R1M', 'Kyosho', 5500000.00, 6100000.00, 'Kyosho 1/12 Yamaha YZF-R1M với khung carbon giả, siêu mô tô phân khối lớn.', 'diecast', 'motorcycle', '1/12', 'Kyosho', 'Diecast Metal', 4.80, 73, 0, 1, 0, 1, 8, '/images/supercar.png'),
('d07', 'Mô Hình Xe 1/18 Autoart Koenigsegg One 1', 'Autoart Models', 9800000.00, NULL, 'Autoart 1/18 Koenigsegg One:1 với màu sơn matte grey đặc trưng, mở cửa cánh.', 'diecast', 'supercar', '1/18', 'Autoart', 'Composite Metal', 4.90, 41, 0, 0, 1, 1, 4, '/images/supercar.png'),
('d08', 'Mô Hình Xe 1/24 Bburago Ferrari 488 GTB', 'Bburago', 750000.00, NULL, 'Bburago 1/24 Ferrari 488 GTB màu rosso corsa giá tốt cho người mới bắt đầu.', 'diecast', 'supercar', '1/24', 'Bburago', 'Diecast Metal', 4.20, 412, 0, 0, 0, 1, 60, '/images/supercar.png'),
('d09', 'Mô Hình Xe 1/18 Almost Real Rolls Royce Ghost', 'Almost Real', 7900000.00, 8600000.00, 'Almost Real 1/18 Rolls-Royce Ghost màu silver dawn, đèn trần ngàn sao.', 'diecast', 'luxury', '1/18', 'Almost Real', 'Diecast Metal', 4.90, 36, 0, 1, 1, 1, 5, '/images/supercar.png'),
('d10', 'Mô Hình Xe 1/18 Minichamps Lamborghini Huracan STO', 'Minichamps', 5900000.00, NULL, 'Minichamps 1/18 Huracan STO màu giallo orion, cánh trước sau tháo lắp được.', 'diecast', 'supercar', '1/18', 'Minichamps', 'Diecast Metal', 4.80, 55, 1, 0, 0, 1, 8, '/images/supercar.png'),
('d11', 'Mô Hình Tàu Hải Quân USS Enterprise 1/350 Academy', 'Academy Models', 3200000.00, 3600000.00, 'Plastic model kit tàu sân bay USS Enterprise CVN-65 tỉ lệ 1/350 của Academy.', 'diecast', 'ship', '1/350', 'Academy Models', 'Plastic', 4.60, 93, 0, 1, 0, 1, 10, '/images/supercar.png'),
('d12', 'Mô Hình Xe 1/18 Autoart Aston Martin DBS Superleggera', 'Autoart Models', 7200000.00, NULL, 'Autoart 1/18 Aston Martin DBS Superleggera màu hammerhead silver metallic.', 'diecast', 'luxury', '1/18', 'Autoart', 'Composite Metal', 4.85, 47, 0, 0, 0, 1, 6, '/images/supercar.png'),
('d13', 'Mô Hình Máy Bay F-22 Raptor 1/72 Tamiya', 'Tamiya', 1800000.00, NULL, 'Tamiya 1/72 F-22A Raptor plastic model kit với decal chi tiết.', 'diecast', 'airplane', '1/72', 'Tamiya', 'Plastic', 4.70, 128, 0, 0, 0, 1, 20, '/images/supercar.png'),
('d14', 'Mô Hình Xe 1/18 Norev Mercedes AMG GT Black Series', 'Norev', 4100000.00, 4600000.00, 'Norev 1/18 Mercedes-AMG GT Black Series màu magno brilliant blue.', 'diecast', 'supercar', '1/18', 'Norev', 'Diecast Metal', 4.80, 64, 0, 1, 1, 1, 10, '/images/supercar.png'),
('d15', 'Mô Hình Xe 1/12 Kyosho Honda CBR1000RR Fireblade', 'Kyosho', 4800000.00, NULL, 'Kyosho 1/12 Honda CBR1000RR Fireblade SP2 tricolore phiên bản đua.', 'diecast', 'motorcycle', '1/12', 'Kyosho', 'Diecast Metal', 4.75, 61, 0, 0, 0, 1, 9, '/images/supercar.png'),
('d16', 'Mô Hình Xe 1/18 Almost Real BMW M3 Competition G80', 'Almost Real', 5800000.00, 6400000.00, 'Almost Real 1/18 BMW M3 Competition G80 màu sao paolo yellow.', 'diecast', 'supercar', '1/18', 'Almost Real', 'Diecast Metal', 4.85, 72, 0, 1, 0, 1, 8, '/images/supercar.png'),
('d17', 'Mô Hình Xe Tank T-34 1/35 Tamiya', 'Tamiya', 1500000.00, NULL, 'Tamiya 1/35 T-34/85 Soviet Medium Tank với figure lính plastic kit.', 'diecast', 'military', '1/35', 'Tamiya', 'Plastic', 4.65, 186, 0, 0, 0, 1, 25, '/images/supercar.png'),
('d18', 'Mô Hình Xe 1/18 Minichamps Porsche 918 Spyder Weissach', 'Minichamps', 7500000.00, NULL, 'Minichamps 1/18 Porsche 918 Spyder Weissach Package màu white silver.', 'diecast', 'supercar', '1/18', 'Minichamps', 'Diecast Metal', 4.90, 49, 1, 0, 1, 1, 5, '/images/supercar.png'),
('d19', 'Mô Hình Máy Bay Spitfire Mk IX 1/48 Tamiya', 'Tamiya', 1200000.00, 1380000.00, 'Tamiya 1/48 Supermarine Spitfire Mk.IXc plastic kit WWII British fighter.', 'diecast', 'airplane', '1/48', 'Tamiya', 'Plastic', 4.60, 145, 0, 1, 0, 1, 18, '/images/supercar.png'),
('d20', 'Mô Hình Xe 1/18 Autoart Mazda RX-7 FD3S Spirit R', 'Autoart Models', 6200000.00, NULL, 'Autoart 1/18 Mazda RX-7 Spirit R Type-A màu winning blue mica.', 'diecast', 'jdm', '1/18', 'Autoart', 'Composite Metal', 4.90, 108, 1, 0, 1, 1, 6, '/images/supercar.png'),
('d21', 'Mô Hình Xe 1/18 Almost Real Bentley Continental GT Speed', 'Almost Real', 8200000.00, 9000000.00, 'Almost Real 1/18 Bentley Continental GT Speed màu cricket ball dark red.', 'diecast', 'luxury', '1/18', 'Almost Real', 'Diecast Metal', 4.85, 31, 0, 1, 0, 1, 4, '/images/supercar.png'),
('d22', 'Mô Hình Xe 1/18 Norev Citroen SM 1971', 'Norev', 3100000.00, NULL, 'Norev 1/18 Citroën SM 1971 màu bleu delage, cổ điển Pháp sang trọng.', 'diecast', 'classic', '1/18', 'Norev', 'Diecast Metal', 4.65, 76, 0, 0, 0, 1, 12, '/images/supercar.png'),
('d23', 'Mô Hình Xe 1/12 Kyosho Ducati Panigale V4 S', 'Kyosho', 5200000.00, 5800000.00, 'Kyosho 1/12 Ducati Panigale V4 S màu ducati red với khung Superquadro Mono.', 'diecast', 'motorcycle', '1/12', 'Kyosho', 'Diecast Metal', 4.85, 68, 0, 1, 1, 1, 7, '/images/supercar.png'),
('d24', 'Mô Hình Xe Tank Panzer IV 1/35 Tamiya', 'Tamiya', 1400000.00, NULL, 'Tamiya 1/35 Panzerkampfwagen IV Ausf.J với track chi tiết, figure lính Đức.', 'diecast', 'military', '1/35', 'Tamiya', 'Plastic', 4.70, 167, 0, 0, 0, 1, 22, '/images/supercar.png'),
('d25', 'Mô Hình Xe 1/18 Autoart Honda NSX NA1 1990', 'Autoart Models', 5600000.00, 6200000.00, 'Autoart 1/18 Honda NSX NA1 1990 màu grand prix white, mở hood thấy mid engine.', 'diecast', 'jdm', '1/18', 'Autoart', 'Composite Metal', 4.90, 93, 0, 1, 1, 1, 8, '/images/supercar.png'),
('d26', 'Mô Hình Tàu Bismarck 1/350 Revell', 'Revell', 2800000.00, NULL, 'Revell 1/350 Bismarck chiến hạm Đức WWII plastic kit siêu chi tiết.', 'diecast', 'ship', '1/350', 'Revell', 'Plastic', 4.55, 112, 0, 0, 0, 1, 15, '/images/supercar.png'),
('d27', 'Mô Hình Xe 1/18 Minichamps Ford GT 2005 Le Mans', 'Minichamps', 6400000.00, 7000000.00, 'Minichamps 1/18 Ford GT #4 Le Mans 2005 livery Midnight Blue.', 'diecast', 'racing', '1/18', 'Minichamps', 'Diecast Metal', 4.80, 58, 0, 1, 0, 1, 6, '/images/supercar.png'),
('d28', 'Mô Hình Xe 1/18 Almost Real Mercedes G63 AMG 6x6', 'Almost Real', 8800000.00, NULL, 'Almost Real 1/18 Mercedes-AMG G63 6x6 màu polar white cực độc.', 'diecast', 'suv', '1/18', 'Almost Real', 'Diecast Metal', 4.90, 42, 1, 0, 1, 1, 4, '/images/supercar.png'),
('d29', 'Mô Hình Máy Bay F-14 Tomcat 1/48 Tamiya', 'Tamiya', 2200000.00, 2500000.00, 'Tamiya 1/48 Grumman F-14A Tomcat VF-84 Jolly Rogers decal siêu đẹp.', 'diecast', 'airplane', '1/48', 'Tamiya', 'Plastic', 4.75, 133, 0, 1, 1, 1, 14, '/images/supercar.png'),
('d30', 'Mô Hình Xe 1/18 Autoart Toyota GR Supra 2020', 'Autoart Models', 5400000.00, NULL, 'Autoart 1/18 Toyota GR Supra 2020 màu prominence orange, engine mở được.', 'diecast', 'jdm', '1/18', 'Autoart', 'Composite Metal', 4.85, 86, 1, 0, 0, 1, 9, '/images/supercar.png'),

-- ============================================================
-- TƯỢNG RESIN & DIORAMA (30 sản phẩm mới, id r01 - r30)
-- ============================================================
('r01', 'Tượng Resin Tsume Art Goku Ultra Instinct 1/6 HQS', 'Tsume Art', 28500000.00, NULL, 'Tượng Tsume Art Goku Ultra Instinct với Silver aura effect khổng lồ, 1/6 Scale.', 'resin', 'statue', '1/6', 'Tsume Art', 'Polystone Resin', 5.00, 38, 1, 0, 1, 1, 2, '/images/statue.png'),
('r02', 'Tượng Resin Prime 1 Studio Superman New 52 Deluxe 1/3', 'Prime 1 Studio', 38000000.00, 42000000.00, 'Tượng khổng lồ Prime 1 Studio Superman New 52 Deluxe với LED cape.', 'resin', 'statue', '1/3', 'Prime 1 Studio', 'Polystone Resin', 5.00, 22, 0, 1, 1, 1, 1, '/images/statue.png'),
('r03', 'Tượng Resin XM Studios Spider-Man 1/4 Premium', 'XM Studios', 32000000.00, NULL, 'XM Studios 1/4 Spider-Man Premium Collectibles Series web-slinging pose.', 'resin', 'statue', '1/4', 'XM Studios', 'Polystone Resin', 5.00, 27, 0, 0, 1, 1, 1, '/images/statue.png'),
('r04', 'Tượng Resin Tsume Art Vegeta Super Saiyan Blue 1/6', 'Tsume Art', 26500000.00, 29000000.00, 'Tsume Art Vegeta SSGSS Final Flash pose với blue aura electric effect.', 'resin', 'statue', '1/6', 'Tsume Art', 'Polystone Resin', 5.00, 31, 0, 1, 1, 1, 2, '/images/statue.png'),
('r05', 'Tượng Resin Prime 1 Studio Hulk Immortal 1/3', 'Prime 1 Studio', 34500000.00, NULL, 'Prime 1 Studio Immortal Hulk 1/3 với màu xanh dark ominous, siêu giới hạn.', 'resin', 'statue', '1/3', 'Prime 1 Studio', 'Polystone Resin', 5.00, 18, 1, 0, 1, 1, 1, '/images/statue.png'),
('r06', 'Diorama Resin Banpresto Demon Slayer Flame Pillar Set', 'Banpresto', 2800000.00, NULL, 'Diorama set 3 tượng Flame Pillar Demon Slayer của Banpresto, Rengoku vs Akaza.', 'resin', 'diorama', NULL, 'Banpresto', 'PVC / Resin', 4.60, 198, 1, 0, 0, 1, 15, '/images/statue.png'),
('r07', 'Tượng Resin XM Studios Wonder Woman God of War 1/4', 'XM Studios', 30000000.00, 33000000.00, 'XM Studios 1/4 Wonder Woman God of War với golden armor đẹp tuyệt vời.', 'resin', 'statue', '1/4', 'XM Studios', 'Polystone Resin', 5.00, 24, 0, 1, 1, 1, 2, '/images/statue.png'),
('r08', 'Tượng Resin Tsume Art Luffy Gear 5 Sun God 1/6', 'Tsume Art', 31000000.00, NULL, 'Tsume Art Luffy Gear 5 Sun God Nika với white aura effect rực rỡ, One Piece.', 'resin', 'statue', '1/6', 'Tsume Art', 'Polystone Resin', 5.00, 16, 1, 0, 1, 1, 1, '/images/statue.png'),
('r09', 'Diorama Resin Kotobukiya Attack on Titan Colossal', 'Kotobukiya', 5800000.00, 6400000.00, 'Kotobukiya 1/35 Colossal Titan với steam effect base diorama siêu ấn tượng.', 'resin', 'diorama', '1/35', 'Kotobukiya', 'Polystone Resin', 4.80, 87, 0, 1, 0, 1, 5, '/images/statue.png'),
('r10', 'Tượng Resin Prime 1 Studio Iron Man Bleeding Edge 1/2', 'Prime 1 Studio', 52000000.00, NULL, 'Prime 1 Studio Iron Man Bleeding Edge siêu khổng lồ 1/2 Scale Ultimate Premium.', 'resin', 'statue', '1/2', 'Prime 1 Studio', 'Polystone Resin / LED', 5.00, 9, 1, 0, 1, 1, 1, '/images/statue.png'),
('r11', 'Tượng Resin Tsume Art Roronoa Zoro Ashura 1/6', 'Tsume Art', 27000000.00, 30000000.00, 'Tsume Art Zoro Asura 1/6 với 9 swords aura effect huyền thoại từ One Piece.', 'resin', 'statue', '1/6', 'Tsume Art', 'Polystone Resin', 5.00, 33, 0, 1, 1, 1, 2, '/images/statue.png'),
('r12', 'Diorama Resin Banpresto Jujutsu Kaisen Domain Set', 'Banpresto', 3200000.00, NULL, 'Diorama set Gojo Hollow Purple vs Sukuna Special Grade, Banpresto JJK.', 'resin', 'diorama', NULL, 'Banpresto', 'PVC / Resin', 4.65, 176, 1, 0, 0, 1, 12, '/images/statue.png'),
('r13', 'Tượng Resin XM Studios Green Lantern Hal Jordan 1/4', 'XM Studios', 28000000.00, NULL, 'XM Studios 1/4 Green Lantern Hal Jordan với power ring constructs.', 'resin', 'statue', '1/4', 'XM Studios', 'Polystone Resin', 5.00, 19, 0, 0, 0, 1, 2, '/images/statue.png'),
('r14', 'Tượng Resin Prime 1 Studio Catwoman Rebirth 1/3', 'Prime 1 Studio', 29500000.00, 32000000.00, 'Prime 1 Studio Catwoman Rebirth 1/3 với whip base diorama siêu gợi cảm.', 'resin', 'statue', '1/3', 'Prime 1 Studio', 'Polystone Resin', 5.00, 21, 0, 1, 1, 1, 1, '/images/statue.png'),
('r15', 'Diorama Resin Tsume Art Naruto Team 7 1/10 HQS', 'Tsume Art', 18000000.00, NULL, 'Tsume Art Team 7 Naruto + Sasuke + Sakura 1/10, bộ 3 tượng diorama cùng nhau.', 'resin', 'diorama', '1/10', 'Tsume Art', 'Polystone Resin', 5.00, 45, 0, 0, 1, 1, 3, '/images/statue.png'),
('r16', 'Tượng Resin XM Studios Thor Asgardian King 1/4', 'XM Studios', 33000000.00, 36500000.00, 'XM Studios 1/4 Thor King of Asgard với throne lightning effect.', 'resin', 'statue', '1/4', 'XM Studios', 'Polystone Resin', 5.00, 17, 0, 1, 0, 1, 1, '/images/statue.png'),
('r17', 'Diorama Resin Banpresto Dragon Ball Super Broly Set', 'Banpresto', 3500000.00, NULL, 'Diorama Broly vs Gogeta 5 chiều Banpresto DBS, siêu cảnh chiến đấu epic.', 'resin', 'diorama', NULL, 'Banpresto', 'PVC / Resin', 4.55, 142, 0, 0, 0, 1, 10, '/images/statue.png'),
('r18', 'Tượng Resin Tsume Art Ichigo Bankai Kurosaki 1/6', 'Tsume Art', 25000000.00, 27500000.00, 'Tsume Art Ichigo Bankai final form với black Zanpakuto twin swords.', 'resin', 'statue', '1/6', 'Tsume Art', 'Polystone Resin', 5.00, 28, 0, 1, 0, 1, 2, '/images/statue.png'),
('r19', 'Tượng Resin Prime 1 Studio Wolverine Berserker Rage 1/3', 'Prime 1 Studio', 36000000.00, NULL, 'Prime 1 Studio Wolverine Berserker Rage 1/3 với adamantium claws xuất bản giới hạn.', 'resin', 'statue', '1/3', 'Prime 1 Studio', 'Polystone Resin', 5.00, 15, 1, 0, 1, 1, 1, '/images/statue.png'),
('r20', 'Diorama Resin Kotobukiya Evangelion Unit 01 vs Angel', 'Kotobukiya', 6500000.00, 7200000.00, 'Kotobukiya EVA-01 vs 4th Angel Sachiel diorama battle set với led.', 'resin', 'diorama', NULL, 'Kotobukiya', 'Polystone Resin / LED', 4.85, 63, 0, 1, 1, 1, 4, '/images/statue.png'),
('r21', 'Tượng Resin XM Studios Cyclops X-Men 1/4', 'XM Studios', 27500000.00, NULL, 'XM Studios 1/4 Cyclops X-Men với optic blast base effect đỏ rực.', 'resin', 'statue', '1/4', 'XM Studios', 'Polystone Resin', 5.00, 20, 0, 0, 0, 1, 2, '/images/statue.png'),
('r22', 'Tượng Resin Tsume Art Vegito Super Saiyan 1/6', 'Tsume Art', 29000000.00, 32000000.00, 'Tsume Art Vegito SSJ Yellow với aura electric dual pose siêu đẹp.', 'resin', 'statue', '1/6', 'Tsume Art', 'Polystone Resin', 5.00, 25, 0, 1, 1, 1, 2, '/images/statue.png'),
('r23', 'Diorama Resin Banpresto Chainsaw Man Special Grade', 'Banpresto', 2600000.00, NULL, 'Banpresto Chainsaw Man Denji full power Chainsaw Form diorama set.', 'resin', 'diorama', NULL, 'Banpresto', 'PVC / Resin', 4.70, 158, 1, 0, 0, 1, 14, '/images/statue.png'),
('r24', 'Tượng Resin Prime 1 Studio Captain America Civil War 1/3', 'Prime 1 Studio', 33500000.00, 37000000.00, 'Prime 1 Studio 1/3 Captain America Civil War suit với shield throw base.', 'resin', 'statue', '1/3', 'Prime 1 Studio', 'Polystone Resin', 5.00, 23, 0, 1, 1, 1, 1, '/images/statue.png'),
('r25', 'Diorama Resin Tsume Art Bleach Espada vs Shinigami', 'Tsume Art', 22000000.00, NULL, 'Tsume Art Bleach set Ulquiorra vs Ichigo Hollow Form 1/10 diorama.', 'resin', 'diorama', '1/10', 'Tsume Art', 'Polystone Resin', 5.00, 37, 0, 0, 1, 1, 2, '/images/statue.png'),
('r26', 'Tượng Resin XM Studios Magneto Master of Magnetism 1/4', 'XM Studios', 29500000.00, 33000000.00, 'XM Studios 1/4 Magneto với helmet kim loại bay xung quanh effect.', 'resin', 'statue', '1/4', 'XM Studios', 'Polystone Resin', 5.00, 14, 0, 1, 0, 1, 1, '/images/statue.png'),
('r27', 'Tượng Resin Tsume Art Sanji Raid Suit One Piece 1/6', 'Tsume Art', 24000000.00, NULL, 'Tsume Art Sanji Raid Suit Judge form 1/6 với flame effects Ifrit Jambe.', 'resin', 'statue', '1/6', 'Tsume Art', 'Polystone Resin', 5.00, 29, 1, 0, 1, 1, 2, '/images/statue.png'),
('r28', 'Diorama Resin Banpresto Spy x Family Family Portrait', 'Banpresto', 3800000.00, 4200000.00, 'Banpresto Spy x Family diorama set Loid + Yor + Anya, gia đình siêu cute.', 'resin', 'diorama', NULL, 'Banpresto', 'PVC / Resin', 4.75, 213, 0, 1, 1, 1, 18, '/images/statue.png'),
('r29', 'Tượng Resin Prime 1 Studio Joker Killing Joke 1/3', 'Prime 1 Studio', 31000000.00, NULL, 'Prime 1 Studio 1/3 Joker The Killing Joke với diorama Batman finale scene.', 'resin', 'statue', '1/3', 'Prime 1 Studio', 'Polystone Resin', 5.00, 26, 0, 0, 1, 1, 1, '/images/statue.png'),
('r30', 'Tượng Resin XM Studios Silver Surfer Heralder 1/4', 'XM Studios', 31500000.00, 35000000.00, 'XM Studios 1/4 Silver Surfer với Power Cosmic base wave effect bạc ánh kim.', 'resin', 'statue', '1/4', 'XM Studios', 'Polystone Resin', 5.00, 11, 1, 1, 1, 1, 1, '/images/statue.png');

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

-- ------------------------------------------------------------
-- Table structure for `employees` (Quản lý Nhân Viên & Chấm Công)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employees` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `position` VARCHAR(100) NOT NULL,
  `shift` VARCHAR(100) DEFAULT 'Full-time (8h/ngày)',
  `base_salary` DECIMAL(15,2) NOT NULL DEFAULT 8500000,
  `work_days` INT NOT NULL DEFAULT 26,
  `commission_rate` DECIMAL(5,2) NOT NULL DEFAULT 1.50,
  `sales_revenue` DECIMAL(15,2) DEFAULT 0,
  `allowance` DECIMAL(15,2) DEFAULT 1000000,
  `bonus` DECIMAL(15,2) DEFAULT 1000000,
  `deduction` DECIMAL(15,2) DEFAULT 0,
  `join_date` VARCHAR(30) DEFAULT NULL,
  `status` VARCHAR(30) DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping initial employees
INSERT INTO `employees` (`id`, `name`, `phone`, `email`, `position`, `shift`, `base_salary`, `work_days`, `commission_rate`, `sales_revenue`, `allowance`, `bonus`, `deduction`, `join_date`, `status`) VALUES
('NV001', 'Trần Văn Hoàng', '0908112233', 'hoang.tran@luxe.vn', 'Quản lý Showroom', 'Full-time (8h/ngày)', 16000000.00, 26, 1.50, 180000000.00, 2000000.00, 3000000.00, 1500000.00, '2023-05-15', 'ACTIVE'),
('NV002', 'Nguyễn Thị Mai', '0912334455', 'mai.nguyen@luxe.vn', 'Chuyên viên Tư vấn Mô hình', 'Full-time (8h/ngày)', 9500000.00, 25, 2.00, 240000000.00, 1200000.00, 2500000.00, 900000.00, '2023-10-01', 'ACTIVE'),
('NV003', 'Lê Quốc Bảo', '0938776655', 'bao.le@luxe.vn', 'Thu ngân', 'Ca Sáng (8h - 15h)', 7500000.00, 26, 0.50, 95000000.00, 1000000.00, 1000000.00, 600000.00, '2024-02-20', 'ACTIVE'),
('NV004', 'Đặng Minh Khôi', '0977881122', 'khoi.dang@luxe.vn', 'Thủ kho', 'Full-time (8h/ngày)', 9000000.00, 26, 0.00, 0.00, 1500000.00, 1500000.00, 800000.00, '2023-08-10', 'ACTIVE'),
('NV005', 'Võ Thanh Tùng', '0945667788', 'tung.vo@luxe.vn', 'Kỹ thuật viên Unbox & Lắp ráp', 'Ca Chiều (14h - 21h30)', 8500000.00, 24, 1.00, 45000000.00, 1000000.00, 800000.00, 700000.00, '2024-04-01', 'ACTIVE')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- ------------------------------------------------------------
-- Table structure for `expenses` (Chi phí vận hành showroom & tính lãi lỗ)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `expense_date` VARCHAR(30) NOT NULL,
  `note` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping initial expenses
INSERT INTO `expenses` (`title`, `category`, `amount`, `expense_date`, `note`) VALUES
('Thuê mặt bằng Showroom Quận 1', 'Mặt bằng', 18000000.00, '2026-08-01', 'Hợp đồng thuê showroom 123 Lê Lợi Q1'),
('Tiền điện & Điều hòa bảo quản mô hình', 'Tiện ích', 3500000.00, '2026-08-05', 'Nhiệt độ phòng lạnh tiêu chuẩn bảo quản resin & decal'),
('Chi phí Marketing Facebook / TikTok Ads', 'Quảng cáo', 6500000.00, '2026-08-10', 'Chạy chiến dịch mô hình Limited Edition Gundam PG'),
('Vật tư đóng gói chống sốc 3 lớp', 'Vận hành', 1200000.00, '2026-08-12', 'Xốp bóng khí, thùng carton 5 lớp chuyên dụng')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- ------------------------------------------------------------
-- Table structure for `vouchers` (Kho Voucher Master)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vouchers` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `discount_type` VARCHAR(30) NOT NULL DEFAULT 'PERCENT', -- PERCENT, FIXED, SHIPPING
  `discount_value` DECIMAL(15,2) NOT NULL,
  `min_order` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `max_discount` DECIMAL(15,2) DEFAULT NULL,
  `tag` VARCHAR(50) DEFAULT 'HOT',
  `category` VARCHAR(50) DEFAULT 'ALL',
  `expires_at` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping Master Vouchers
INSERT INTO `vouchers` (`id`, `code`, `title`, `description`, `discount_type`, `discount_value`, `min_order`, `max_discount`, `tag`, `category`, `expires_at`, `is_active`) VALUES
('V_NEWBIE', 'TANTHU100K', 'Gói Chào Bạn Mới - Giảm 100K', 'Dành riêng cho thành viên mới đăng ký tài khoản Luxe', 'FIXED', 100000.00, 1000000.00, NULL, 'TÂN THỦ 🎁', 'ALL', '2026-12-31', 1),
('V_PROFILE', 'PROFILE50K', 'Hoàn Tất Hồ Sơ - Giảm 50K', 'Thưởng hoàn thành cập nhật SĐT & Địa chỉ giao hàng', 'FIXED', 50000.00, 500000.00, NULL, 'NHIỆM VỤ 🎯', 'ALL', '2026-12-31', 1),
('V_CHECKIN7', 'STREAK7NGAY', 'Điểm Danh 7 Ngày - Giảm 150K', 'Thưởng chuỗi điểm danh 7 ngày liên tiếp', 'FIXED', 150000.00, 1500000.00, NULL, 'CHUYÊN CẦN 📅', 'ALL', '2026-12-31', 1),
('V_LUCKY', 'LUCKYWHEEL', 'Vòng Quay May Mắn - Giảm 200K', 'Trúng thưởng từ Minigame Vòng Quay May Mắn', 'FIXED', 200000.00, 2000000.00, NULL, 'MAY MẮN 🎲', 'ALL', '2026-12-31', 1),
('V_VIP_MONTH', 'VIPFREESHIP', 'Freeship Không Giới Hạn (Gói VIP 30 Ngày)', 'Miễn phí giao hàng toàn quốc dành riêng hội viên gói tháng', 'SHIPPING', 50000.00, 0.00, NULL, 'VIP PASS 👑', 'ALL', '2026-12-31', 1),
('V_VIP_GOLD', 'VIPGOLD15', 'Đặc Quyền Gói VIP - Giảm 15%', 'Giảm 15% tối đa 1.500.000₫ cho thành viên đăng ký VIP Pass', 'PERCENT', 15.00, 3000000.00, 1500000.00, 'GOLD VIP ⭐', 'ALL', '2026-12-31', 1),
('V_REVIEW', 'REVIEW50K', 'Đánh Giá Sản Phẩm - Giảm 50K', 'Thưởng đánh giá & hình ảnh unbox mô hình', 'FIXED', 50000.00, 500000.00, NULL, 'REVIEW 💬', 'ALL', '2026-12-31', 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- ------------------------------------------------------------
-- Table structure for `user_vouchers` (Ví Voucher Người Dùng)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_vouchers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT 1,
  `code` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `discount_type` VARCHAR(30) NOT NULL,
  `discount_value` DECIMAL(15,2) NOT NULL,
  `min_order` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `max_discount` DECIMAL(15,2) DEFAULT NULL,
  `tag` VARCHAR(50) DEFAULT 'SỞ HỮU',
  `is_used` TINYINT(1) DEFAULT 0,
  `acquired_from` VARCHAR(100) DEFAULT 'SIGNUP',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping initial user vouchers
INSERT INTO `user_vouchers` (`user_id`, `code`, `title`, `discount_type`, `discount_value`, `min_order`, `max_discount`, `tag`, `acquired_from`) VALUES
(1, 'TANTHU100K', 'Gói Chào Bạn Mới - Giảm 100K', 'FIXED', 100000.00, 1000000.00, NULL, 'TÂN THỦ 🎁', 'SIGNUP')
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- ------------------------------------------------------------
-- Table structure for `user_quests` (Nhiệm Vụ Kiếm Voucher)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_quests` (
  `id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(20) DEFAULT '🎯',
  `reward_voucher_code` VARCHAR(50) NOT NULL,
  `reward_title` VARCHAR(255) NOT NULL,
  `progress` INT DEFAULT 0,
  `max_progress` INT DEFAULT 1,
  `is_completed` TINYINT(1) DEFAULT 0,
  `is_claimed` TINYINT(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping initial quests
INSERT INTO `user_quests` (`id`, `title`, `description`, `icon`, `reward_voucher_code`, `reward_title`, `progress`, `max_progress`, `is_completed`, `is_claimed`) VALUES
('Q_PROFILE', 'Hoàn thiện hồ sơ tài khoản', 'Cập nhật đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng', '👤', 'PROFILE50K', 'Voucher Giảm 50.000₫', 1, 1, 1, 0),
('Q_CHECKIN', 'Điểm danh liên tiếp 7 ngày', 'Đăng nhập vào website và điểm danh mỗi ngày', '📅', 'STREAK7NGAY', 'Voucher Giảm 150.000₫', 5, 7, 0, 0),
('Q_WHEEL', 'Quay Vòng Quay May Mắn', 'Tham gia minigame vòng quay may mắn hàng tuần', '🎲', 'LUCKYWHEEL', 'Voucher May Mắn 200.000₫', 1, 1, 1, 0),
('Q_REVIEW', 'Viết đánh giá mô hình đã mua', 'Chia sẻ cảm nhận hoặc hình ảnh unbox mô hình của bạn', '⭐', 'REVIEW50K', 'Voucher Giảm 50.000₫', 0, 1, 0, 0),
('Q_FIRST_ORDER', 'Hoàn tất đơn hàng đầu tiên', 'Mua và nhận thành công bất kỳ mô hình nào tại cửa hàng', '📦', 'TANTHU100K', 'Voucher Giảm 100.000₫', 1, 1, 1, 1)
ON DUPLICATE KEY UPDATE `title`=VALUES(`title`);

-- ------------------------------------------------------------
-- Table structure for `user_subscriptions` (Gói Hội Viên VIP 30 Ngày)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_subscriptions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT DEFAULT 1,
  `plan_key` VARCHAR(50) NOT NULL,
  `plan_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(15,2) NOT NULL,
  `duration_days` INT NOT NULL DEFAULT 30,
  `start_date` VARCHAR(30) NOT NULL,
  `end_date` VARCHAR(30) NOT NULL,
  `status` VARCHAR(30) DEFAULT 'ACTIVE',
  `benefits` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
