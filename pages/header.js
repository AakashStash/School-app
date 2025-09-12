import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const [timeLeft, setTimeLeft] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let intervalId;
    function updateTimer() {
      const expiresAt = Number(localStorage.getItem("tokenExpiresAt"));
      if (!expiresAt) {
        setTimeLeft(null);
        return;
      }
      const now = Date.now();
      const diff = expiresAt - now;
      if (diff <= 0) {
        setTimeLeft(null);
        localStorage.removeItem("tokenExpiresAt");
        clearInterval(intervalId);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }

    updateTimer();
    intervalId = setInterval(updateTimer, 1000);

    const handleRouteChange = () => {
      updateTimer();
    };
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      clearInterval(intervalId);
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]); 

  return (
    <header className="header">
      <Link href="/" className="logo">
        <GraduationCap size={28} />
        <span>School App</span>
      </Link>
      <nav className="nav">
        <Link href="/addSchool" className="nav-link">Add School</Link>
        <Link href="/showSchools" className="nav-link">Show Schools</Link>
        {timeLeft ? (
          <span className="nav-link">⏳ {timeLeft}</span>
        ) : (
          <Link href="/login" className="nav-link">Login</Link>
        )}
      </nav>
    </header>
  );
}
