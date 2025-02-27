import cn from "classnames";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useInterval } from "../utils/use-interval";

function Number({ value, onChange }) {
  const handleChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      onChange(value);
    }
  };

  return <input type="text" value={value} onChange={handleChange} />;
}

function Float({ value, onChange }) {
  const handleChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      onChange(value);
    }
  };

  return <input type="text" value={value} onChange={handleChange} />;
}


export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [negative_prompt, setNegativePrompt] = useState("");
  const [steps, setSteps] = useState(80);
  const [cfg_scale, setCFG] = useState(24);
  const [strength, setStrength] = useState(0.3);
  const [loading, setLoading] = useState(false);
  const [messageId, setMessageId] = useState("");
  const [image, setImage] = useState(null);
  const [canShowImage, setCanShowImage] = useState(false);

  useInterval(
    async () => {
      const res = await fetch(`/api/poll?id=${messageId}`);
      const json = await res.json();
      if (res.status === 200) {
        setLoading(false);
        setImage(json.img);
        setCanShowImage(true);
      }
    },
    loading ? 5000 : null
  );

  async function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    toast("Generating your image...", { position: "top-center" });
    const response = await fetch(`/api/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        steps,
        cfg_scale,
        strength,
      }),
    });
    const json = await response.json();
    setMessageId(json.id);
  }

  const showLoadingState = loading || (image && !canShowImage);

  console.log(image);

  return (
    <>
      <Head>
        <title>废柴画家</title>
      </Head>
      <div className="antialiased mx-auto px-4 py-20 h-screen bg-gray-100">
        <Toaster />
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-5xl tracking-tighter pb-10 font-bold text-gray-800">
          废柴画家
          </h1>
          <form
            className="flex w-full sm:w-auto flex-col sm:flex-col mb-10"
            onSubmit={submitForm}
          >
            <textarea
              className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
              placeholder="Prompt"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <br/>
            <textarea
              className="shadow-sm text-gray-700 rounded-sm px-3 py-2 mb-4 sm:mb-0 sm:min-w-[600px]"
              placeholder="Negative Prompt"
              onChange={(e) => setNegativePrompt(e.target.value)}
            />
            <br/>
            {/* <Number value={steps} onChange={setSteps}></Number>
            <br/>
            <Number value={cfg_scale} onChange={setCFG}></Number>
            <br/>
            <Float value={strength} onChange={setStrength}></Float>
            <br/> */}
            <button
              className="min-h-[40px] shadow-sm py-2 inline-flex justify-center font-medium items-center px-4 bg-green-600 text-gray-100 sm:ml-2 rounded-md hover:bg-green-700"
              type="submit"
            >
              {showLoadingState && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {!showLoadingState ? "Generate" : ""}
            </button>
          </form>
          {image && (
            <div className="relative flex w-full items-center justify-center">
            <div className="w-full sm:w-[512px] h-[512px] rounded-md shadow-md relative">
              <img
                alt={`Stable Diffusion representation of: ${prompt}`}
                className={cn("rounded-md shadow-md h-full object-cover", {
                  "opacity-100": canShowImage,
                })}
                src={image}
                //src={`data:image/png;base64,${image}`}
              />
            </div>

            <div
              className={cn(
                "w-full sm:w-[512px] absolute top-0.5 overflow-hidden rounded-2xl bg-white/5 shadow-xl shadow-black/5",
                {
                  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-gray-500/10 before:to-transparent":
                    showLoadingState,
                  "opacity-0 shadow-none": canShowImage,
                }
              )}
            ></div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}
