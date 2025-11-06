'''
import asyncio
from requests_html import AsyncHTMLSession
import json

async def scrape_countdown():
    asession = AsyncHTMLSession()
    
    try:
        r = await asession.get('https://www.woolworths.co.nz/shop/browse/fruit-veg')
        await r.html.arender(sleep=5, timeout=30)
        
        products = []
        product_elements = r.html.find('div.product-card-v2')
        
        for product in product_elements:
            name_element = product.find('h3.product-title', first=True)
            price_element = product.find('div.product-price', first=True)
            
            if name_element and price_element:
                name = name_element.text.strip()
                price = price_element.text.strip()
                
                products.append({
                    'name': name,
                    'price': price,
                    'supermarket': 'Countdown'
                })
            
        with open('/home/ubuntu/supermarket_scraper/data/countdown_products.json', 'w') as f:
            json.dump(products, f, indent=4)
            
        print(f"Successfully scraped {len(products)} products from Countdown.")

    except Exception as e:
        print(f"Error scraping Countdown: {e}")
    finally:
        await asession.close()

if __name__ == '__main__':
    asyncio.run(scrape_countdown())
'''
