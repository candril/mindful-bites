import { useUserInfo } from "@/data/useUserInfo";
import { Redirect } from "wouter";

function WelcomePage() {
  const user = useUserInfo();
  if (user) {
    return <Redirect to={`/calendar/${user.token}`} />;
  }

  return <div>Welcome</div>;
}

export default WelcomePage;
