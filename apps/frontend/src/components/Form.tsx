import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
export function Form() {
  const [github, setGithub] = useState<string | undefined>();

  async function Submit() {
    try {
      if (!github) {
        toast("Enter a valid url");
        return;
      }
      await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
        github,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col gap-4 justify-center items-center space-y-4">
      <div className="max-w-md w-full flex flex-col gap-4">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight text-center">
          Ai Interview
        </h1>
        <Input
          placeholder="Enter a Github Url"
          onChange={(e) => setGithub(e.target.value)}
        ></Input>

        <Button onClick={Submit}>Start a Interview</Button>
      </div>
    </div>
  );
}
