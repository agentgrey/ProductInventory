# PRODUCT INVENTORY MANAGEMENT

Product Inventory Management is a command-line application for managing product inventory, warehouses, and placing orders. It allows users to add products, warehouses, and stock, as well as view and process orders.

## INSTALLATION

Clone this repository using the following command:
```
$ git clone https://github.com/agentgrey/ProductInventory.git
```
Install the required dependencies using the following command:
```
$ npm install 
```
Start the application using the following command:
```
$ npm start 
```
## COMMANDS
The following commands are available in the application:
 1. **ADD PRODUCT** - Add a new product to the catalog.
 2. **ADD WAREHOUSE** - Add a new warehouse to store products.
 3. **ADD STOCK** - Add stock to a warehouse for a specific product.
 4.  **LIST PRODUCTS** - List all products in the catalog along with their stock information.
 5. **LIST WAREHOUSES** - List all warehouses and their details.
 6. **WAREHOUSE INFO** - View detailed information about a specific warehouse.
 7. **PLACE ORDER** - Place an order for a specific product.
 8. **VIEW ORDERS** - View all placed orders and their details.
 9. **EXIT** - Exit the application.

## EXAMPLE SESSION
  '->' shows Enter
  - Add a product
    - 1 -> Pen -> XYZ12345 -> Stationery -> Ball Point -> [image link]
    - 1 -> Jacket -> ABC5678 -> Clothing -> Women -> [image link]
  - Add a warehouse
    - 2 -> 1234OD -> Warehouse 1 -> Odisha -> 20, 84 -> 3000
    - 2 -> 2345PB -> New Warehouse -> Punjab -> 31, 75 ->10000
  - Add stock
    - 3 -> XYZ12345 -> 1234OD -> 1000
  - Warehouse Info
    - 6 -> 1234OD
    - 6 -> 2345PB
  - Place Order
     - 7 -> 271400 -> ABC5678 -> 100
  
### Database Schema
Table: Products
- id (Primary Key)
- name (Text)
- sku (Text)
- category (Text)
- subCategory (Text)
- imageLink (Text)

 Table: Warehouse
 - id (Primary Key)
 - number (Text)
 - name (Text)
 - state (Text)
 - location (Text)
 - stock limit (integer)

Table: Orders
- id (Primary Key)
- customerId (Text)
- productId (Foreign Key)
- orderQty (Integer)
- fulfillmentStatus (Text)
