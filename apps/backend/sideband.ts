import WebSocket from "ws";
import { prisma } from "./db";

export async function initSideBand(callid: string, interviewId: string) {
  const url = "wss://api.openai.com/v1/realtime?call_id" + callid;
  const ws = new WebSocket(url, {
    headers: {
      authorization: "Bearer " + process.env.OPENAI_KEY,
    },
  });
  const interview = await prisma.interview.findFirst({
    where: {
      id: interviewId,
    },
  });
  ws.on("open", function open() {
    console.log("Connected to server");
    ws.send(
      JSON.stringify({
        type: "realtime",
        instructions: `You are supposed to do interview with candiate , Ask question around 2-3 based on expercience as well as github project 
                    ## Github Data
                    ${interview?.githubMetadata}
                    `,
      }),
    );
  });
  ws.on("message", async function incoming(message) {
    const parsedMessage = JSON.parse(message.toString());
    if (parsedMessage.type === "response.done") {
      let contents: { type: string; transcript: string }[] = [];

      parsedMessage.response.output.map(
        (x:any) => (contents = [...contents, ...x.contents]),
      );
      const assistantMessage = contents
        .filter((x) => x.type === "output_audio")
        .join(" ");
      await prisma.message.create({
        data: {
          interviewId,
          type: "Assitant",
          message: assistantMessage,
        },
      });
    }
  });
}
