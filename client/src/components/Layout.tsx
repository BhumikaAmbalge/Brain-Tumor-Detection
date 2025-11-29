import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Scan, History, LogOut, Menu, Moon, Sun, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check system preference initially
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/analysis', icon: Scan, label: 'New Analysis' },
    { href: '/history', icon: History, label: 'Patient History' },
  ];

  return (
    <div className="min-h-screen bg-background flex transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-sidebar border-r border-border transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        <div className="h-16 flex items-center px-6 border-b border-border">
          <div className="flex items-center gap-3 text-primary font-bold text-xl">
            <Activity className="h-8 w-8" />
            {isSidebarOpen && <span className="whitespace-nowrap">NeuroScan AI</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all
                  ${isActive 
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}
                `}>
                  <item.icon className="h-5 w-5" />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-destructive hover:bg-destructive/10 transition-all">
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Topbar */}
        <header className="h-16 bg-background border-b border-border px-8 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground capitalize">
              {location.replace('/', '') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-full border border-border">
              <Button
                variant={!isDark ? "default" : "ghost"}
                size="icon"
                className={`rounded-full h-8 w-8 ${!isDark ? 'bg-white text-yellow-500 shadow-sm hover:bg-white hover:text-yellow-600' : 'text-muted-foreground'}`}
                onClick={() => isDark && toggleTheme()}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={isDark ? "default" : "ghost"}
                size="icon"
                className={`rounded-full h-8 w-8 ${isDark ? 'bg-slate-800 text-blue-400 shadow-sm hover:bg-slate-700 hover:text-blue-300' : 'text-muted-foreground'}`}
                onClick={() => !isDark && toggleTheme()}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-foreground">Dr. Sarah Wilson</p>
                <p className="text-xs text-muted-foreground">Radiologist</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                SW
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
