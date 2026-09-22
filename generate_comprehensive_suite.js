const ExcelJS = require('exceljs');
const path = require('path');

async function generateComprehensiveSuite() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Senior QA Lead';
  workbook.created = new Date();

  // Color Palette - Enterprise Blue Theme
  const primaryHeaderColor = 'FF1F4E78'; // Dark Blue
  const loginHeaderColor = 'FF2E75B6';    // Medium Blue
  const cartHeaderColor = 'FF1B365D';     // Navy
  const passBgColor = 'FFE2EFDA';         // Soft green
  const passTextColor = 'FF385723';       // Dark green
  const automatedBgColor = 'FFDDEBF7';    // Soft blue
  const automatedTextColor = 'FF1B365D';  // Dark blue
  const bugBgColor = 'FFFCE4D6';          // Soft orange
  const bugTextColor = 'FFC65911';        // Dark orange

  const columns = [
    { header: 'TC ID', key: 'id', width: 16 },
    { header: 'Module', key: 'module', width: 18 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Test Type', key: 'type', width: 16 },
    { header: 'Test Case Title', key: 'title', width: 44 },
    { header: 'Pre-conditions', key: 'precond', width: 38 },
    { header: 'Test Data', key: 'testData', width: 36 },
    { header: 'Execution Steps', key: 'steps', width: 50 },
    { header: 'Expected Result', key: 'expected', width: 55 },
    { header: 'Automation Status', key: 'autoStatus', width: 20 },
    { header: 'Linked Spec / Notes', key: 'notes', width: 35 }
  ];

  // ==========================================
  // DATASETS
  // ==========================================
  const loginTestCases = [
    {
      id: 'TC-AUTH-001',
      module: 'Login & Auth',
      priority: 'P1 - High',
      type: 'Functional',
      title: 'Successful Login with Valid Registered Credentials',
      precond: '1. User is on DemoBlaze homepage.\n2. A valid registered user account exists in the database.\n3. User is currently logged out.',
      testData: 'Username: registered_user\nPassword: ValidPassword123!',
      steps: '1. Click "Log in" link on navbar (#login2).\n2. Wait for Login modal to appear (#logInModal).\n3. Enter valid username in "#loginusername".\n4. Enter valid password in "#loginpassword".\n5. Click "Log in" button.\n6. Wait for /login API response.',
      expected: '1. /login API returns 200 with Auth token.\n2. Login modal closes automatically.\n3. Navbar updates with "Welcome <username>" (#nameofuser).\n4. "Log in" and "Sign up" links are replaced with "Log out".',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-AUTH-002',
      module: 'Login & Auth',
      priority: 'P1 - High',
      type: 'Functional',
      title: 'Successful Logout and Session Termination',
      precond: '1. User is logged in successfully.\n2. "Welcome <username>" is visible on navbar.',
      testData: 'Session: Active logged-in user',
      steps: '1. Click "Log out" link on navbar (#logout2).\n2. Wait for page reload/state change.\n3. Observe navbar options.',
      expected: '1. User session is cleared from browser storage/cookies.\n2. "Welcome <username>" disappears.\n3. Navbar displays "Log in" and "Sign up" links again.',
      autoStatus: 'Manual / Candidate',
      notes: 'Standard authentication lifecycle verification'
    },
    {
      id: 'TC-AUTH-003',
      module: 'Login & Auth',
      priority: 'P1 - High',
      type: 'Negative',
      title: 'Login Attempt with Valid Username and Incorrect Password',
      precond: '1. User is on homepage.\n2. Valid registered user exists.',
      testData: 'Username: registered_user\nPassword: WrongPassword!#',
      steps: '1. Click "Log in" on navbar.\n2. Enter valid username.\n3. Enter incorrect password.\n4. Click "Log in" button.',
      expected: '1. Browser alert dialog appears with message: "Wrong password."\n2. Dialog can be dismissed.\n3. User is NOT authenticated, modal remains open.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-AUTH-004',
      module: 'Login & Auth',
      priority: 'P1 - High',
      type: 'Negative',
      title: 'Login Attempt with Non-Existent Username',
      precond: '1. User is on homepage.',
      testData: 'Username: non_existent_user_9999999\nPassword: AnyPassword123',
      steps: '1. Click "Log in" on navbar.\n2. Enter unregistered username.\n3. Enter any password.\n4. Click "Log in" button.',
      expected: '1. Browser alert dialog appears with message: "User does not exist."\n2. User remains unauthenticated.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-AUTH-005',
      module: 'Login & Auth',
      priority: 'P2 - Medium',
      type: 'Negative',
      title: 'Login Attempt with Both Fields Left Blank',
      precond: '1. User is on homepage.\n2. Login modal is open.',
      testData: 'Username: <empty>\nPassword: <empty>',
      steps: '1. Click "Log in" on navbar.\n2. Leave username and password empty.\n3. Click "Log in" button.',
      expected: '1. Browser alert dialog appears with message: "Please fill out Username and Password."\n2. No authentication call succeeds.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-AUTH-006',
      module: 'Login & Auth',
      priority: 'P2 - Medium',
      type: 'Negative',
      title: 'Login Attempt with Blank Username and Valid Password',
      precond: '1. User is on homepage.\n2. Login modal is open.',
      testData: 'Username: <empty>\nPassword: ValidPassword123!',
      steps: '1. Click "Log in" on navbar.\n2. Leave username empty.\n3. Enter valid password.\n4. Click "Log in" button.',
      expected: '1. Browser alert dialog appears with message: "Please fill out Username and Password."\n2. User remains logged out.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-AUTH-007',
      module: 'Login & Auth',
      priority: 'P2 - Medium',
      type: 'Negative',
      title: 'Login Attempt with Valid Username and Blank Password',
      precond: '1. User is on homepage.\n2. Login modal is open.',
      testData: 'Username: registered_user\nPassword: <empty>',
      steps: '1. Click "Log in" on navbar.\n2. Enter valid username.\n3. Leave password empty.\n4. Click "Log in" button.',
      expected: '1. Browser alert dialog appears with message: "Please fill out Username and Password."\n2. User remains logged out.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-AUTH-008',
      module: 'Login & Auth',
      priority: 'P2 - Medium',
      type: 'Security',
      title: 'Password Field Input Masking Verification',
      precond: '1. User is on homepage.\n2. Login modal is open.',
      testData: 'Password: SecretPassword123!',
      steps: '1. Open Login modal.\n2. Inspect "#loginpassword" input element.\n3. Enter password text.',
      expected: '1. Input element has type="password".\n2. Entered characters are masked (dots/asterisks) to prevent shoulder surfing.',
      autoStatus: 'Manual / Candidate',
      notes: 'Security compliance validation'
    },
    {
      id: 'TC-AUTH-009',
      module: 'Login & Auth',
      priority: 'P2 - Medium',
      type: 'Security',
      title: 'SQL Injection Resiliency on Login Credentials',
      precond: '1. User is on homepage.\n2. Login modal is open.',
      testData: "Username: ' OR '1'='1\nPassword: ' OR '1'='1",
      steps: '1. Open Login modal.\n2. Enter standard SQL injection payloads into both fields.\n3. Click "Log in" button.',
      expected: '1. Application securely handles input; does NOT authenticate as first DB user or crash.\n2. Returns standard "User does not exist" alert.',
      autoStatus: 'Manual / Candidate',
      notes: 'OWASP Top 10 injection resilience'
    },
    {
      id: 'TC-AUTH-010',
      module: 'Login & Auth',
      priority: 'P3 - Low',
      type: 'Boundary / Edge',
      title: 'Login with Excessively Long Credentials (> 255 chars)',
      precond: '1. User is on homepage.\n2. Login modal is open.',
      testData: 'Username: String of 300 "A" chars\nPassword: String of 300 "B" chars',
      steps: '1. Enter 300-character string into username & password.\n2. Click "Log in".',
      expected: '1. System rejects or safely handles string length without UI overflow or 500 Internal Server Error.',
      autoStatus: 'Manual / Candidate',
      notes: 'Buffer / boundary testing'
    },
    {
      id: 'TC-AUTH-011',
      module: 'Login & Auth',
      priority: 'P2 - Medium',
      type: 'API Contract',
      title: 'API POST /login - Validate Direct Endpoint Handling',
      precond: 'Direct HTTP request access to https://api.demoblaze.com',
      testData: 'Body: {"username":"nonexistent_user","password":"wrongpassword"}',
      steps: '1. Send HTTP POST to /login with invalid user payload.\n2. Validate HTTP status and JSON response body.',
      expected: '1. HTTP status code is 200.\n2. Response JSON contains { "errorMessage": "User does not exist." }.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/api/demoblaze_api.spec.ts'
    }
  ];

  const cartTestCases = [
    {
      id: 'TC-CART-001',
      module: 'Cart & Checkout',
      priority: 'P1 - High',
      type: 'Functional',
      title: 'Add Single Product to Cart and Complete Purchase',
      precond: '1. User is logged in with active account.\n2. Cart is initially empty.',
      testData: 'Product: Samsung galaxy s6 ($360)\nCheckout: Name="John Doe", Card="4111222233334444"',
      steps: '1. From catalog, click "Samsung galaxy s6".\n2. Click "Add to cart".\n3. Accept browser alert "Product added."\n4. Click "Cart" on navbar.\n5. Wait for /viewcart response.\n6. Click "Place Order".\n7. Fill Name & Credit Card.\n8. Click "Purchase".',
      expected: '1. SweetAlert modal appears showing green checkmark.\n2. Modal text confirms purchase with matching price "360 USD".\n3. Order ID and masked Credit Card are generated.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-CART-002',
      module: 'Cart & Checkout',
      priority: 'P1 - High',
      type: 'Functional',
      title: 'Add Multiple Distinct Products and Verify Cart Grand Total',
      precond: '1. User is logged in.\n2. Cart is initially empty.',
      testData: 'Product 1: Samsung galaxy s6 ($360)\nProduct 2: Nokia lumia 1520 ($820)\nExpected Total: $1180',
      steps: '1. Add "Samsung galaxy s6" to cart, accept alert.\n2. Return to home catalog.\n3. Add "Nokia lumia 1520" to cart, accept alert.\n4. Navigate to Cart page (#cartur).\n5. Verify items and total.',
      expected: '1. Cart table displays 2 distinct item rows.\n2. Row 1 shows Samsung galaxy s6 with price 360.\n3. Row 2 shows Nokia lumia 1520 with price 820.\n4. Grand total (#totalp) displays exactly "1180".',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze_cart_advanced.spec.ts (POM)'
    },
    {
      id: 'TC-CART-003',
      module: 'Cart & Checkout',
      priority: 'P1 - High',
      type: 'Functional',
      title: 'Remove an Item from Cart and Verify Dynamic Total Recalculation',
      precond: '1. User is logged in.\n2. Cart contains "Samsung galaxy s6" ($360).',
      testData: 'Product to delete: Samsung galaxy s6',
      steps: '1. Navigate to Cart page.\n2. Locate product row.\n3. Click "Delete" link next to product.\n4. Wait for item row to detach from DOM.',
      expected: '1. Deleted item row disappears from cart table.\n2. Cart total updates (decreases by $360) or becomes empty.\n3. No stale elements remain in table.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze_cart_advanced.spec.ts (POM)'
    },
    {
      id: 'TC-CART-004',
      module: 'Cart & Checkout',
      priority: 'P2 - Medium',
      type: 'Edge Case',
      title: 'Add Same Product Multiple Times (Duplicate Item Handling)',
      precond: '1. User is logged in.\n2. Cart is initially empty.',
      testData: 'Product: Samsung galaxy s6 ($360) x 2\nExpected Total: $720',
      steps: '1. Open product page for "Samsung galaxy s6".\n2. Click "Add to cart", accept alert.\n3. Click "Add to cart" second time without reloading, accept alert.\n4. Navigate to Cart page.',
      expected: '1. Cart table displays 2 distinct rows for "Samsung galaxy s6".\n2. Each row indicates price 360.\n3. Grand total sums to "720".',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze_cart_advanced.spec.ts (POM)'
    },
    {
      id: 'TC-CART-005',
      module: 'Cart & Checkout',
      priority: 'P2 - Medium',
      type: 'State Persistence',
      title: 'Cart State Persistence Across Page Navigation and Return',
      precond: '1. User is logged in.\n2. Product added to cart ($360).',
      testData: 'Product: Samsung galaxy s6 ($360)',
      steps: '1. Go to Cart, confirm item is listed.\n2. Click "Home" on navbar to navigate back to catalog.\n3. Browse catalog items.\n4. Click "Cart" on navbar to return.',
      expected: '1. Cart state persists across client-side router navigation.\n2. "Samsung galaxy s6" remains in cart.\n3. Grand total remains $360.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze_cart_advanced.spec.ts (POM)'
    },
    {
      id: 'TC-CART-006',
      module: 'Cart & Checkout',
      priority: 'P1 - High',
      type: 'Negative',
      title: 'Place Order Form Validation - Missing Mandatory "Name" Field',
      precond: '1. User is logged in.\n2. Cart contains at least 1 product.',
      testData: 'Name: <empty>\nCredit Card: "4111222233334444"',
      steps: '1. Open Cart.\n2. Click "Place Order" button.\n3. Leave "Name" field blank.\n4. Fill "Credit Card" field.\n5. Click "Purchase" button.',
      expected: '1. Purchase is rejected by frontend validation.\n2. Browser alert dialog appears: "Please fill out Name and Creditcard."\n3. Order is NOT submitted.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-CART-007',
      module: 'Cart & Checkout',
      priority: 'P1 - High',
      type: 'Negative',
      title: 'Place Order Form Validation - Missing Mandatory "Credit Card" Field',
      precond: '1. User is logged in.\n2. Cart contains at least 1 product.',
      testData: 'Name: "Jane Smith"\nCredit Card: <empty>',
      steps: '1. Open Cart.\n2. Click "Place Order" button.\n3. Fill "Name" field.\n4. Leave "Credit Card" field blank.\n5. Click "Purchase" button.',
      expected: '1. Purchase is rejected.\n2. Browser alert dialog appears: "Please fill out Name and Creditcard."\n3. Order is NOT created.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-CART-008',
      module: 'Cart & Checkout',
      priority: 'P2 - Medium',
      type: 'Negative',
      title: 'Place Order Form Validation - Both Name and Credit Card Missing',
      precond: '1. User is logged in.\n2. Cart contains at least 1 product.',
      testData: 'Name: <empty>\nCredit Card: <empty>',
      steps: '1. Open Cart.\n2. Click "Place Order".\n3. Leave both Name and Card empty.\n4. Click "Purchase".',
      expected: '1. Browser alert dialog displays: "Please fill out Name and Creditcard."\n2. Purchase modal remains open without placing order.',
      autoStatus: 'Manual / Candidate',
      notes: 'Boundary form validation'
    },
    {
      id: 'TC-CART-009',
      module: 'Cart & Checkout',
      priority: 'P1 - High',
      type: 'Edge Case / Bug Detection',
      title: 'Place Order with an Empty Cart (0 USD Checkout Bug)',
      precond: '1. User is logged in.\n2. Cart is completely empty (0 items, Total = $0).',
      testData: 'Cart Total: $0\nCheckout: Name="Test Buyer", Card="12345678"',
      steps: '1. Navigate to Cart.\n2. Confirm table is empty and total is 0.\n3. Click "Place Order".\n4. Fill Name and Credit Card.\n5. Click "Purchase".',
      expected: 'Expected Business Rule: Purchase button should be disabled or an alert should notify "Cart is empty".\nActual SUT Behavior: DemoBlaze allows 0 USD purchase (Logged as Bug via test.fail).',
      autoStatus: 'Automated (Known Bug)',
      notes: 'Marked with test.fail() in tests/ui/demoblaze.spec.ts'
    },
    {
      id: 'TC-CART-010',
      module: 'Cart & Checkout',
      priority: 'P2 - Medium',
      type: 'State Persistence',
      title: 'Cart State Persistence on Browser Page Reload (F5)',
      precond: '1. User is logged in.\n2. Cart contains 1 product ($360).',
      testData: 'Product: Samsung galaxy s6',
      steps: '1. In Cart page, verify product row.\n2. Trigger hard browser page reload (F5 / page.reload()).\n3. Wait for DOM and /viewcart API response.',
      expected: '1. Cart page reloads cleanly.\n2. Product row and grand total ($360) are preserved from backend session.',
      autoStatus: 'Manual / Candidate',
      notes: 'Session durability verification'
    },
    {
      id: 'TC-CART-011',
      module: 'Cart & Checkout',
      priority: 'P2 - Medium',
      type: 'Functional',
      title: 'Cancel / Close Checkout Modal Without Submitting Order',
      precond: '1. User is in Cart with 1 product.\n2. "Place Order" modal is open.',
      testData: 'Form fields partially filled',
      steps: '1. Click "Close" button (#orderModal button:has-text("Close")) or "x".\n2. Observe modal and cart state.',
      expected: '1. Order modal closes.\n2. Cart contents remain unchanged.\n3. No transaction or order receipt is generated.',
      autoStatus: 'Manual / Candidate',
      notes: 'Modal dismissal behavior'
    },
    {
      id: 'TC-CART-012',
      module: 'Cart & Checkout',
      priority: 'P1 - High',
      type: 'API Contract',
      title: 'API GET /entries - Verify Catalog Products Data Integrity',
      precond: 'Direct API request to https://api.demoblaze.com/entries',
      testData: 'Endpoint: /entries',
      steps: '1. Execute GET /entries.\n2. Verify HTTP response status.\n3. Validate schema: Items array contains title, price, id, desc.',
      expected: '1. HTTP status code is 200.\n2. Items array is not empty (> 0 items).\n3. Every product object has string title and numeric/string price.',
      autoStatus: 'Automated (Passed)',
      notes: 'Covered in tests/api/demoblaze_api.spec.ts'
    }
  ];

  // Helper to format table
  function applyTableFormatting(worksheet, startRow, rowCount) {
    for (let i = startRow; i < startRow + rowCount; i++) {
      const row = worksheet.getRow(i);
      row.height = 32;
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
          right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
        };

        // TC ID Bold
        if (colNumber === 1) cell.font = { bold: true, color: { argb: 'FF1F4E78' } };

        // Priority Badge
        if (colNumber === 3) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          if (cell.value && cell.value.includes('P1')) {
            cell.font = { bold: true, color: { argb: 'FFC00000' } }; // Red
          } else if (cell.value && cell.value.includes('P2')) {
            cell.font = { color: { argb: 'FFED7D31' } }; // Orange
          }
        }

        // Test Type Center
        if (colNumber === 4) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }

        // Automation Status Badges
        if (colNumber === 10) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
          if (cell.value === 'Automated (Passed)') {
            cell.font = { bold: true, color: { argb: passTextColor } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: passBgColor } };
          } else if (cell.value.includes('Known Bug')) {
            cell.font = { bold: true, color: { argb: bugTextColor } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bugBgColor } };
          } else {
            cell.font = { color: { argb: 'FF595959' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
          }
        }
      });
    }
  }

  // Helper to format headers
  function styleHeaderRow(row, bgColor) {
    row.height = 28;
    row.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
      cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF0D233A' } },
        bottom: { style: 'medium', color: { argb: 'FF0D233A' } },
        left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
        right: { style: 'thin', color: { argb: 'FFFFFFFF' } }
      };
    });
  }

  // ==========================================
  // SHEET 1: EXECUTIVE DASHBOARD
  // ==========================================
  const dashSheet = workbook.addWorksheet('Executive Dashboard', {
    views: [{ showGridLines: true }]
  });
  dashSheet.columns = [
    { width: 4 }, { width: 28 }, { width: 18 }, { width: 18 }, { width: 22 }, { width: 22 }
  ];

  // Title
  dashSheet.mergeCells('B2:F2');
  const titleCell = dashSheet.getCell('B2');
  titleCell.value = 'DEMOBLAZE TEST AUTOMATION & QA SUITE DASHBOARD';
  titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: primaryHeaderColor } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  dashSheet.getRow(2).height = 36;

  // Subtitle
  dashSheet.mergeCells('B3:F3');
  const subCell = dashSheet.getCell('B3');
  subCell.value = 'Master Test Case Suite for Login & Cart Modules | Framework: Playwright TypeScript';
  subCell.font = { size: 11, italic: true, color: { argb: 'FF595959' } };
  subCell.alignment = { vertical: 'middle', horizontal: 'center' };
  dashSheet.getRow(3).height = 20;

  // Metric Cards
  const cards = [
    { cell: 'B5', label: 'TOTAL TEST CASES', val: 23, color: 'FF1F4E78' },
    { cell: 'C5', label: 'LOGIN MODULE', val: 11, color: 'FF2E75B6' },
    { cell: 'D5', label: 'CART & CHECKOUT', val: 12, color: 'FF1B365D' },
    { cell: 'E5', label: 'AUTOMATED TESTS', val: 14, color: 'FF385723' },
    { cell: 'F5', label: 'AUTOMATION COVERAGE', val: '61%', color: 'FF70AD47' }
  ];

  cards.forEach(c => {
    const cell = dashSheet.getCell(c.cell);
    cell.value = `${c.label}\n\n${c.val}`;
    cell.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: c.color } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'medium' }, bottom: { style: 'medium' },
      left: { style: 'medium' }, right: { style: 'medium' }
    };
  });
  dashSheet.getRow(5).height = 55;

  // Breakdown Table
  dashSheet.mergeCells('B7:E7');
  const tblHeader = dashSheet.getCell('B7');
  tblHeader.value = 'Summary Breakdown by Module & Execution Status';
  tblHeader.font = { bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
  tblHeader.fill = { type: 'pattern', pattern: 'solid', fgColor: primaryHeaderColor };
  tblHeader.alignment = { vertical: 'middle', horizontal: 'left' };
  dashSheet.getRow(7).height = 26;

  const summaryData = [
    ['Category', 'Total Cases', 'Automated (Passed)', 'Known Bug', 'Manual / Exploratory'],
    ['Login & Authentication', 11, 7, 0, 4],
    ['Cart & Checkout', 12, 6, 1, 5],
    ['Total', 23, 13, 1, 9]
  ];

  summaryData.forEach((rowVals, idx) => {
    const rNum = 8 + idx;
    const r = dashSheet.getRow(rNum);
    r.height = 24;
    rowVals.forEach((val, cIdx) => {
      const colLetter = ['B', 'C', 'D', 'E', 'F'][cIdx];
      const c = dashSheet.getCell(`${colLetter}${rNum}`);
      c.value = val;
      c.alignment = { vertical: 'middle', horizontal: cIdx === 0 ? 'left' : 'center' };
      c.border = {
        top: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right: { style: 'thin', color: { argb: 'FFD9D9D9' } }
      };
      if (idx === 0) {
        c.font = { bold: true };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
      } else if (idx === summaryData.length - 1) {
        c.font = { bold: true };
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
      }
    });
  });

  // ==========================================
  // SHEET 2: ALL TEST CASES (MASTER SHEET)
  // ==========================================
  const allSheet = workbook.addWorksheet('All Test Cases (Master)', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });
  allSheet.columns = columns;
  styleHeaderRow(allSheet.getRow(1), primaryHeaderColor);
  allSheet.addRows([...loginTestCases, ...cartTestCases]);
  applyTableFormatting(allSheet, 2, loginTestCases.length + cartTestCases.length);

  // ==========================================
  // SHEET 3: LOGIN MODULE
  // ==========================================
  const loginSheet = workbook.addWorksheet('Login & Authentication', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });
  loginSheet.columns = columns;
  styleHeaderRow(loginSheet.getRow(1), loginHeaderColor);
  loginSheet.addRows(loginTestCases);
  applyTableFormatting(loginSheet, 2, loginTestCases.length);

  // ==========================================
  // SHEET 4: CART MODULE
  // ==========================================
  const cartSheet = workbook.addWorksheet('Cart & Checkout', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
  });
  cartSheet.columns = columns;
  styleHeaderRow(cartSheet.getRow(1), cartHeaderColor);
  cartSheet.addRows(cartTestCases);
  applyTableFormatting(cartSheet, 2, cartTestCases.length);

  // Write file
  const outputPath = path.join(__dirname, 'TestCases_DemoBlaze_Comprehensive_Suite.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Excel file successfully generated at: ${outputPath}`);
}

generateComprehensiveSuite().catch(console.error);
