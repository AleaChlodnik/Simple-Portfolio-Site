"use client";

import { useState, useEffect } from "react";

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("portfolioDB", 1);

    request.onerror = () => reject("❌ Could not open IndexedDB");
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

export default function MyPortfolio() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<{ id: number; name: string; type: string; url: string }[]>([]);
  const [saved, setSaved] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleSave = async () => {
    if (!file) return console.warn("⚠️ No file selected");

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      if (!reader.result) return console.error("❌ File read failed");

      const db = await openDB();
      const transaction = db.transaction("files", "readwrite");
      const store = transaction.objectStore("files");

      const fileData = {
        name: file.name,
        type: file.type,
        data: reader.result,
      };

      store.add(fileData);

      transaction.oncomplete = async () => {
        console.log("✅ File saved!");
        setSaved(true);
        await getSavedFiles();
      };
    };
  };

  const getSavedFiles = async () => {
    const db = await openDB();
    const transaction = db.transaction("files", "readonly");
    const store = transaction.objectStore("files");
    const request = store.getAll();

    request.onsuccess = () => {
      const savedFiles = request.result;
      console.log("📌 Retrieved files:", savedFiles);

      const fileList = savedFiles.map((file: any) => {
        const blob = new Blob([file.data], { type: file.type });
        return {
          id: file.id,
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(blob),
        };
      });

      setFiles(fileList);
    };

    request.onerror = () => console.error("❌ Error retrieving files");
  };

  useEffect(() => {
    getSavedFiles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Portfolio</h1>

      <div className="mb-4">
        <input type="file" accept=".jpg, .jpeg, .png, .pdf" onChange={handleFileChange} className="border p-2" />
      </div>

      <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-4 rounded mb-4">
        Save
      </button>

      {saved && <div className="mt-2 text-green-500 font-semibold">File saved!</div>}

      <div className="mt-6 flex gap-4 overflow-x-auto border-t pt-4">
        {files.map((file) => (
          <div key={file.id} className="border p-2">
            {file.type.startsWith("image/") ? (
              <img src={file.url} alt={file.name} className="h-24 w-24 object-cover" />
            ) : file.type === "application/pdf" ? (
              <iframe src={file.url} title={file.name} width="100" height="100" />
            ) : (
              <p className="text-sm">{file.name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
