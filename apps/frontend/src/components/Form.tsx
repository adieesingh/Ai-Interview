import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";
import { useNavigate } from "react-router-dom";
export function Form() {
   const navigation = useNavigate()
  const [github, setGithub] = useState<string | undefined>();

  async function Submit() {
   
    try {
      if (!github) {
        toast("Enter a valid url");
        return;
      }
      await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, {
        github,
      }).then((response)=>{
        navigation(`/interview/${response.data.message}`)
      }).catch((error)=>{
        toast("Something went wrong ")
        console.log(error)
      })
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
