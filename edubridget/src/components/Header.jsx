import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold bg-primary-gradient bg-clip-text text-transparent">
                EDUBRIDGE
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Home
            </Link>

            {/* About Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                About <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/aboutUsPage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">About Edu Bridge</Link>
                <Link to="/branches" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Branches</Link>
                <Link to="/partners" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Partners</Link>
              </div>
            </div>

            {/* Academics Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                Academics <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/coursesPage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">High School Curriculum</Link>
                <Link to="/coursesPage?filter=university" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Master's Programs</Link>
                <Link to="/coursesPage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Online Learning</Link>
              </div>
            </div>

            {/* Global Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                Global Opportunities <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/study-abroad" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Study Abroad</Link>
                <Link to="/visa-consultation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Visa & Consultation</Link>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                Resources <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                <Link to="/library" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Digital Library</Link>
                <Link to="/scholarships" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Scholarships</Link>
              </div>
            </div>

            {/* Media Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium">
                Media <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                 <Link to="/blogs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Blogs & News</Link>
                 <Link to="/gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-slate-50 hover:text-primary">Gallery</Link>
              </div>
            </div>

            <Link to="/contactPage" className="text-gray-700 hover:text-primary transition-colors font-medium">
              Contact
            </Link>

            <Link to="/signin">
              <Button className="bg-primary hover:bg-primary-dark text-white font-medium">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary hover:bg-slate-50" onClick={() => setIsOpen(false)}>Home</Link>
            
            {/* Mobile Dropdowns */}
            {['About', 'Academics', 'Global Opportunities', 'Resources', 'Media'].map((section) => (
              <div key={section}>
                <button
                  onClick={() => toggleDropdown(section)}
                  className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary hover:bg-slate-50"
                >
                  {section}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === section ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === section && (
                  <div className="pl-4 space-y-1 bg-slate-50 rounded-md">
                    {section === 'About' && (
                      <>
                        <Link to="/aboutUsPage" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>About Edu Bridge</Link>
                        <Link to="/branches" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Branches</Link>
                        <Link to="/partners" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Partners</Link>
                      </>
                    )}
                    {section === 'Academics' && (
                      <>
                        <Link to="/coursesPage" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>High School Curriculum</Link>
                        <Link to="/coursesPage?filter=university" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Master's Programs</Link>
                         <Link to="/coursesPage" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Online Learning</Link>
                      </>
                    )}
                     {section === 'Global Opportunities' && (
                      <>
                        <Link to="/study-abroad" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Study Abroad</Link>
                        <Link to="/visa-consultation" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Visa & Consultation</Link>
                      </>
                    )}
                    {section === 'Resources' && (
                      <>
                        <Link to="/library" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Digital Library</Link>
                        <Link to="/scholarships" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Scholarships</Link>
                      </>
                    )}
                     {section === 'Media' && (
                      <>
                        <Link to="/blogs" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Blogs & News</Link>
                        <Link to="/gallery" className="block px-3 py-2 text-sm text-gray-600 hover:text-primary" onClick={() => setIsOpen(false)}>Gallery</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            <Link to="/contactPage" className="block px-3 py-2 rounded-md text-base text-gray-700 hover:text-primary hover:bg-slate-50" onClick={() => setIsOpen(false)}>Contact</Link>
            
            <div className="pt-4 pb-2">
              <Link to="/signin" className="block w-full text-center px-3 py-2 rounded-md text-base bg-primary text-white hover:bg-primary-dark" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
