import { useState } from 'react';
import { useLocation } from 'wouter';
import { Activity, Lock, Mail, UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock auth delay
    setTimeout(() => {
      setIsLoading(false);
      
      if (activeTab === "register") {
        toast({
          title: "Account created successfully",
          description: "Welcome to NeuroScan AI. You are now logged in.",
        });
      } else {
        toast({
          title: "Welcome back",
          description: "You have successfully logged in.",
        });
      }
      
      setLocation('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Abstract background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md z-10 border-border/50 shadow-xl backdrop-blur-sm bg-card/90">
        <CardHeader className="space-y-4 text-center pb-6">
          <div className="mx-auto h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
            <Activity className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">NeuroScan AI</CardTitle>
            <CardDescription>
              Advanced Deep Learning for Tumor Detection
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleAuth}>
              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="doctor@hospital.com" 
                      className="pl-10"
                      required 
                      defaultValue="doctor@hospital.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      required 
                      defaultValue="password"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reg-email" 
                      type="email" 
                      placeholder="doctor@hospital.com" 
                      className="pl-10"
                      required 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Create Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="reg-password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10"
                      required 
                    />
                  </div>
                </div>
                
                 <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital / Institution</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="hospital" 
                      placeholder="General Hospital" 
                      className="pl-10"
                      required 
                    />
                  </div>
                </div>
              </TabsContent>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-11 text-base" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Activity className="h-4 w-4 animate-spin" /> Processing...
                    </span>
                  ) : activeTab === "login" ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            {activeTab === "login" ? (
              <span 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => setActiveTab("register")}
              >
                Don't have an account? Sign up
              </span>
            ) : (
              <span 
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => setActiveTab("login")}
              >
                Already have an account? Sign in
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
