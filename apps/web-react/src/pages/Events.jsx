import React from 'react'
import EventContainer from '../components/Events/EventContainer'
import Footer from '../components/Global/Footer/footer.jsx'
import Navbar from '../components/Home/navbar/navbar.jsx'
import StarBackground from '../components/Home/StarBackground/StarBackground.jsx'

function Events() {
  return (
    <div className='w-full overflow-x-hidden' style={{
      background: 'linear-gradient(to bottom, #050510, #0c0f14 70%, #05060a)',
      position: 'relative',
      minHeight: '100vh'
    }}>
      {/* Star background */}
      <StarBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar/>
        <EventContainer/>
        <Footer/>
      </div>
    </div>
  )
}

export default Events