const ExcelJS = require('exceljs');

async function createFinalExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Master Execution Report');

  // Define columns
  worksheet.columns = [
    { header: 'TC ID', key: 'id', width: 15 },
    { header: 'Scenario Category', key: 'scenario', width: 25 },
    { header: 'Test Type', key: 'type', width: 15 },
    { header: 'Test Case Name', key: 'name', width: 45 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Framework Module', key: 'module', width: 25 },
    { header: 'Notes', key: 'notes', width: 40 }
  ];

  // Apply styling to header
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F4E78' } // Dark blue header
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin' }, left: { style: 'thin' },
      bottom: { style: 'thin' }, right: { style: 'thin' }
    };
  });

  const rows = [
    // Authentication
    { id: 'TC-LOGIN-001', scenario: 'Authentication', type: 'Functional', name: 'Successful Login with Valid Credentials', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Automated via Playwright' },
    { id: 'TC-LOGIN-002', scenario: 'Authentication', type: 'Negative', name: 'Login with Invalid Password', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Alert verified' },
    { id: 'TC-LOGIN-003', scenario: 'Authentication', type: 'Negative', name: 'Login with Non-existent User', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Alert verified' },
    { id: 'TC-LOGIN-004', scenario: 'Authentication', type: 'Negative', name: 'Login with both fields empty', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Alert verified' },
    { id: 'TC-LOGIN-005', scenario: 'Authentication', type: 'Negative', name: 'Login with empty username, valid password', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Alert verified' },
    { id: 'TC-LOGIN-006', scenario: 'Authentication', type: 'Negative', name: 'Login with valid username, empty password', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Alert verified' },
    
    // Original Cart
    { id: 'TC-CART-001', scenario: 'Cart & Checkout', type: 'Functional', name: 'Add Single Product and Place Order Successfully', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Automated via Playwright' },
    { id: 'TC-CART-002', scenario: 'Cart & Checkout', type: 'Negative', name: 'Place Order with Missing Name Field', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Form validation checked' },
    { id: 'TC-CART-003', scenario: 'Cart & Checkout', type: 'Negative', name: 'Place Order with Missing Credit Card Field', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Form validation checked' },
    { id: 'TC-CART-004', scenario: 'Cart & Checkout', type: 'Edge Case', name: 'Place Order with an Empty Cart', status: 'PASS', module: 'ui/demoblaze.spec.ts', notes: 'Known bug handled' },
    
    // Advanced Cart (POM)
    { id: 'TC-CART-ADV-001', scenario: 'Advanced Cart', type: 'Functional', name: 'Add multiple products to the cart', status: 'PASS', module: 'ui/demoblaze_cart_advanced.spec.ts', notes: 'POM Refactored' },
    { id: 'TC-CART-ADV-002', scenario: 'Advanced Cart', type: 'Functional', name: 'Remove a product from the cart', status: 'PASS', module: 'ui/demoblaze_cart_advanced.spec.ts', notes: 'POM Refactored' },
    { id: 'TC-CART-ADV-003', scenario: 'Advanced Cart', type: 'Edge Case', name: 'Add the same product multiple times', status: 'PASS', module: 'ui/demoblaze_cart_advanced.spec.ts', notes: 'POM Refactored' },
    { id: 'TC-CART-ADV-004', scenario: 'Advanced Cart', type: 'Edge Case', name: 'Cart remains after navigation', status: 'PASS', module: 'ui/demoblaze_cart_advanced.spec.ts', notes: 'POM Refactored' }
  ];

  rows.forEach((row, index) => {
    const addedRow = worksheet.addRow(row);
    
    // Zebra striping for better readability
    if (index % 2 === 0) {
        addedRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
    }
    
    addedRow.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };
      
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

      if (colNumber === 1) cell.font = { bold: true };
      
      // Status column (5) - Color it Green
      if (colNumber === 5) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        if (cell.value === 'PASS') {
            cell.font = { color: { argb: 'FF00B050' }, bold: true }; 
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } }; 
        }
      }
    });
  });

  await workbook.xlsx.writeFile('TestCases_DemoBlaze_Master_Report.xlsx');
  console.log('Master Excel Report generated successfully!');
}

createFinalExcel();
