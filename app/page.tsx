'use client';

import Link from 'next/link';

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/portfolio_profile_bg.gif)' }}>
      <Link href="/myportfolio">
        <div className="relative w-72 h-72">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img src="/professional_pic.jpg" alt="Profile Picture" className="w-full h-full object-cover" />
          </div>
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-white border-4 border-white rounded-full bg-[#c5b3ad] px-4 py-1">Alea Chlodnik</h1>
      </Link>
    </div>
  );
}
