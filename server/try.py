from bs4 import BeautifulSoup
import requests as req

# url = "https://finance.yahoo.com/quote/RELIANCE.NS/"
# url = "https://finance.yahoo.com/quote/LICI.NS/"

# result = req.get(url)
# content = result.text
# soup = BeautifulSoup(content, 'lxml')

# fin_streamer = soup.find('fin-streamer', class_='Fw(b) Fz(36px) Mb(-4px) D(ib)')
# value = fin_streamer['value']
# print(value)

# url = "https://www.zeebiz.com/topics/lic-share-price-target"

# result = req.get(url)
# content = result.text
# soup = BeautifulSoup(content, 'lxml')

# headlines = []
# box = soup.find("div", class_="view-content12")
# for outerDiv in box.find_all("div", class_="mostrecent12") :
#     innerDiv = outerDiv.find("div", class_="mstrecntbx clearfix")
#     a_tag = innerDiv.find("a")
#     title = a_tag.get("title")
#     headlines.append(title)

# print(headlines)

url = "https://www.livemint.com/market/stock-market-news/lic-share-price-rebounds-from-life-time-low-should-you-buy-in-this-pullback-11677733142988.html"

result = req.get(url)
content = result.text
soup = BeautifulSoup(content, 'lxml')

box = soup.find("div", class_="stickyCare")
headline = box.find("h1").text
print(headline)