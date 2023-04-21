import {useState,React,useRef} from 'react'
import { useHistory } from 'react-router-dom';
import './home.css'

const Home = (props) => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const searchInputRef = useRef(); 

  const handleSubmit = async (event) => {

    event.preventDefault();
    setLoading(true);
    const searchQuery = searchInputRef.current.value;
    console.log(searchQuery);
    try {
      const response = await fetch(`http://localhost:3696/company?company=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const data = await response.json();
      console.log(data);
      setLoading(false);
      history.push({
        pathname: '/results',
        state: { name: data.name, companyLink:data.companyLink,predictions:data.predictions, price: data.price },
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="home-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <section className="home-hero">
          <header className="home-header">
            <h1 className="home-text">
              <span className="home-text1">Stock</span>
              <span className="home-text2">Pulse</span>
            </h1>
            <p className="home-text3">
              With Stock Pulse, you can stay informed about the latest updates and
              trends in the stock market.
            </p>
            <form onSubmit={handleSubmit}>
              <section className="home-centered">
                <div className="home-get-started">
                  <input type="text" placeholder="Search your favourite stock" ref={searchInputRef} />
                  <button type="submit">Search</button>
                </div>
              </section>
            </form>
          </header>
        </section>
      )}
    </div>
  );
}

export default Home
