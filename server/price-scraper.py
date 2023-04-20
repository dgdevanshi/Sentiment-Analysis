from bs4 import BeautifulSoup
import requests as req
import sys
import json

url = sys.argv[1]

result = req.get(url)
content = result.text
soup = BeautifulSoup(content, 'lxml')

box = soup.find(id="nsecp")
price = box.get_text()

json_str = json.dumps(price)
sys.stdout.write(json_str)
sys.stdout.flush()