import React from 'react';
import './results.css';

const Results = () => {
  //const { data } = props.location.state;
  return (
    <div className="centered-container">
      <div className="company-info">
        <h1 className="company-name">Adani Enterprises</h1>
        <div className='middle-section'>
        <span className="sentiment">Sentiment:<span className='text-green'> Positive</span></span>
        <span className='price'>  Current price:<span className='text-blue' > $99</span>  </span>
        </div>
     
      </div>
      <div className="articles">
        <h2 className='article-box'>Top 5 articles of the day</h2>
        <ul className='article-list'>
          <li>The Times Of India</li>
          <li>Money control</li>
          <li>Zee buisness</li>
          <li>Hindustan times</li>
          <li>Article 5</li>
        </ul>
      </div>
    </div>
  );
};

export default Results;