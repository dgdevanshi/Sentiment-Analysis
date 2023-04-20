from bs4 import BeautifulSoup
import requests as req
import sys
import json

url = sys.argv[1]
#url="https://www.livemint.com/market/stock-market-news/lic-share-price-may-give-25-return-in-long-term-says-yes-securities-11676277674080.html"
headlines = ""

result = req.get(url)
content = result.text
soup = BeautifulSoup(content, 'lxml')

if "zeebiz.com" in url :
    box = soup.find("div", class_="view-content12")
    for outerDiv in box.find_all("div", class_="mostrecent12") :
        innerDiv = outerDiv.find("div", class_="mstrecntbx clearfix")
        a_tag = innerDiv.find("a")
        title = a_tag.get("title")
        headlines += title + " "

elif "livemint.com" in url :
    box = soup.find("div", class_="stickyCare")
    headline = box.find("h1").get_text()
    headlines += headline + " "

json_str = json.dumps(headlines)
sys.stdout.write(json_str)
sys.stdout.flush()