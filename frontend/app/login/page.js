"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        const response = await fetch("http://ec2-13-60-52-134.eu-north-1.compute.amazonaws.com:3002/sessions", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("bankToken", data.token);
            setMessage("Loggar in...");
            setTimeout(() => {
                router.push("/account");
            }, 1000);
        } else {
            setMessage(data.error || "Fel användarnamn eller lösenord");
        }
    };

    return (
        <div className="bg-gray-50 h-screen">
            <nav className="flex p-4 justify-between bg-gray-200">
                <button className="bg-cyan-800 px-4 py-2 rounded text-white cursor-pointer hover:bg-cyan-900 active:scale-95"><Link href="/">Hem</Link ></button>
            </nav>
            <div className="flex justify-center">
                <div className="bg-gray-200 border border-gray-400 w-fit px-8 py-4 mt-28 rounded">
                    <h1 className="text-xl text-gray-800">Logga in</h1>
                    <div className="flex flex-col gap-2 mt-4">
                        <input className="border border-gray-600 p-1 bg-white"
                            type="text"
                            placeholder="Användarnamn"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                        <input className="border border-gray-600 p-1 bg-white"
                            type="password"
                            placeholder="Lösenord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                        <button className="bg-cyan-800 w-fit px-4 py-2 rounded text-white mt-2 cursor-pointer active:scale-95 hover:bg-cyan-900"
                            onClick={handleLogin}>Logga in</button>
                        <div className="mt-4">
                            {message && <p className="text-sm text-gray-800">{message}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

