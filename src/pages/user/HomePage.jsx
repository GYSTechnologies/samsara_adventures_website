import React from 'react'
import Navbar from '../../components/user/Navbar'
import ImageSlider from '../../components/user/ImageSlider'
import DestinationsCarts from '../../components/user/DestinationsCarts'
import AdventureCart from '../../components/user/AdventureCart'
import VacationLanding from '../../components/user/VacationLanding'
import PhotoGallery from '../../components/user/PhotoGallery'
import TestimonialCarousel from '../../components/user/TestimonialCarousel'
import EventsSections from '../../components/user/EventsSections'

const HomePage = () => {
  return (
    <div>

      <ImageSlider/>
      <DestinationsCarts/>
      <EventsSections/>
      <AdventureCart/>
      <VacationLanding/>
      <PhotoGallery/>
      <TestimonialCarousel/>
    </div>
  )
}

export default HomePage
