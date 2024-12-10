CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    first_name VARCHAR(70),
    last_name VARCHAR(70),
    phone_number VARCHAR(20),
    img VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    device_type VARCHAR(100),
    ip_address VARCHAR(100),
    osName VARCHAR(100),
    osVersion VARCHAR(100),
    browser VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    default_address BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INT NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    img VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE product_options (
    product_options_id INT AUTO_INCREMENT PRIMARY KEY,
    product_options_name VARCHAR(150) NOT NULL,
    active BOOLEAN DEFAULT FALSE NULL,
    color BOOLEAN DEFAULT FALSE NULL,
    size BOOLEAN DEFAULT FALSE NULL,
    storage BOOLEAN DEFAULT FALSE NULL,
    devices BOOLEAN DEFAULT FALSE NULL
);

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_options_id INT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    img VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (product_options_id) REFERENCES product_options(product_options_id)
);

CREATE TABLE product_details (
    product_details_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    details_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    quantity INT DEFAULT 1,
    color VARCHAR(100),
    size VARCHAR(50),
    storage VARCHAR(50),
    devices VARCHAR(50),
    img VARCHAR(500),
    discount INT DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    new_arrival BOOLEAN  DEFAULT FALSE,
    on_sale BOOLEAN  DEFAULT FALSE,
    hot_sale BOOLEAN  DEFAULT FALSE,
    sold_count INT DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE cart_items (
    cart_items_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_details_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_details_id) REFERENCES product_details(product_details_id)
);


CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT,
    email VARCHAR(100) NOT NULL,
    first_name VARCHAR(70),
    last_name VARCHAR(70),
    phone_number VARCHAR(20),
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_fee DECIMAL(10, 2) NOT NULL,
    net_amount DECIMAL(10, 2) NOT NULL,
    tracking_code VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

CREATE TABLE order_items (
    order_items_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_details_id INT NOT NULL,
    details_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255),
    description VARCHAR(255),
    color VARCHAR(100),
    size VARCHAR(50),
    storage VARCHAR(50),
    devices VARCHAR(50),
    img VARCHAR(500),
    discount INT DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    quantity INT NOT NULL,
    stock INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_details_id) REFERENCES product_details(product_details_id)
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_paypal_id VARCHAR(100) NOT NULL,
    payment_capture_id VARCHAR(100) NOT NULL,
    payment_payer_id VARCHAR(100) NOT NULL,
    payment_email_address VARCHAR(100) NOT NULL,
    payment_first_name VARCHAR(100) NOT NULL,
    payment_last_name VARCHAR(100) NOT NULL,
    address_line_1 VARCHAR(100) NOT NULL,
    address_line_2 VARCHAR(100),
    admin_area_1 VARCHAR(100),
    admin_area_2 VARCHAR(100),
    postal_code VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_fee DECIMAL(10, 2) NOT NULL,
    net_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE licenses (
    license_id INT AUTO_INCREMENT PRIMARY KEY,
    order_items_id INT NOT NULL,
    license_key VARCHAR(255) NOT NULL UNIQUE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (order_items_id) REFERENCES order_items(order_items_id)
);

CREATE TABLE password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX user_id_idx (user_id)
);

