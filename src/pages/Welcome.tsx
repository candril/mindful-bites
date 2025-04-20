import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/data/useUserInfo";
import { useState } from "react";
import { Redirect, useLocation } from "wouter";
import { Sprout } from "lucide-react";

function WelcomePage() {
  const [_, setLocation] = useLocation();
  const { user, setUserToken } = useUserInfo();

  const { createUser, isLoading } = useCreateUser();

  if (user?.token) {
    return <Redirect to={`/${user.token}/calendar`} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 sm:max-w-xl w-full text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
          <Sprout className="text-green-600" size={32} /> Welcome to Mindful
          Bites
        </h1>

        <p className="text-gray-600 text-lg mb-8">
          Track your eating habits in a mindful, non-judgmental way. Define what
          healthy means for you and gain insights into your personal nutrition
          journey over time.
        </p>

        <Button
          variant="default"
          size="lg"
          className="w-full text-lg py-6"
          onClick={async () => {
            const token = await createUser();
            setUserToken(token);
            setLocation(`/${token}/calendar`);
          }}
          disabled={isLoading}
        >
          {isLoading ? "Creating User..." : "Get Started Now"}
        </Button>
      </div>
    </div>
  );
}

interface UseCreateUserReturn {
  createUser: () => Promise<string>;
  isLoading: boolean;
  error: Error | null;
}

function useCreateUser(): UseCreateUserReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const createUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      const data = await response.json();
      return data.userToken;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { createUser, isLoading, error };
}

export default WelcomePage;
