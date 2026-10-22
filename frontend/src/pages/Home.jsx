import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import '../pageStyles/Home.css'

const Home = () => {
  return (
    <>  
    <Navbar/>
    <div className = "home-container">
      <h2 className = "home-heading">Trending Now </h2>
    </div>
    <Footer/>
    </>
  )
}

export default Home