const ExcelJS = require('exceljs');

async function createAdvancedExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Advanced Cart Scenarios');

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

  // Apply styling to header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF0070C0' } // Professional blue header
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });

  // Data for the 4 advanced scenarios
  const rows = [
    { 
      id: 'TC-CART-ADV-001', scenario: 'Cart Functional', type: 'Functional', name: 'Add multiple products to the cart', 
      precond: '- User is logged in.\n- Cart is initially empty.', 
      testData: 'Product 1: Samsung galaxy s6 ($360)\nProduct 2: Nokia lumia 1520 ($820)', 
      steps: '1. Click Product 1\n2. Click Add to cart and accept alert\n3. Go Home\n4. Click Product 2\n5. Click Add to cart and accept alert\n6. Go to Cart', 
      expected: '1. Product 1 appears with price $360.\n2. Product 2 appears with price $820.\n3. Cart total is correctly calculated as $1180.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-CART-ADV-002', scenario: 'Cart Functional', type: 'Functional', name: 'Remove a product from the cart', 
      precond: '- User is logged in.\n- Product A is already in cart.', 
      testData: 'Product: Samsung galaxy s6 ($360)', 
      steps: '1. Go to Cart\n2. Identify Product A row\n3. Click Delete button\n4. Wait for item to detach', 
      expected: '1. Product A row is no longer visible in the cart table.\n2. Cart total decreases/updates accordingly.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-CART-ADV-003', scenario: 'Cart Edge Cases', type: 'Edge Case', name: 'Add the same product multiple times', 
      precond: '- User is logged in.\n- Cart is initially empty.', 
      testData: 'Product: Samsung galaxy s6 ($360)', 
      steps: '1. Click Product A\n2. Click Add to cart and accept alert\n3. Without leaving page, click Add to cart again and accept alert\n4. Go to Cart', 
      expected: '1. Two duplicate rows for Product A exist in the cart.\n2. Both rows display price $360.\n3. Cart total correctly sums up to $720.', 
      status: 'PASS' 
    },
    { 
      id: 'TC-CART-ADV-004', scenario: 'Cart Edge Cases', type: 'Edge Case', name: 'Cart remains after navigation', 
      precond: '- User is logged in.\n- Product A is already in cart.', 
      testData: 'Product: Samsung galaxy s6 ($360)', 
      steps: '1. Go to Cart and verify Product A is present\n2. Navigate away to Home page\n3. Return to Cart page', 
      expected: '1. Product A is still present in the cart.\n2. Cart total remains accurate ($360) (State persists).', 
      status: 'PASS' 
    }
  ];

  // Add rows and format them
  rows.forEach((row) => {
    const addedRow = worksheet.addRow(row);
    
    // Style each cell in the row
    addedRow.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };
      
      // Text wrapping for long columns
      if ([5, 6, 7, 8].includes(colNumber)) {
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      } else {
        cell.alignment = { vertical: 'top', horizontal: 'left' };
      }

      // Bold TC ID
      if (colNumber === 1) {
          cell.font = { bold: true };
      }
      
      // Status column (9) - Color it Green
      if (colNumber === 9) {
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        if (cell.value === 'PASS') {
            cell.font = { color: { argb: 'FF00B050' }, bold: true }; // Green text
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } }; // Light green background
        }
      }
    });
  });

  await workbook.xlsx.writeFile('TestCases_DemoBlaze_Advanced_Cart_Report.xlsx');
  console.log('Advanced Cart Excel file created successfully!');
}

createAdvancedExcel();
