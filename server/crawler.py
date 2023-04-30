import requests
from bs4 import BeautifulSoup
import sys
import json

q = str(sys.stdin.readline()) + " stock share news "
# q = "lic stock share news"
url = f"https://www.google.com/search?q={q}&start=0"

response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

news = ["livemint.com", "zeebiz.com", "moneycontrol.com"] 

links = {"livemint.com": [], "moneycontrol.com": [], "zeebiz.com": []}

isMoneyControl= False
#isFirstLiveMint= True
for anchor in soup.find_all("a"):
    link = anchor.get("href")
    for i in news :
        if link and i in link:
            l = link[7:]
            if i=="livemint.com" :
                # if isFirstLiveMint :
                #     isFirstLiveMint= False
                #     continue
                html_index = l.find(".html")
                if html_index!=-1:
                    l = l[:html_index + 5]
                else:
                    continue
                links[i].append(l)
            elif i=="zeebiz.com" :
                and_index = l.find("&")
                l = l[:and_index]
                links[i].append(l)
            elif i=="moneycontrol.com":
                if(isMoneyControl):
                    continue
                isMoneyControl=True
                links[i].append(l)
            
json_str = json.dumps(links)
sys.stdout.write(json_str)
sys.stdout.flush()