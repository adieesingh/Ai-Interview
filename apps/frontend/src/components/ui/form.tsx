import { Button } from "./button";
import { Input } from "./input";

export function Form() {
  return (
    <div className="h-screen w-screen flex flex-col gap-4 justify-center items-center space-y-4">
        <div className="max-w-md w-full flex flex-col gap-4">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight text-center">
      Ai Interview
    </h1>
      <Input></Input>

      <Input></Input>

      <Button></Button>
      </div>
    </div>
  );
}
