import React from 'react';
import './results.css';

const Results = (props) => {
  const { price,companyLink,predictions,name} = props.location.state;
  let len=price.length;
  return (
    <div className="centered-container">
      <div className="company-info">
        <h1 className="company-name text-blue">{name.toUpperCase()}</h1>
        <div className='price'>
        <span className='price'> <span className='text-green' > ₹{price.substring(1,len-1)}</span>  </span>
        </div>

        <div className='sentiment-analysis'>
        {predictions.map((model) => (
            <div className='middle-section'>
            <span className="sentiment">Sentiment: <span className='text-green'>{model.modelName.toUpperCase()}</span></span>
            <span className="sentiment"><span className='text-blue' >{model.prediction === '1' ? 'Positive' : 'Negative'}</span>  </span>
            </div>
          ))}

        {/* <div className='middle-section'>
        <span className="sentiment">Sentiment:<span className='text-green'> Positive</span></span>
        <span className="sentiment"><span className='text-blue' > Naive Bayes</span>  </span>
        </div>

        <div className='middle-section'>
        <span className="sentiment">Sentiment:<span className='text-red'> Negative</span></span>
        <span className="sentiment"><span className='text-blue' > KNN</span>  </span>
        </div> */}
        </div>
     
      </div>
      <div className="articles">
        <h2 className='article-headline'>Top {companyLink.length} articles of the day</h2>
        <ul className='article-list'>
        {companyLink.map((article) => (
            <li>
              <span>{article.newsName}</span>
              <a href={article.newsLink} className='text-grey clickable'>OPEN</a>
            </li>
          ))}

          {/* <li >
            <span>The Times Of India</span>
            <span className='text-grey clickable'>OPEN</span>
            </li>
            <li >
            <span>Money control</span>
            <span className='text-grey clickable'>OPEN</span>
            </li>
            <li >
            <span>Zee buisness</span>
            <span className='text-grey clickable'>OPEN</span>
            </li>
            <li >
            <span>India today</span>
            <span className='text-grey clickable'>OPEN</span>
            </li>
            <li >
            <span>NDTV</span>
            <span className='text-grey clickable'>OPEN</span>
            </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Results;