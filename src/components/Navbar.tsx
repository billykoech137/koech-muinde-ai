import { Button } from "@/components/ui/button";
import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      setIsOpen(false);
    }
  };

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center space-x-2'>
            <img src='/logo.svg' alt='EdgePoint Insights logo' className='w-8 h-8' />
            <span className='text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              EdgePoint Insights
            </span>
          </div>

          <div className='hidden md:flex items-center space-x-8'>
            <button
              onClick={() => scrollToSection("services")}
              className='text-foreground hover:text-primary transition-colors'
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className='text-foreground hover:text-primary transition-colors'
            >
              About
            </button>
            {/* {user ? (
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2 text-sm'>
                  <UserIcon className='h-4 w-4 text-primary' />
                  <span className='text-muted-foreground'>{user.email}</span>
                </div>
                <Button variant='outline' onClick={handleLogout}>
                  <LogOut className='h-4 w-4 mr-2' />
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            )} */}
          </div>

          <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
            <Menu className='h-6 w-6' />
          </button>
        </div>

        {isOpen && (
          <div className='md:hidden py-4 space-y-4'>
            <button
              onClick={() => scrollToSection("services")}
              className='block w-full text-left text-foreground hover:text-primary transition-colors'
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className='block w-full text-left text-foreground hover:text-primary transition-colors'
            >
              About
            </button>
            {user ? (
              <>
                <div className='px-3 py-2 text-sm text-muted-foreground border rounded-md'>
                  {user.email}
                </div>
                <Button
                  variant='outline'
                  className='w-full'
                  onClick={handleLogout}
                >
                  <LogOut className='h-4 w-4 mr-2' />
                  Logout
                </Button>
              </>
            ) : (
              <Button className='w-full' onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
