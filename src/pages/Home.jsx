import React from 'react'
import Hero from '../components/Hero'
import { FaArrowUp } from 'react-icons/fa'
import HeroCarousel from '../components/HeroCarousel'
import About from '../components/About'
// import Services from '../components/Services'
import Projects from '../components/Projects'
import Blog from '../components/Blog'
import Team from '../components/Team'
import Testimonial from '../components/Testimonial'
import FAQ from '../components/FAQ'
import Service from './Service'
import Services from '../components/Services'

const Home = () => {
    return (
        <>
            <div>
                {/* <HeroCarousel /> */}
                <Hero />
                <About />
                <Services />
                <Projects />
                <Blog />
                <Team />
                <Testimonial />
                <FAQ />

            </div>

        </>

    )
}

export default Home