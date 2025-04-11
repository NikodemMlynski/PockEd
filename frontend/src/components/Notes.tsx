// import React, { useState } from "react";
// import Tesseract from "tesseract.js";
// import axios from "axios";

// const App = () => {
//   const [image, setImage] = useState<File | null>(null);
//   const [extractedText, setExtractedText] = useState("");
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const extractTextFromImage = async () => {
//     if (!image) return;
//     setLoading(true);
//     const { data: imgUrl } = await toBase64(image);

//     Tesseract.recognize(image, "eng")
//       .then(({ data: { text } }) => {
//         setExtractedText(text);
//         return generateNote(text);
//       })
//       .catch(err => {
//         console.error("OCR error:", err);
//         setLoading(false);
//       });
//   };

//   const generateNote = async (text: string) => {
//     try {
//       const res = await axios.post(
//         "https://api.openai.com/v1/chat/completions",
//         {
//           model: "gpt-3.5-turbo",
//           messages: [
//             {
//               role: "system",
//               content: "Jesteś pomocnym asystentem, który robi ładne notatki z tekstów użytkownika.",
//             },
//             {
//               role: "user",
//               content: `Na podstawie tego tekstu stwórz zwięzłą, estetyczną notatkę:\n\n${text}`,
//             },
//           ],
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer YOUR_OPENAI_API_KEY`,
//           },
//         }
//       );
//       setNote(res.data.choices[0].message.content);
//     } catch (err) {
//       console.error("OpenAI error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toBase64 = (file: File): Promise<{ data: string }> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve({ data: reader.result as string });
//       reader.onerror = (error) => reject(error);
//     });

//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       <h1 className="text-3xl font-bold mb-4">Notatki z Obrazu ✨</h1>

//       <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
//       <button
//         onClick={extractTextFromImage}
//         disabled={!image || loading}
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
//       >
//         {loading ? "Przetwarzanie..." : "Zrób notatkę"}
//       </button>

//       {note && (
//         <div className="mt-6 w-full max-w-2xl bg-white p-6 rounded shadow-lg">
//           <h2 className="text-xl font-semibold mb-2">📘 Twoja notatka:</h2>
//           <p className="whitespace-pre-wrap text-gray-800">{note}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;