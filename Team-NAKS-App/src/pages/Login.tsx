import { auth, db } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLinkedInGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      // 1. Trigger the Social Login Popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Check if user already has a detailed profile
      const userDocRef = doc(db, "profiles", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // 3. Create a LinkedIn-style profile if it's a new user
        // We use data from the social provider to populate the fields
        await setDoc(userDocRef, {
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          headline: "Software Engineering Student", // Default placeholder
          batch: "2026", // Based on your birth year logic
          location: "Mumbai, India",
          skills: ["React", "Firebase", "TypeScript"],
          achievements: [
            {
              title: "Joined Alumni Network",
              description: "Verified student account created.",
              date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
            }
          ]
        });
      }

      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.displayName}`,
      });

      // 4. Redirect to your LinkedIn-style Networking page
      navigate("/networking");

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-[#0a66c2] p-2 rounded text-white font-bold text-2xl px-3">
              in
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to AlumniConnect</CardTitle>
          <CardDescription>
            Join the professional community of your alma mater
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button 
            variant="outline" 
            className="w-full h-12 border-[#0a66c2] text-[#0a66c2] hover:bg-blue-50 font-semibold rounded-full flex gap-3"
            onClick={handleLinkedInGoogleLogin}
          >
            {/* Google Icon SVG */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81.61z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 px-6 leading-relaxed">
            By clicking Continue, you agree to the User Agreement, Privacy Policy, and Cookie Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;