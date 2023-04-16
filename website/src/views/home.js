import React from 'react'
import './home.css'

const Home = (props) => {
  return (
    <div className="home-container">
     
      
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

          <section className="home-centered">
  <div className="home-get-started">
    <input type="text" placeholder="Search your favourite stock" />
  </div>
</section>
        </header>

        {/* <nav className="home-centered">
          <div className="home-left"></div>
          <div className="home-right">
            <div className="home-get-started">
              <span className="home-text4">Search</span>
            </div>
            <div id="open-mobile-menu" className="home-burger-menu">
              <img
                alt="pastedImage"
                src="/playground_assets/pastedimage-yxbd.svg"
                className="home-mobile-menu-button"
              />
            </div>
          </div>
        </nav> */}
      </section>
    </div>
  )
}

export default Home
