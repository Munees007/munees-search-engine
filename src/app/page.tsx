import { NavBar } from "@/components/NavBar";
import { SearchBar } from "@/components/SearchBar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-dvh">
      <NavBar/>

      <div className="flex-1 flex flex-col justify-center items-center">
          <SearchBar/>
          <p className="font-bold italic tracking-widest text-sm mt-2"> Search. Crawl. Index. Rank.</p>
      </div>
    </div>
  );
}
