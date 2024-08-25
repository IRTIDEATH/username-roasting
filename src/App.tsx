import { Github, Instagram, Settings } from "lucide-react";
import Loader from "./components/Loader";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import MarkdownIt from "markdown-it";
import { Input } from "./components/ui/input";
import { useEffect, useRef, useState } from "react";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";

function App() {
  const [apiKey, setApiKey] = useState<string>(process.env.API_KEY!);
  const [username, setUsername] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    // const output = outputRef.current;
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {
          const genAI = new GoogleGenerativeAI(apiKey);
          const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE, // Allow content
              },
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE, // Allow content
              },
              {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE, // Allow content
              },
              {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE, // Allow content
              },
            ],
          });

          const result = await model.generateContentStream({
            systemInstruction: `berikan dan komentar yang agak menyakitkan tetapi dalam konteks lucu lucuan aja dalam bahasa gaul untuk username seperti berikut ini : ${username}.`,
            contents: [
              {
                role: "user",
                parts: [{ text: username }],
              },
            ],
          });
          // const responseText = await result.response;

          // setOutput(responseText.text());

          let buffer = [];
          let md = new MarkdownIt();
          for await (let response of result.stream) {
            buffer.push(response.text());
            setOutput(md.render(buffer.join("")));
          }
          // console.log((await result.response).text());
        } catch (error) {
          setOutput((error as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
    }
  }, [username, apiKey]);

  return (
    <>
      <div className="container">
        <div className="max-w-screen-sm mx-auto">
          <h1 className="font-outfit font-bold text-4xl text-center mt-4">
            Name Roasting
          </h1>

          {/* user input start */}
          <Card className="mt-4">
            <CardContent>
              <form method="post" ref={formRef}>
                <div className="py-4 grid gap-1.5">
                  <label htmlFor="username">Input nama atau username kamu</label>
                  <Input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="sagasitas.official"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <Button className="px-8" type="submit">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>
          {/* user input end */}

          {/* user input start */}
          <Card className="mt-4">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <CardHeader>Roastingan untuk {username}:</CardHeader>
                <CardContent dangerouslySetInnerHTML={{ __html: output }} />
              </>
            )}
          </Card>
          {/* user input end */}

          {/* settings start */}
          <div className="flex flex-col mt-4">
            <button className="flex gap-2 mb-2 items-center">
              <Settings className="size-[18px]" />
              <p>Settings</p>
            </button>

            <Card>
              <CardContent>
                <div className="mt-4 grid gap-1.5">
                  <label htmlFor="apiKey">Gemini API Key (optional)</label>
                  <Input
                    type="text"
                    id="apiKey"
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="API key"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          {/* settings end */}

          {/* footer start */}
          <footer className="flex items-center justify-start md:justify-evenly gap-8 mt-4 max-w-screen-sm w-full">
            <a
              href="https://github.com/ramarfx"
              className="flex gap-2 items-center">
              <Github className="size-[18px]" />
              <p>@ramarfx</p>
            </a>
            <p className="hidden md:block">hanya sekedar hiburan semata</p>
            <a
              href="https://instagram.com/ramtxh"
              className="flex gap-2 items-center">
              <Instagram className="size-[18px]" />
              <p>@ramtxh</p>
            </a>
          </footer>
          {/* footer end */}
        </div>
      </div>
    </>
  );
}

export default App;
