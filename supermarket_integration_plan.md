# New Zealand Supermarket Integration Plan

## 1. Research Findings

Initial research into direct API access for New Zealand's major supermarket chains, Woolworths NZ (Countdown) and Foodstuffs (New World, Pak'nSave), has revealed the following:

*   **Woolworths NZ (Countdown):** The official Woolworths API portal is not publicly accessible, indicating that a direct, open API for product and pricing data is not available for general use. Integration likely requires a formal partnership.

*   **Foodstuffs (New World, Pak'nSave):** Foodstuffs provides an Electronic Data Interchange (EDI) system for its suppliers. This is a B2B solution for automating orders and invoicing, not a public-facing API for consumer applications to access product and price information.

*   **Third-Party Solutions:** A GitHub repository, `Jason-nzd/supermarket-prices-nextjs`, demonstrates a successful implementation of a New Zealand supermarket price tracking website. This project utilizes a web scraping approach to collect data, which is then stored in an Azure CosmosDB database. The front-end application queries this database to display the product information.

## 2. Integration Strategy

Given the lack of public APIs, a web scraping approach is the most viable strategy for integrating New Zealand supermarket data into the Kitchen Spark mobile application. This strategy will involve the following components:

*   **Web Scraper:** A service responsible for regularly visiting the supermarket websites, extracting product information (name, price, size, etc.), and handling variations in website structure.

*   **Database:** A central database to store the scraped product data. This will serve as the backend for the mobile application, providing a stable and consistent data source.

*   **API Layer:** A simple API to expose the data from the database to the Flutter application. This will decouple the mobile app from the data storage and scraping logic.

## 3. Implementation Plan

### Phase 1: Develop Web Scrapers

*   **Target Websites:**
    *   `countdown.co.nz` (Woolworths NZ)
    *   `newworld.co.nz` (Foodstuffs)
    *   `paknsave.co.nz` (Foodstuffs)

*   **Technology:** Python with libraries such as `BeautifulSoup` and `Requests` or a more advanced framework like `Scrapy`.

*   **Data to be Scraped:**
    *   Product Name
    *   Price
    *   Unit of Measure (e.g., per kg, per 100g)
    *   Product Image URL
    *   Category

### Phase 2: Set Up Database and API

*   **Database:** A simple, scalable database solution will be used. A NoSQL database like MongoDB or a relational database like PostgreSQL are suitable options.

*   **API:** A lightweight Flask or FastAPI application will be created to provide the following endpoints:
    *   `GET /products`: Retrieve a list of all products.
    *   `GET /products?q=<search_term>`: Search for products by name.
    *   `GET /products?supermarket=<supermarket_name>`: Filter products by supermarket.

### Phase 3: Integrate with Flutter Application

*   **API Service:** A new service will be created in the Flutter application to handle communication with the new API.

*   **UI Updates:** The shopping list and recipe costing features will be updated to utilize the data from the API.

*   **Price Comparison:** A new feature will be developed to compare the prices of the same product across different supermarkets.

## 4. Next Steps

The immediate next step is to begin the development of the web scrapers for the target supermarket websites. This will be the most complex and critical part of the integration process.

