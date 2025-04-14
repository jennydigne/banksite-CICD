"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Account() {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [isLoggedOut, setIsLoggedOut] = useState(false);


    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsClient(true);
        }
    }, []);

    useEffect(() => {
        if (!isClient || isLoggedOut) return;

        const token = localStorage.getItem("bankToken");
        if (!token) {
            setMessage("Du är inte inloggad!");
            return;
        }

        const fetchBalance = async () => {
            try {
                const response = await fetch("http://ec2-13-60-52-134.eu-north-1.compute.amazonaws.com:3002/me/accounts", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();
                if (response.ok) {
                    setBalance(data.saldo);
                } else {
                    setMessage(data.error || "Misslyckades att hämta saldo.");
                }
            } catch (error) {
                setMessage("Serverfel: Kunde inte hämta saldo.");
            }
        };

        fetchBalance();
    }, [isClient, isLoggedOut]);

    const depositMoney = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setMessage("Ange en giltig summa");
            return;
        }

        try {
            const token = localStorage.getItem("bankToken");
            const response = await fetch("http://ec2-13-60-52-134.eu-north-1.compute.amazonaws.com:3002/me/accounts/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, amount: Number(amount) }),
            });

            const data = await response.json();
            if (response.ok) {
                setBalance(data.newSaldo || 0);
                setAmount("");
            } else {
                setMessage(data.error || "Kunde inte sätta in pengar.");
            }
        } catch (error) {
            setMessage("Serverfel: Kunde inte sätta in pengar.");
        }
    };

    const logout = async () => {
        const token = localStorage.getItem("bankToken");

        if (!token) {
            setMessage("Du är inte inloggad.");
            return;
        }

        try {
            const response = await fetch("http://ec2-13-60-52-134.eu-north-1.compute.amazonaws.com:3002/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("bankToken");
                setIsLoggedOut(true);
            } else {
                setMessage(data.error || "Kunde inte logga ut.");
            }
        } catch (error) {
            setMessage("Serverfel: Kunde inte logga ut.");
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div>
            <nav className="flex p-4 bg-gray-200 items-center gap-4 justify-end">
                <button className="bg-cyan-800 px-4 py-2 rounded text-white cursor-pointer hover:bg-cyan-900 active:scale-95">
                    <Link href="/">Hem</Link>
                </button>
                <button
                    className="bg-cyan-800 text-white px-4 py-2 rounded w-fit cursor-pointer hover:bg-cyan-900 active:scale-95"
                    onClick={logout}
                >
                    Logga ut
                </button>
            </nav>
            <div className="flex flex-col items-center gap-24 bg-cyan-600 h-screen">
                {isLoggedOut ? (
                    <div className="flex flex-col items-center gap-6">
                        <h1 className="text-4xl font-bold mt-24 text-white">Du har loggats ut</h1>
                        <button className="bg-cyan-800 px-4 py-2 rounded text-white cursor-pointer w-fit hover:bg-cyan-900 active:scale-95">
                            <Link href="/">Gå till startsidan</Link>
                        </button>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-4xl font-bold mt-24 text-white text-center">Välkommen till ditt konto!</h1>
                        <div className="flex flex-col px-16 py-8 mt-10 border border-gray-600 rounded bg-gray-200">
                            {message && <p className="text-red-500">{message}</p>}
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl text-gray-800">Saldo:</h3>
                                <p className="text-xl font-semibold text-gray-800">
                                    {isNaN(balance) || balance === null ? "0 kr" : `${balance} SEK`}
                                </p>
                            </div>
                            <div className="mt-4">
                                <input
                                    className="border border-gray-600 p-1 bg-white text-center"
                                    type="number"
                                    placeholder="Ange belopp att sätta in"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <button
                                    className="bg-emerald-600 text-white px-4 py-2 rounded ml-2 cursor-pointer active:scale-95 hover:bg-emerald-800"
                                    onClick={depositMoney}
                                >
                                    Sätt in belopp
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

