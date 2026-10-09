import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'
import { AdminPageSkeleton, PageSkeleton } from './components/common/Skeleton'

// Every page except the home page is loaded on demand (one small file per page),
// so visitors only download the code for the pages they open. While a page is
// being fetched, a skeleton of it is shown.

// Public pages
const AboutAs = lazy(() => import('./pages/AboutAs'))
const Service = lazy(() => import('./pages/Service'))
const Service_Detail_page = lazy(() => import('./pages/Service_Detail_page'))
const Project = lazy(() => import('./pages/Project'))
const Project_Detail_Page = lazy(() => import('./pages/Project_Detail_Page'))
const Blogs = lazy(() => import('./pages/Blogs'))
const Tems = lazy(() => import('./pages/Tems'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const OurFAQs = lazy(() => import('./pages/OurFAQs'))
const Notfound = lazy(() => import('./pages/Notfound'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const CartPage = lazy(() => import('./pages/CartPage'))
const Start_Investment_Form = lazy(() => import('./components/Start_Investment_Form'))

// News, Notices, Gallery
const NewsList = lazy(() => import('./pages/news/NewsList'))
const NewsDetail = lazy(() => import('./pages/news/NewsDetail'))
const NoticeList = lazy(() => import('./pages/notices/NoticeList'))
const NoticeDetail = lazy(() => import('./pages/notices/NoticeDetail'))
const GalleryList = lazy(() => import('./pages/gallery/GalleryList'))
const GalleryDetail = lazy(() => import('./pages/gallery/GalleryDetail'))

// Dashboard
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Dashboard = lazy(() => import('./admin/Dashboard'))
const BlogForm = lazy(() => import('./admin/blogs/BlogForm'))
const BlogFormEdit = lazy(() => import('./admin/blogs/BlogFormEdit'))
const BlogPages = lazy(() => import('./admin/blogs/BlogPages'))
const ProjectPage = lazy(() => import('./admin/projects/ProjectPage'))
const ProjectForm = lazy(() => import('./admin/projects/ProjectForm'))
const ProjectDetailpage = lazy(() => import('./admin/projects/ProjectDetailpage'))
const ServicesFrom = lazy(() => import('./admin/services/ServicesFrom'))
const ServicesFormEdit = lazy(() => import('./admin/services/ServicesFormEdit'))
const ServicesPage = lazy(() => import('./admin/services/ServicesPage'))
const FqaFormEdit = lazy(() => import('./admin/FQA/FqaFormEdit'))
const FqaForm = lazy(() => import('./admin/FQA/FqaForm'))
const FqaPage = lazy(() => import('./admin/FQA/FqaPage'))
const TeamPage = lazy(() => import('./admin/team/TeamPage'))
const TeamForm = lazy(() => import('./admin/team/TeamForm'))
const TeamFromEdit = lazy(() => import('./admin/team/TeamFromEdit'))
const TestimonialPage = lazy(() => import('./admin/testimonial/TestimonialPage'))
const TestimonialForm = lazy(() => import('./admin/testimonial/TestimonialForm'))
const TestimonialFormEdit = lazy(() => import('./admin/testimonial/TestimonialFormEdit'))
const Profile = lazy(() => import('./admin/profile/Profile'))
const TotalUser = lazy(() => import('./admin/totaluser/TotalUser'))

// Dashboard: News, Notices, Gallery, Media, Settings
const AdminNewsPage = lazy(() => import('./admin/news/NewsPage'))
const AdminNewsForm = lazy(() => import('./admin/news/NewsForm'))
const AdminNoticesPage = lazy(() => import('./admin/notices/NoticesPage'))
const AdminNoticeForm = lazy(() => import('./admin/notices/NoticeForm'))
const AdminGalleryPage = lazy(() => import('./admin/gallery/GalleryPage'))
const AdminGalleryForm = lazy(() => import('./admin/gallery/GalleryForm'))
const MediaLibrary = lazy(() => import('./admin/media/MediaLibrary'))
const SiteSettings = lazy(() => import('./admin/settings/SiteSettings'))

function App() {
  const { pathname } = useLocation()
  // The admin dashboard has its own layout, so hide the public site chrome there.
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <>
      <div className="font-roboto">
        {!isDashboard && <Navbar />}
        <Suspense fallback={isDashboard ? <div className="p-8"><AdminPageSkeleton /></div> : <PageSkeleton />}>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/aboutas' element={<AboutAs />} />
            <Route path='/services' element={<Service />} />
            <Route path='/aboutas/service_detail_page/:id' element={<Service_Detail_page />} />
            <Route path='/project' element={<Project />} />
            <Route path='/project/project_detail_page/:id' element={<Project_Detail_Page />} />
            <Route path='/blog' element={<Blogs />} />
            <Route path='/team' element={<Tems />} />
            <Route path='/testimonial' element={<Testimonials />} />
            <Route path='/oursfaqs' element={<OurFAQs />} />
            <Route path='/404' element={<Notfound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path='/contact' element={<Contact />} />

            {/* News, Notices, Gallery */}
            <Route path='/news' element={<NewsList />} />
            <Route path='/news/:slug' element={<NewsDetail />} />
            <Route path='/notices' element={<NoticeList />} />
            <Route path='/notices/:slug' element={<NoticeDetail />} />
            <Route path='/gallery' element={<GalleryList />} />
            <Route path='/gallery/:slug' element={<GalleryDetail />} />

            {/* Login Page (PublicRoute to avoid logged-in users) */}
            <Route path='/login' element={<PublicRoute> <Login /> </PublicRoute>} />

            {/* Authenticated User Routes */}
            <Route path='/carts' element={<ProtectedRoute allowedRoles={['user', 'admin']}><CartPage /></ProtectedRoute>} />
            <Route path='/investment_start' element={<ProtectedRoute allowedRoles={['user', 'admin']}><Start_Investment_Form /></ProtectedRoute>} />

            {/* =============== Dashboard ==================== */}
            <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path='blogs' element={<BlogPages />} />
              <Route path='blogform' element={<BlogForm />} />
              <Route path='blogformedit/:id' element={<BlogFormEdit />} />
              <Route path='projects' element={<ProjectPage />} />
              <Route path='projectform' element={<ProjectForm />} />
              <Route path='projectformedit/:id' element={<ProjectForm />} />
              <Route path='projectdetailpage/:id' element={<ProjectDetailpage />} />
              <Route path='profile' element={<Profile />} />
              <Route path='services' element={<ServicesPage />} />
              <Route path='servicesform' element={<ServicesFrom />} />
              <Route path='servicesformedit/:id' element={<ServicesFormEdit />} />
              <Route path='faqs' element={<FqaPage />} />
              <Route path='faqsform' element={<FqaForm />} />
              <Route path='faqsformedit/:id' element={<FqaFormEdit />} />
              <Route path='teams' element={<TeamPage />} />
              <Route path='teamsform' element={<TeamForm />} />
              <Route path='teamsformedit/:id' element={<TeamFromEdit />} />
              <Route path='testimonials' element={<TestimonialPage />} />
              <Route path='testimonialsform' element={<TestimonialForm />} />
              <Route path='testimonialsformedit/:id' element={<TestimonialFormEdit />} />
              <Route path='totalUser' element={<TotalUser />} />

              {/* Content: News, Notices, Gallery */}
              <Route path='news' element={<AdminNewsPage />} />
              <Route path='newsform' element={<AdminNewsForm />} />
              <Route path='newsformedit/:id' element={<AdminNewsForm />} />
              <Route path='notices' element={<AdminNoticesPage />} />
              <Route path='noticeform' element={<AdminNoticeForm />} />
              <Route path='noticeformedit/:id' element={<AdminNoticeForm />} />
              <Route path='gallery' element={<AdminGalleryPage />} />
              <Route path='galleryform' element={<AdminGalleryForm />} />
              <Route path='galleryformedit/:id' element={<AdminGalleryForm />} />
              <Route path='media' element={<MediaLibrary />} />
              <Route path='settings' element={<SiteSettings />} />
            </Route>
          </Routes>
        </Suspense>
        {!isDashboard && <Footer />}
      </div>
    </>

  )
}

export default App
// Nexas Global Investment
