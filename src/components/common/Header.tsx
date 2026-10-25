import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, User, Menu, X, ChevronDown, ShieldCheck, LogOut, Heart, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TasteHubLogo } from './TasteHubLogo';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cartCount,
    setIsCartOpen,
    setIsAuthOpen,
    setIsLocationOpen,
    selectedCity,
    user,
    logout,
    loginAsAdmin,
    loginAsCustomer,
    openAuthModal,
    setSearchQuery
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Menu', id: 'menu' },
    { name: 'About', id: 'about' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (pageId: string) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput.trim());
      setActivePage('menu');
      setHeaderSearchOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#111111]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-neutral-800/80 py-3'
          : 'bg-[#111111] py-4 border-b border-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-8">
            <TasteHubLogo
              theme="dark"
              size="md"
              onClick={() => handleNavClick('home')}
            />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative text-sm font-medium tracking-wide transition-colors py-1 ${
                      isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF7518] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions (Search, Location, Cart, Auth) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Trigger */}
            <div className="relative">
              {headerSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-neutral-900 border border-neutral-700 rounded-full px-3 py-1.5 w-48 sm:w-64"
                >
                  <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Dishes, restaurants..."
                    autoFocus
                    className="bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setHeaderSearchOpen(false)}
                    className="text-neutral-400 hover:text-white ml-1 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setHeaderSearchOpen(true)}
                  aria-label="Search"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Location Selector */}
            <button
              onClick={() => setIsLocationOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-300 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF7518]" />
              <span className="truncate max-w-[90px]">{selectedCity}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Shopping Cart Button with live red badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Cart with ${cartCount} items`}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-neutral-200 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#DC3545] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full bg-neutral-900 border border-neutral-700 hover:border-neutral-500 transition-colors text-white"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold hidden md:inline truncate max-w-[80px]">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl py-2 z-50 text-neutral-200">
                    <div className="px-4 py-2 border-b border-neutral-800">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">{user.name}</p>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        user.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActivePage('account');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-800 flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      My Profile & Orders
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('orders');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-800 flex items-center gap-2.5 transition-colors"
                    >
                      <Clock className="w-4 h-4 text-neutral-400" />
                      Live Order Tracker
                    </button>

                    {/* Admin Dashboard Quick Access */}
                    <button
                      onClick={() => {
                        if (user.role !== 'admin') loginAsAdmin();
                        setActivePage('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#FF8A35] hover:bg-neutral-800 flex items-center gap-2.5 transition-colors font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#FF7518]" />
                      Admin Dashboard
                    </button>

                    {/* Quick switch to customer role if currently admin */}
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          loginAsCustomer();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      >
                        Switch to Demo Customer
                      </button>
                    )}

                    <div className="border-t border-neutral-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('signin')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-full transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF7518] hover:bg-[#e0630d] rounded-full shadow-md shadow-[#FF7518]/20 transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-3 border-t border-neutral-800 bg-[#111111] animate-fadeIn">
            {/* Mobile Location Selector */}
            <div className="mb-4 px-2">
              <button
                onClick={() => {
                  setIsLocationOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF7518]" />
                  <span>Delivering to: <strong className="text-white">{selectedCity}</strong></span>
                </div>
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1 px-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-800 text-[#FF7518] font-bold'
                        : 'text-neutral-300 hover:bg-neutral-900'
                    }`}
                  >
                    {link.name}
                  </button>
                );
              })}

              {/* Admin Dashboard Mobile Link */}
              <button
                onClick={() => {
                  if (!user || user.role !== 'admin') loginAsAdmin();
                  handleNavClick('admin');
                }}
                className="text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-[#FF8A35] hover:bg-neutral-900 flex items-center justify-between"
              >
                <span>Admin Dashboard</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
