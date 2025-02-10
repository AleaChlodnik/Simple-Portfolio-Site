
export default function Documentation() {
  return (
    <div className="w-full min-h-screen bg-cover pt-[6%] flex flex-col items-center gap-8" style={{ backgroundImage: 'url(/portfolio_bg.jpg)' }}>
      <h1 className="text-white text-8xl font-extrabold"
        style={{ textShadow: "2px 2px 10px rgb(183,138,106), -2px -2px 10px rgb(183,138,106), 2px -2px 10px rgb(183,138,106), -2px 2px 10px rgb(183,138,106)" }}>
        Documentation
      </h1>
      <div className="w-fit h-full">
        <iframe
          src="/AleaChlodnik-CV-fr.pdf"
          className="w-[80vw] h-[65vh] border rounded-lg shadow-lg pb-5"
        ></iframe>

        <a
          href="/AleaChlodnik-CV-fr.pdf"
          download="AleaChlodnik-CV-fr.pdf"
          className="bg-blue-600 text-white text-2xl rounded-full shadow-md px-3 py-2 hover:bg-blue-700"
        >
          📥 Download
        </a>
      </div>
    </div>
  );
}
