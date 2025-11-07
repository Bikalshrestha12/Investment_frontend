import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AboutAs from './pages/AboutAs'
import Service from './pages/Service'
import Project from './pages/Project'
import Blogs from './pages/Blogs'
import Tems from './pages/Tems'
import Testimonials from './pages/Testimonials'
import OurFAQs from './pages/OurFAQs'
import Notfound from './pages/Notfound'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './admin/Dashboard'
import BlogForm from './admin/blogs/BlogForm'
import BlogFormEdit from './admin/blogs/BlogFormEdit'
import BlogPages from './admin/blogs/BlogPages'
import ProjectPage from './admin/projects/ProjectPage'
import ProjectForm from './admin/projects/ProjectForm'
import ProjectFormEdit from './admin/projects/ProjectFormEdit'
import ServicesFrom from './admin/services/ServicesFrom'
import ServicesFormEdit from './admin/services/ServicesFormEdit'
import ServicesPage from './admin/services/ServicesPage'
import FqaFormEdit from './admin/FQA/FqaFormEdit'
import FqaForm from './admin/FQA/FqaForm'
import FqaPage from './admin/FQA/FqaPage'
import TeamPage from './admin/team/TeamPage'
import TeamForm from './admin/team/TeamForm'
import TeamFromEdit from './admin/team/TeamFromEdit'
import TestimonialPage from './admin/testimonial/TestimonialPage'
import TestimonialForm from './admin/testimonial/TestimonialForm'
import TestimonialFormEdit from './admin/testimonial/TestimonialFormEdit'
import Start_Investment_Form from './components/Start_Investment_Form'
import Project_Detail_Page from './pages/Project_Detail_Page'
import CartPage from './pages/CartPage'
import ProtectedRoute from './components/ProtectedRoute'
import ProjectDetailpage from './admin/projects/ProjectDetailpage'
import Service_Detail_page from './pages/Service_Detail_page'
import Profile from './pages/Profile'
import TotalUser from './admin/totaluser/TotalUser'
import PublicRoute from './routes/PublicRoute'


<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet"></link>
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="font-roboto">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/aboutas' element={<AboutAs />} />
          <Route path='/services' element={<Service />} />
          <Route path='/services/service_detail_page/:id' element={<Service_Detail_page />} />
          <Route path='/project' element={<Project />} />
          <Route path='/project/project_detail_page/:id' element={<Project_Detail_Page />} />
          <Route path='/blog' element={<Blogs />} />
          <Route path='/team' element={<Tems />} />
          <Route path='/testimonial' element={<Testimonials />} />
          <Route path='/oursfaqs' element={<OurFAQs />} />
          <Route path='/404' element={<Notfound />} />
          <Route path='/contact' element={<Contact />} />

          {/* Login Page (PublicRoute to avoid logged-in users) */}
          <Route path='/login' element={<PublicRoute> <Login /> </PublicRoute>} />

          {/* Authenticated User Routes */}
          <Route path='/carts' element={<CartPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/investment_start' element={<Start_Investment_Form />} />

          {/* =============== Dashboard ==================== */}
          <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
          <Route path='/dashboard/blogs' element={<ProtectedRoute allowedRoles={['admin']}><BlogPages /></ProtectedRoute>} />
          <Route path='/dashboard/blogform' element={<ProtectedRoute allowedRoles={['admin']}><BlogForm /></ProtectedRoute>} />
          <Route path='/dashboard/blogformedit/:id' element={<ProtectedRoute allowedRoles={['admin']}><BlogFormEdit /></ProtectedRoute>} />
          <Route path='/dashboard/projects' element={<ProtectedRoute allowedRoles={['admin']}><ProjectPage /></ProtectedRoute>} />
          <Route path='/dashboard/projectform' element={<ProtectedRoute allowedRoles={['admin']}><ProjectForm /></ProtectedRoute>} />
          <Route path='/dashboard/projectformedit/:id' element={<ProtectedRoute allowedRoles={['admin']}><ProjectFormEdit /></ProtectedRoute>} />
          <Route path='/dashboard/projectdetailpage/:id' element={<ProtectedRoute allowedRoles={['admin']}><ProjectDetailpage /></ProtectedRoute>} />
          <Route path='/dashboard/services' element={<ProtectedRoute allowedRoles={['admin']}><ServicesPage /></ProtectedRoute>} />
          <Route path='/dashboard/servicesform' element={<ProtectedRoute allowedRoles={['admin']}><ServicesFrom /></ProtectedRoute>} />
          <Route path='/dashboard/servicesformedit/:id' element={<ProtectedRoute allowedRoles={['admin']}><ServicesFormEdit /></ProtectedRoute>} />
          <Route path='/dashboard/faqs' element={<ProtectedRoute allowedRoles={['admin']}><FqaPage /></ProtectedRoute>} />
          <Route path='/dashboard/faqsform' element={<ProtectedRoute allowedRoles={['admin']}><FqaForm /></ProtectedRoute>} />
          <Route path='/dashboard/faqsformedit/:id' element={<ProtectedRoute allowedRoles={['admin']}><FqaFormEdit /></ProtectedRoute>} />
          <Route path='/dashboard/teams' element={<ProtectedRoute allowedRoles={['admin']}><TeamPage /></ProtectedRoute>} />
          <Route path='/dashboard/teamsform' element={<ProtectedRoute allowedRoles={['admin']}><TeamForm /></ProtectedRoute>} />
          <Route path='/dashboard/teamsformedit/:id' element={<ProtectedRoute allowedRoles={['admin']}><TeamFromEdit /></ProtectedRoute>} />
          <Route path='/dashboard/testimonials' element={<ProtectedRoute allowedRoles={['admin']}><TestimonialPage /></ProtectedRoute>} />
          <Route path='/dashboard/testimonialsform' element={<ProtectedRoute allowedRoles={['admin']}><TestimonialForm /></ProtectedRoute>} />
          <Route path='/dashboard/testimonialsformedit/:id' element={<ProtectedRoute allowedRoles={['admin']}><TestimonialFormEdit /></ProtectedRoute>} />
          <Route path='/dashboard/totalUser' element={<ProtectedRoute allowedRoles={['admin']}><TotalUser /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </div>
    </>

  )
}

export default App
// Nexas Global Investment