# DemoBlaze E2E Automation Demo

This repository contains an automated E2E testing framework built with [Playwright](https://playwright.dev/) for the [DemoBlaze](https://www.demoblaze.com/) e-commerce web application.

## 🏗️ Framework Structure & Rationale

The framework is structured to be simple, maintainable, and highly resilient against network flakiness.

- `tests/`
  - `demoblaze.spec.ts`: Contains the main test suite covering both the Login and Cart functionalities.
- `playwright.config.ts`: Global Playwright configurations such as workers, browsers, and reporters.
- `package.json`: Project dependencies (`@playwright/test`).

### Rationale
- **Playwright over Cypress/Selenium**: Playwright provides native auto-waiting mechanisms, out-of-the-box browser isolation (Browser Contexts), and excellent handling of asynchronous operations. This is crucial for single-page applications like DemoBlaze.
- **State Isolation**: To prevent "state bleeding" across tests (e.g., cart items from one test affecting another), a unique test user is generated dynamically in the `beforeAll` hook.
- **Anti-Flakiness Mechanisms**: DemoBlaze API responses can be significantly delayed. Instead of relying purely on UI elements appearing, the framework strategically uses `page.waitForResponse()` to wait for backend API calls (like `/viewcart`) to resolve before making assertions.
- **Comprehensive Coverage**: The suite doesn't just test the "happy path" (Functional). It covers negative paths (invalid passwords, non-existent users) and edge cases (purchasing with an empty cart, leaving required checkout fields blank).

## 🚀 Steps to Execute the Demo Scripts

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) (v16+) installed on your machine.

### 1. Install Dependencies
Navigate to the project directory and run the following commands in the terminal to install Playwright and its dependencies:
```bash
npm install
npx playwright install
```

### 2. Run the Tests
To execute the tests in **headless** mode (running fast in the background):
```bash
npx playwright test tests/demoblaze.spec.ts
```

To watch the tests execute in **headed** mode (opens the browser UI so you can see the actions):
```bash
npx playwright test tests/demoblaze.spec.ts --headed
```

### 3. View the Test Report
After the tests complete, Playwright automatically generates a detailed HTML report. To view it, run:
```bash
npx playwright show-report
```
