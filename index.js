/* For reading users's input */
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/* Variables to store data */
const products = [];
const warehouses = [];
const orders = [];

/* Function to display all the options */
function showOptions() {
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
  console.log('++     Product Inventory Management          ++');
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++');
  console.log('1. ADD PRODUCT');
  console.log('2. ADD WAREHOUSE');
  console.log('3. ADD STOCK');
  console.log('4. LIST PRODUCTS');
  console.log('5. LIST WAREHOUSES');
  console.log('6. WAREHOUSE INFO');
  console.log('7. PLACE ORDER');
  console.log('8. VIEW ORDERS');
  console.log('9. EXIT');
  console.log('+++++++++++++++++++++++++++++++++++++++++++++++');

  rl.question('Enter your choice (1-10): ', (choice) => {
    switch (choice) {
      case '1':
        addProduct();       break;
      case '2':
        addWarehouse();     break;
      case '3':
        addStock();         break;
      case '4':
        listProducts();     break;
      case '5':
        listWarehouses();   break;
      case '6':
        warehouseInfo();    break;
      case '7':
        processOrder();     break;
      case '8':
        viewOrders();       break;
      case '9':
        rl.close();         break;
      default:
        console.log('Invalid choice. Please try again.\n');
        showOptions();      break;
    }
  });
}
/* Function to add a product */
function addProduct() {
  rl.question('Enter the product name: ', (name) => {
    rl.question('Enter the SKU: ', (sku) => {
      rl.question('Enter the category (optional): ', (category) => {
        rl.question('Enter the sub-category (optional): ', (subCategory) => {
          rl.question('Enter the image link (optional): ', (imageLink) => {
            try {
              // Check if SKU is unique
              const existingProduct = products.find((product) => product.sku === sku);
              if (existingProduct) {
                console.log('SKU already exists. Please provide a unique SKU.\n');
                showOptions();
                return;
              }

              const product = {
                name: name.trim(),
                sku: sku.trim(),
                category: category.trim() || '',
                subCategory: subCategory.trim() || '',
                imageLink: imageLink.trim() || '',
              };

              products.push(product);
              console.log('Product added successfully!\n');
              showOptions();
            } catch(error) {
              console.log(`Error: ${error.message}\n`);
              showOptions();
            }
          });
        });
      });
    });
  });
}
/* Function to add a warehouse */
function addWarehouse() {
  rl.question('Enter the warehouse number (6-digit, state ID): ', (warehouseNumber) => {
    rl.question('Enter the warehouse name: ', (warehouseName) => {
      rl.question('Enter the state: ', (state) => {
        rl.question('Enter the location (latitude, longitude) (optional): ', (location) => {
          rl.question('Enter the stock limit (optional): ', (stockLimit) => {
            try {
              // Check if warehouse number is unique
              const existingWarehouse = warehouses.find((warehouse) => warehouse.warehouseNumber === warehouseNumber);
              if (existingWarehouse) {
                console.log('Warehouse number already exists. Please provide a unique warehouse number.\n');
                showOptions();
                return;
              }
              const warehouse = {
                warehouseNumber: warehouseNumber.trim(),
                warehouseName: warehouseName.trim(),
                state: state.trim(),
                location: location ? parseLocation(location) : { lat: '', long: '' },
                stockLimit: stockLimit ? parseInt(stockLimit) : Infinity,
                stock: [],
              };
              warehouses.push(warehouse);
              console.log('Warehouse added successfully!\n');
              showOptions();
            } catch(error) {
              console.log(`Error: ${error.message}\n`);
              showOptions();
            }
          });
        });
      });
    });
  });
}
function parseLocation(location) {
  const [lat, long] = location.split(',').map((coord) => parseFloat(coord));
  return { lat, long };
}
/* Function to add Stock */
function addStock() {
  rl.question('Enter the SKU: ', (sku) => {
    // Check if SKU exists in the product catalog
    const product = products.find((product) => product.sku === sku);
    if (!product) {
      console.log('SKU does not exist in the product catalog.\n');
      showOptions();
      return;
    }
    rl.question('Enter the warehouse number: ', (warehouseNumber) => {
      // Check if warehouse exists
      const warehouse = warehouses.find((warehouse) => warehouse.warehouseNumber === warehouseNumber);
      if (!warehouse) {
        console.log('Warehouse does not exist.\n');
        showOptions();
        return;
      }
      rl.question('Enter the quantity: ', (qty) => {
        const parsedQty = parseInt(qty);
        // Check if stock limit will be exceeded
        if (parsedQty > warehouse.stockLimit) {
          console.log('Stock limit will be exceeded by this shipment. Shipping enough products to fulfill the stock limit.\n');
        }
        // Add the stock to the warehouse
        const stock = {
          sku,
          qty: parsedQty,
        };
        warehouse.stock.push(stock);
        console.log('Stock added successfully!\n');
        showOptions();
      });
    });
  });
}
/* Function to get quantity of product */
function getProductQuantity(sku) {
  let totalQuantity = 0;
  warehouses.forEach((warehouse) => {
    const stock = warehouse.stock.find((stock) => stock.sku === sku);
    if (stock) {
      totalQuantity += stock.qty;
    }
  });
  return totalQuantity;
}
/* Function to display list of product */
function listProducts() {
  console.log('------ Product List ------');
  products.forEach((product) => {
    const warehousesWithStock = warehouses.filter((warehouse) => {
      const stock = warehouse.stock.find((stock) => stock.sku === product.sku);
      return stock && stock.qty > 0;
    });

    console.log(`Product Name: ${product.name}`);
    console.log(`SKU: ${product.sku}`);
    console.log(`Current Stock Quantity: ${getProductQuantity(product.sku)}`);
    console.log('In Stock Warehouses:');
    warehousesWithStock.forEach((warehouse) => {
      const stock = warehouse.stock.find((stock) => stock.sku === product.sku);
      console.log(`- Warehouse Number: ${warehouse.warehouseNumber}, Quantity: ${stock.qty}`);
    });
    console.log('--------------------------\n');
  });

  showOptions();
}
/* Function to display warehouses */
function listWarehouses() {
  console.log('------ Warehouses ------');
  warehouses.forEach((warehouse) => {
    console.log(`Warehouse Number: ${warehouse.warehouseNumber}`);
    console.log(`State: ${warehouse.state}`);
    console.log(`Location: (${warehouse.location.lat}, ${warehouse.location.long})`);
    console.log('-------------------------\n');
  });

  showOptions();
}
/* Function to show warehouse info */
function warehouseInfo() {
  rl.question('Enter the warehouse number: ', (warehouseNumber) => {
    const warehouse = warehouses.find((warehouse) => warehouse.warehouseNumber === warehouseNumber);

    if (!warehouse) {
      console.log('Warehouse not found.\n');
      showOptions();
      return;
    }
    console.log('------ Warehouse Information ------');
    console.log(`Warehouse Number: ${warehouse.warehouseNumber}`);
    console.log(`Warehouse Name: ${warehouse.warehouseName}`);
    console.log(`Available Storage: ${warehouse.stockLimit}`);
    console.log('Available SKUs:');
    warehouse.stock.forEach((stock) => {
      const product = products.find((product) => product.sku === stock.sku);
      console.log(`- SKU: ${stock.sku}, Product Name: ${product.name}, Quantity: ${stock.qty}`);
    });
    console.log('------------------------------------\n');
    showOptions();
  });
}
/* Function to place order*/
function processOrder() {
  rl.question('Enter the customer id: ', (customerId) => {
    rl.question('Enter the SKU: ', (sku) => {
      rl.question('Enter the order quantity: ', (orderQty) => {
        try {
          // Find the warehouse with the requested SKU and available stock
          const availableWarehouse = warehouses.find((warehouse) => {
            const stock = warehouse.stock.find((stock) => stock.sku === sku);
            return stock && stock.qty >= orderQty;
          });
          if (!availableWarehouse) {
            console.log('SKU is out of stock in all warehouses.\n');
            showOptions();
            return;
          }
          // Update the order fulfillment status
          const stock = availableWarehouse.stock.find((stock) => stock.sku === sku);
          const order = {
            customerId,
            sku,
            orderQty,
            fulfillmentStatus: 'Fulfilled',
            warehouseNumber: availableWarehouse.warehouseNumber,
          };
          orders.push(order);
          // Update the stock quantity in the warehouse
          stock.qty -= orderQty;

          console.log('Order processed successfully!\n');
          showOptions();
        } catch(error) {
          console.log(`Error: ${error.message}\n`);
          showOptions();
        }
      });
    });
  });
}
/* Function to display orders */
function viewOrders() {
  console.log('------ Orders ------');
  orders.forEach((order) => {
    console.log(`Customer ID: ${order.customerId}`);
    console.log(`SKU: ${order.sku}`);
    console.log(`Order Quantity: ${order.orderQty}`);
    console.log(`Fulfillment Status: ${order.fulfillmentStatus}`);
    console.log(`Linked Warehouse: ${order.warehouseNumber}`);
    console.log('---------------------\n');
  });

  showOptions();
}


showOptions();
