# 🚀 DemoBlaze Automation Framework

A robust, enterprise-grade test automation framework built with [Playwright](https://playwright.dev/) and TypeScript for the [DemoBlaze](https://www.demoblaze.com/) e-commerce web platform.

---

## 🏗️ Framework Structure & Rationale

### 1. Project Directory Structure

```text
Exercise-Test/
├── playwright-framework/                   # Core Playwright automation suite
│   ├── .github/workflows/
│   │   └── playwright.yml                  # GitHub Actions CI workflow
│   ├── page-objects/                       # Page Object Model (POM) layer
│   │   ├── base.page.ts                    # Shared base page behaviors & common helpers
│   │   ├── HomePage.ts                     # Encapsulated locators & actions for Home & Navigation
│   │   ├── CartPage.ts                     # Locators & actions for Cart, Orders & SweetAlert modal
│   │   └── home.page.ts                    # Modular home page utilities
│   ├── tests/                              # Categorized test specifications
│   │   ├── ui/                             # End-to-End UI functional & edge-case test suites
│   │   │   ├── demoblaze.spec.ts           # Authentication (6 TCs) & Core Cart Checkout (4 TCs)
│   │   │   └── demoblaze_cart_advanced.spec.ts # Advanced multi-product & persistence tests (POM)
│   │   ├── api/                            # API integration & contract tests
│   │   │   └── demoblaze_api.spec.ts       # Endpoint checks (/entries, /login)
│   │   └── performance/                    # Performance benchmarks & navigation metrics
│   │       └── load.spec.ts                # Page load time SLA validation
│   ├── playwright.config.ts                # Global configurations (browsers, workers, reporters, retries)
│   ├── tsconfig.json                       # TypeScript compiler options
│   └── package.json                        # Dependencies & automation run scripts
├── TestCases_DemoBlaze_Comprehensive_Suite.xlsx # Master Test Case Suite (Login & Cart)
├── generate_comprehensive_suite.js         # Automated Excel test suite generator
└── README.md                               # Project documentation & execution guide
```

---

### 2. Architecture & Design Rationale

#### A. Page Object Model (POM) Pattern
* **Maintainability & DRY**: UI locators and user interactions are encapsulated in dedicated classes inside `page-objects/` (`HomePage.ts`, `CartPage.ts`). When UI elements or selectors change, updates are made strictly within the page object without touching test assertion logic.
* **Separation of Concerns**: Test specs (`tests/ui/`) focus purely on business logic, scenario workflows, and assertions, making test cases clean, readable, and easy to review by QA and developers alike.

#### B. Multi-Layer Testing Strategy (Test Pyramid)
* **UI E2E Layer (`tests/ui/`)**: Validates real browser user journeys, modal dialogs, checkout workflows, form validation, and session continuity.
* **API Testing Layer (`tests/api/`)**: Directly exercises backend endpoints (`/entries`, `/login`) using Playwright's native `APIRequestContext`. Provides sub-second feedback on backend integrity without UI overhead.
* **Performance Testing Layer (`tests/performance/`)**: Measures navigation timings and initial render benchmarks to ensure page load stays within acceptable SLAs (< 3-10s).

#### C. State Isolation & Dynamic Fixtures
* **Zero State Pollution**: DemoBlaze shares a public backend database. To prevent cart collisions and order state contamination across test runs or parallel workers, dynamic unique user accounts (`user_${timestamp}`) are created on-the-fly in `beforeAll` / `beforeEach` hooks.
* **Independent Test Execution**: Each test runs inside an isolated browser context, ensuring cookies, local storage, and cache do not leak between test cases.

#### D. Anti-Flakiness & Network Synchronization
* **Explicit Network Awaiting**: DemoBlaze exhibits asynchronous backend latency (especially on `/viewcart` and `/entries`). Instead of brittle hardcoded timeouts (`sleep`), tests synchronize explicitly via `page.waitForResponse()` to wait for critical backend calls to finish before performing assertions.
* **Native Dialog Management**: DemoBlaze uses browser `alert()` and `confirm()` dialogs for success messages and field validation errors. Handlers (`page.waitForEvent('dialog')`) are set up before trigger actions to catch and verify dialog messages reliably.
* **Known Bug Documentation**: Edge cases such as placing an order with an empty cart are tested and explicitly tagged with `test.fail(true, '...')` to assert that the bug exists without falsely breaking regression runs.

#### E. Traceability & Reporting
* **Built-in HTML & Video Traces**: Configured to capture full execution traces (`trace: 'on'`), screenshots, and video recordings on retries/failures, enabling root-cause analysis within minutes via Playwright Trace Viewer.
* **Stakeholder Excel Export**: Includes `generate_comprehensive_suite.js` which compiles the test suite into a formatted Excel Master Report (`TestCases_DemoBlaze_Comprehensive_Suite.xlsx`).

---

## 🚀 Steps to Execute the Demo Scripts

### Prerequisites
* **Node.js**: Version 16.x, 18.x, or later installed (`node -v`)
* **npm**: Version 8.x or later installed (`npm -v`)

---

### Step 1: Navigate to the Framework & Install Dependencies

Open a terminal (PowerShell, Command Prompt, or Bash) and navigate to the `playwright-framework` subfolder:

```bash
cd playwright-framework
npm install
```

Install the required browser binaries (Chromium):
```bash
npx playwright install chromium
```

*(Optional: Install all supported browsers: `npx playwright install`)*

---

### Step 2: Execute Test Suites

#### 1. Run all tests across the framework
Executes all UI, API, and Performance tests in headless mode:
```bash
npx playwright test
```

#### 2. Run specifically on Chromium with multiple workers
```bash
npx playwright test --project=chromium --workers=2
```

#### 3. Run in Headed mode (watch browser execution live)
```bash
npx playwright test --project=chromium --headed
```

#### 4. Run tests by category / directory
* **UI Test Suites**:
  ```bash
  npx playwright test tests/ui/
  ```
* **Advanced Cart POM Suite**:
  ```bash
  npx playwright test tests/ui/demoblaze_cart_advanced.spec.ts
  ```
* **API Tests**:
  ```bash
  npm run test:api
  # or: npx playwright test tests/api/
  ```
* **Performance / Load Tests**:
  ```bash
  npx playwright test tests/performance/
  ```

#### 5. Run a single specific test case by ID or title
```bash
npx playwright test -g "TC-LOGIN-001"
```

#### 6. Run with Interactive Playwright UI Mode (Visual Test Runner)
```bash
npm run test:ui
# or: npx playwright test --ui
```

---

### Step 3: View Test Results & Debug Reports

After test execution finishes:

#### 1. Open the Interactive HTML Test Report
```bash
npx playwright show-report
```
*Displays a detailed breakdown of passed, failed, and skipped tests along with error stacks, step execution times, and attachments.*

#### 2. Inspect Traces for Failed Tests
When a test fails, open its trace package with Playwright Trace Viewer:
```bash
npx playwright show-trace test-results/<test-folder-name>/trace.zip
```
*Allows scrubbing through DOM snapshots, network waterfalls, console logs, and action timings for every step.*

---

### Step 4: (Optional) Generate Master Excel Test Report

From the root project directory (`Exercise-Test`):
```bash
# If needed, install exceljs in the root:
npm install exceljs

# Generate the formatted Excel report:
node generate_comprehensive_suite.js
```
The generated file `TestCases_DemoBlaze_Comprehensive_Suite.xlsx` will be updated with categorized scenarios, execution status, and traceability notes.

---

## 🔄 CI/CD Continuous Integration

A GitHub Actions workflow is pre-configured at [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml). It automatically triggers on every `push` and `pull_request` to `main`/`master`, installs dependencies and browsers, executes all tests, and archives the Playwright HTML report as a build artifact (retained for 30 days).
