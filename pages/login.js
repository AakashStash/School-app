import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true); 
    setMsg("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const j = await res.json();
      if (res.ok) {
        setMsg("OTP sent to your email");
        router.push(`/verify?email=${encodeURIComponent(email)}`);
      } else {
        setMsg(j.error || "Error sending OTP");
        setLoading(false); 
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      setMsg("Something went wrong. Try again.");
      setLoading(false); 
    }
  }

  return (
    <div className="container">
      <div>
        <h2 className="h-home">Login</h2>
        <form onSubmit={handleSend}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <button className="otp-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        <p>{msg}</p>
      </div>
    </div>
  );
}
