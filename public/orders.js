document.addEventListener('DOMContentLoaded', function () {
    // Assume this is the data fetched from the server
    const orders = [
      { order_id: 1, customer_id: 101, customer_email: 'customer1@example.com', product_id: 201, product_name: 'Product A', product_quantity: 2, product_price: 19.99, product_category: 'Electronics', purchased_date: '2023-01-01' },
      // Add more orders as needed
    ];
  
    // Function to render orders in the table
    function renderOrders() {
      const tableBody = document.getElementById('orderTableBody');
  
      // Clear existing rows
      tableBody.innerHTML = '';
  
      // Loop through orders and create table rows
      orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order.order_id}</td>
          <td>${order.customer_email}</td>
          <td>${order.product_name}</td>
          <td>${order.product_quantity}</td>
          <td>${order.product_price}</td>
          <td>${order.product_category}</td>
          <td>${order.purchased_date}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    // Call the function to render orders on page load
    renderOrders();
  });
  