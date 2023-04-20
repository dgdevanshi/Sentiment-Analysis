from bs4 import BeautifulSoup
import requests as req
import sys
import json

#url = sys.argv[1]
url = "https://www.moneycontrol.com/india/stockpricequote/refineries/relianceindustries/RI"
#url = "https://finance.yahoo.com/quote/RELIANCE.NS/"
price = ""

result = req.get(url)
content = result.text
soup = BeautifulSoup(content, 'lxml')


box = soup.find(id="nsecp")
print(box.get_text())

json_str = json.dumps(price)
sys.stdout.write(json_str)
sys.stdout.flush()