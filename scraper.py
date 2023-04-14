url = "https://www.livemint.com/market/stock-market-news/lic-share-price-may-give-25-return-in-long-term-says-yes-securities-11676277674080.html"

from bs4 import BeautifulSoup
import requests as req

result = req.get(url)
content = result.text
soup = BeautifulSoup(content, 'lxml')

box = soup.find('header', class_="td-post-title")
title = soup.title.string
print(title)