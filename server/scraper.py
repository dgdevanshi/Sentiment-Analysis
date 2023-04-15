from bs4 import BeautifulSoup
import requests as req
import sys
import json

# url = "https://www.moneycontrol.com/india/stockpricequote/lifehealth-insurance/lifeinsurancecorporationindia/LIC09&sa=U&ved=2ahUKEwioxpXe56v-AhV_jZUCHcX0A4UQFnoECAoQAg&usg=AOvVaw3Jju-U31hs5b5wtgyM-mul"
url = sys.argv[1]

result = req.get(url)
content = result.text
soup = BeautifulSoup(content, 'lxml')
title = soup.title.string

json_str = json.dumps(title)
sys.stdout.write(json_str)
sys.stdout.flush()