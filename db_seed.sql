INSERT INTO roles (role_name) VALUES ('admin');
INSERT INTO roles (role_name) VALUES ('admin_users');

INSERT INTO users (email, password, first_name, last_name, phone_number, img)
VALUES ('admin@admin.com', '$2b$10$O/IWDT0xR5W8kNGqYCwgLe38EsZ/06D60eVy5VriM5Dru26cuRAga', 'Admin', 'User', '1234567890', 'admin_image.jpg');

INSERT INTO addresses (address_id, default_address, user_id, street, city, state, postal_code, country)
VALUES (1, TRUE, 1, 'Calle 1', 'Ciudad', 'Estado', '12345', 'España');

INSERT INTO users_roles (user_id, role_id)
VALUES (1, 1);
INSERT INTO users_roles (user_id, role_id) 
VALUES (1, 2);

INSERT INTO categories (category_name, img, active)
VALUES ('Electronics', 'electronics.jpg', TRUE),
       ('Licenses', 'licenses.jpg', TRUE);

INSERT INTO product_options (product_options_name, active, color, size, storage, devices)
VALUES ('Smartphone', TRUE, TRUE, FALSE, TRUE, FALSE),
       ('Antivirus', TRUE, FALSE, FALSE, FALSE, TRUE);

INSERT INTO products (category_id, product_options_id, product_name, description, price, stock, img, active)
VALUES 
    (1, 1, 'Smartphone', 'Latest model smartphone', 700, 100, 'smartphone.jpg', TRUE),
    (2, 2, 'ESET!', 'Antivirus premium', 300, 100, 'eset.jpg', TRUE);

INSERT INTO product_details (product_id, details_name, description, price, quantity, color, size, active, devices)
VALUES 
    (1, 'Smartphone - Black', 'Black color, 64GB storage', 700, 100, 'Black', '64GB', TRUE, null),
    (2, 'ESET 1 YEAR', '1 year / Multiple devices', 300, 100, null, null, TRUE, '5 devices');
