import pandas as pd
import string
import re
import nltk
nltk.download("stopwords")
nltk.download("wordnet")
nltk.download("punkt")
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.externals import joblib

df = pd.read_csv('data.csv')
df.dropna(inplace=True)
train = df[df['Date'] < '20150101']
test = df[df['Date'] > '20141231']

X_train = train.iloc[:, 2:27]
y_train = train["Label"]

for column in X_train.columns:
    X_train[column] = X_train[column].str.lstrip('b\'').str.lstrip('b"')


def caseLower(text) :
    text = text.lower()
    return text

def punctuationRemove(text) :
    text = "".join([char for char in text if char not in string.punctuation])
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    text = re.sub("[0-9]+", "", text)
    return text

def tokenization(text) :
    text = text.strip()
    text = re.split("\W+", text)
    return text

def singlesRemove(text) :
    text = [word for word in text if len(word) > 1]
    return text

def stopwordsRemove(text) :
    stopword = nltk.corpus.stopwords.words("english")
    text = [word for word in text if word not in stopword]
    return text

def lemmatizer(text) :
    text = [nltk.WordNetLemmatizer().lemmatize(word) for word in text]
    return text

def preprocess(text) :
    text = caseLower(text)
    text = punctuationRemove(text)
    text = tokenization(text)
    text = singlesRemove(text)
    text = stopwordsRemove(text)
    text = lemmatizer(text)
    text = " ".join(text)
    return text

for column in X_train.columns:
    X_train[column] = X_train[column].apply(lambda x: preprocess(x))

headlines = []
for row in range(0, len(X_train.index)):
    headlines.append(" ".join(str(x) for x in X_train.iloc[row, 0:25]))

vectorizer = TfidfVectorizer(ngram_range=(2,2))
X_train = vectorizer.fit_transform(headlines)

model = MultinomialNB()
model.fit(X_train, y_train)

joblib.dump(model, 'model.joblib')