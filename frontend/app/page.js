import Link from "next/link";

export default function Home() {
  return (
    <div>
      <nav className="flex p-4 justify-between items-center bg-gray-200">
        <h2 className="text-cyan-900 text-xl font-bold">Chas Bank</h2>
        <div className="flex gap-4">
          <button className="bg-cyan-800 px-4 py-2 rounded text-white cursor-pointer hover:bg-cyan-900 active:scale-95"><Link href="/login">Logga in</Link ></button>
          <button className="bg-cyan-800 px-4 py-2 rounded text-white cursor-pointer hover:bg-cyan-900 active:scale-95"><Link href="/create-user">Bli kund</Link ></button>
        </div>
      </nav>
      <div className="bg-cyan-600 h-[500px] flex flex-col justify-center items-center gap-10">
        <h1 className="text-white text-5xl font-bold text-center">Välkommen till framtidens bank</h1>
        <button className="bg-cyan-800 px-6 py-3 rounded text-white text-lg cursor-pointer hover:bg-cyan-900 active:scale-95"><Link href="/create-user">Bli kund</Link ></button>
      </div>
    </div>
  );
}
