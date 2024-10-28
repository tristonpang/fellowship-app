import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, MessageSquareText, Menu } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Mentees', href: '/', icon: Users },
    { name: 'AI Assistant', href: '/ai-chat', icon: MessageSquareText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MentorSync</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      location.pathname === item.href
                        ? 'border-b-2 border-indigo-500 text-gray-900'
                        : 'text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    location.pathname === item.href
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}