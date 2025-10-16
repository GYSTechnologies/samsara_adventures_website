import React from 'react'
import Navbar from '../../components/user/Navbar'
import ImageSlider from '../../components/user/ImageSlider'
import DestinationsCarts from '../../components/user/DestinationsCarts'
import AdventureCart from '../../components/user/AdventureCart'
import VacationLanding from '../../components/user/VacationLanding'
import PhotoGallery from '../../components/user/PhotoGallery'
import TestimonialCarousel from '../../components/user/TestimonialCarousel'
import EventsSections from '../../components/user/EventsSections'
import Recommendations from './Recommendations'
import Category from './Home/Category'
import VectorStates from './Home/VectorStates'
import TopDestinationsCarousel from './Home/TopDestinationsCarousel'
import StateTripsCarousel from './Home/StateTripsCarousel'
import StateRecommendations from './Home/StateRecommendations'

const HomePage = () => {
  return (
    <div className='mb-16'>

      <ImageSlider/>
      <Category/>
      <TopDestinationsCarousel/>
      <VectorStates/>
      <StateRecommendations/>
      <Recommendations/>
      <StateTripsCarousel/>
      {/* <DestinationsCarts/> */}
      <EventsSections/>

      {/* <AdventureCart/>
      <VacationLanding/>
      <PhotoGallery/>
      <TestimonialCarousel/> */}
    </div>
  )
}

export default HomePage
