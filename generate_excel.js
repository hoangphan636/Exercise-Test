const ExcelJS = require('exceljs');

async function createExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test Cases', {views:[{state: 'frozen', xSplit: 0, ySplit: 1}]});

  // Define columns
  worksheet.columns = [
    { header: 'TC ID', key: 'id', width: 15 },
    { header: 'Scenario Category', key: 'scenario', width: 25 },
    { header: 'Test Type', key: 'type', width: 15 },
    { header: 'Test Case Name', key: 'name', width: 45 },
    { header: 'Pre-conditions', key: 'precond', width: 35 },
    { header: 'Test Data', key: 'testData', width: 35 },
    { header: 'Steps', key: 'steps', width: 45 },
    { header: 'Expected Results', key: 'expected', width: 55 },
    { header: 'Status', key: 'status', width: 15 }
  ];

  // Style Header
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12 };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = { top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'thin'}, right: {style:'thin'} };
  });
  headerRow.height = 30;

  // Data based on Principal QA Feedback
  const rows = [
    { 
      id: 'TC-LOGIN-001', scenario: 'Authentication', type: 'Functional', name: 'Successful Login with Valid Credentials', 
      precond: '- User is on homepage.\n- A valid registered account exists.\n- User is not currently logged in.', 
      testData: 'username: valid_user\npassword: ValidPass123!', 
      steps: '1. Click Log in link\n2. Enter valid username\n3. Enter valid password\n4. Click Log in button', 
      expected: '1. Login modal is closed.\n2. User is authenticated successfully.\n3. "Welcome [username]" is displayed on the navbar.\n4. Login option is replaced/updated accordingly.\n5. User remains on the expected page.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-LOGIN-002', scenario: 'Authentication', type: 'Negative', name: 'Login with Invalid Password', 
      precond: '- User is on homepage.\n- A valid registered account exists.', 
      testData: 'username: valid_user\npassword: WrongPass123!', 
      steps: '1. Click Log in link\n2. Enter valid username\n3. Enter invalid password\n4. Click Log in button', 
      expected: '1. Authentication fails.\n2. Validation message "Wrong password." is displayed.\n3. Login modal remains open / user remains logged out.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-LOGIN-003', scenario: 'Authentication', type: 'Negative', name: 'Login with Non-existent User', 
      precond: '- User is on homepage.', 
      testData: 'username: nonexist_user\npassword: AnyPassword!', 
      steps: '1. Click Log in link\n2. Enter non-existent username\n3. Enter any password\n4. Click Log in button', 
      expected: '1. Authentication fails.\n2. Validation message "User does not exist." is displayed.\n3. User remains logged out.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-LOGIN-004', scenario: 'Login Field Validation', type: 'Negative', name: 'Login with both fields empty', 
      precond: '- User is on homepage.', 
      testData: 'username: <empty>\npassword: <empty>', 
      steps: '1. Click Log in link\n2. Leave username and password empty\n3. Click Log in button', 
      expected: '1. Validation message "Please fill out Username and Password." is displayed.\n2. User remains logged out.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-LOGIN-005', scenario: 'Login Field Validation', type: 'Negative', name: 'Login with empty username', 
      precond: '- User is on homepage.', 
      testData: 'username: <empty>\npassword: ValidPass123!', 
      steps: '1. Click Log in link\n2. Leave username empty\n3. Enter valid password\n4. Click Log in button', 
      expected: '1. Validation message "Please fill out Username." is displayed.\n2. User remains logged out.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-LOGIN-006', scenario: 'Login Field Validation', type: 'Negative', name: 'Login with empty password', 
      precond: '- User is on homepage.', 
      testData: 'username: valid_user\npassword: <empty>', 
      steps: '1. Click Log in link\n2. Enter valid username\n3. Leave password empty\n4. Click Log in button', 
      expected: '1. Validation message "Please fill out Password." is displayed.\n2. User remains logged out.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-CART-001', scenario: 'Cart & Order Functional', type: 'Functional', name: 'Add Single Product and Place Order Successfully', 
      precond: '- User is logged in successfully.\n- Cart is initially empty.\n- At least one active product is available.', 
      testData: 'Product: Samsung galaxy s6\nPrice: $360\nQty: 1\nForm: Name="John", Card="1234"', 
      steps: '1. Click on product\n2. Click Add to cart\n3. Accept browser alert\n4. Go to Cart\n5. Click Place Order\n6. Fill all required fields\n7. Click Purchase', 
      expected: '1. Order is submitted successfully in the backend.\n2. Purchase confirmation dialog appears.\n3. Total amount equals expected cart total (e.g. Sum of Product Price x Quantity).\n4. Purchased product information is correct.\n5. No incorrect/duplicate item is included.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-CART-002', scenario: 'Order Validation', type: 'Negative', name: 'Place Order with Missing Name Field', 
      precond: '- User is logged in.\n- Cart has 1 product.', 
      testData: 'Name: <empty>\nCard: "12345678"', 
      steps: '1. Go to Cart\n2. Click Place Order\n3. Leave Name empty\n4. Fill Credit Card\n5. Click Purchase', 
      expected: '1. Order submission is blocked.\n2. Validation message "Please fill out Name and Creditcard." is displayed.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-CART-003', scenario: 'Order Validation', type: 'Negative', name: 'Place Order with Missing Credit Card Field', 
      precond: '- User is logged in.\n- Cart has 1 product.', 
      testData: 'Name: "John Doe"\nCard: <empty>', 
      steps: '1. Go to Cart\n2. Click Place Order\n3. Fill Name\n4. Leave Credit Card empty\n5. Click Purchase', 
      expected: '1. Order submission is blocked.\n2. Validation message "Please fill out Name and Creditcard." is displayed.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-CART-004', scenario: 'Cart Business Rules', type: 'Edge Case', name: 'Place Order with an Empty Cart', 
      precond: '- User is logged in.\n- Cart is empty.', 
      testData: 'Cart items: 0\nCart Total: $0', 
      steps: '1. Go to Cart\n2. Ensure table is empty\n3. Click Place Order\n4. Fill all fields\n5. Click Purchase', 
      expected: '1. Place Order operation is blocked.\n2. No order is created.\n3. Validation message (e.g., "Cart is empty") is displayed.\n*(Note: DemoBlaze currently allows this, which is a BUG per business rules)*', 
      status: 'PASS' 
    }
  ];

  worksheet.addRows(rows);

  // Style data rows
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.eachCell((cell, colNumber) => {
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      cell.border = { top: {style:'thin', color: {argb:'FFDDDDDD'}}, left: {style:'thin', color: {argb:'FFDDDDDD'}}, bottom: {style:'thin', color: {argb:'FFDDDDDD'}}, right: {style:'thin', color: {argb:'FFDDDDDD'}} };
      
      // TC ID
      if (colNumber === 1) {
          cell.font = { bold: true };
      }
      
      // Status column (9)
      if (colNumber === 9) {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        if (cell.value === 'PASS') {
            cell.font = { color: { argb: 'FF00B050' }, bold: true }; // Green text for PASS
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } }; // Light green background
        }
      }
    });
  });

  await workbook.xlsx.writeFile('TestCases_DemoBlaze_Execution_Report.xlsx');
  console.log('Principal QA standard Excel file created successfully!');
}

createExcel().catch(err => console.error(err));
