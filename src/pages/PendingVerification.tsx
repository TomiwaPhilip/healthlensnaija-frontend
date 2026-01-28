import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail } from "lucide-react";

const PendingVerification = () => {
  const [email, setEmail] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    if (emailParam) setEmail(emailParam);
  }, [location.search]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <div className="mb-8">
        <Link to="/">
           <img src={logo} alt="HealthLens" className="h-12 w-auto" />
        </Link>
      </div>

      <Card className="w-full max-w-md text-center shadow-lg border-primary/10">
        <CardHeader className="space-y-4 pb-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                <CardDescription>
                    We’ve sent a verification link to <br/>
                    <span className="font-medium text-foreground">{email || "your email address"}</span>
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
                Click the confirmation link in that email to begin using HealthLens. <br/>
                If you don't see it, be sure to check your spam folder.
            </p>
            
            <div className="grid gap-4">
                <Button asChild className="w-full" size="lg" variant="outline">
                    <Link to="/signin">Back to Sign In</Link>
                </Button>
                
                <p className="text-xs text-muted-foreground">
                    Did not receive the email?{" "}
                    <Link to="/contact" className="text-primary hover:underline">
                        Contact Support
                    </Link>
                </p>
            </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
         <p>&copy; {new Date().getFullYear()} Nigeria Health Watch</p>
      </div>
    </div>
  );
};

export default PendingVerification;
