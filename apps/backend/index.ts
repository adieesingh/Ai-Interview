import express from "express";
import { InteviewPayParse } from "./types";
import cors from "cors";
import axios from "axios";
import { prisma } from "./db";
import { initSideBand } from "./sideband";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.post("/api/v1/pre-interview", async (req, res) => {
  try {
    const { success, data } = InteviewPayParse.safeParse(req.body);
    if (!success) {
      return res.status(401).json({
        message: "Url is not valid",
      });
    }
    const githubFilter = data.github.endsWith("/")
      ? data.github.slice(0, -1)
      : data.github;

    const githubUsername = githubFilter.split("/").pop();

    const userRepos = await axios.get(
      `https://api.github.com/users/${githubUsername}/repos`,
    );

    const fliterDataRepos = userRepos.data.map((x: any) => ({
      description: x.description,
      name: x.name,
      fullName: x.full_name,
      startCount: x.stargazers_count,
    }));
    const response = await prisma.interview.create({
      data: {
        githubMetadata: JSON.stringify(fliterDataRepos),
        status: "pre",
      },
    });
    return res.status(201).json({
      message: response.id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Down",
      erros: error,
    });
  }
});
app.post("api/v1/session/:interviewId",async(req,res)=>{
  const sessionConfig =JSON.stringify({
    type:"realtime",
    model:"gpt-realtime",
    audio:{output:{voice:"marin"}}
  })

  const fd = new FormData()
  fd.set("sdp",req.body)
  fd.set("session",sessionConfig)
  try {
     const sdpResponse = await fetch("https://opi.openai.com/v1/realtime/calls",{
      method:"POST",
      headers:{
        Authorizations:`Bearee ${process.env.OPENAI_KEY}`,
        "OpenAI-Safety-Identifer":"hased-user-id"
      },
      body:fd
     })
     const location = sdpResponse.headers.get("Location");
     const callId= location?.split("/").pop()!;
     console.log(callId)
     const sdp= await sdpResponse.text()
     res.send(sdp)
     initSideBand(callId,req.params.interviewId)
  } catch (error) {
    return res.status(500).json({
      message:"Internal Server Down"
    })
  }
})

app.post("/api/v1/session/user/response/:interviewId",async(req,res)=>{
    try {
      const {message}= req.body;
      const response = await prisma.message.create({
        data:{
          interviewId: req.params.interviewId!,
          type:"User",
          message:message
        }
      });
      res.json({
        message:"Message saved"
      })
    }   catch (error) {
        return res.status(500).json({
          message:"Internal Server Down"
        })
    }
})
app.listen(3001, () => {
  console.log("App is running..");
});
