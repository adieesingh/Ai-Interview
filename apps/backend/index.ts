import express from 'express'
import { InteviewPayParse } from './types';
import cors from 'cors'
import axios from 'axios';
const app =express();
app.use(express.json())
app.use(cors({
    origin:"http://localhost:3000"
}))
app.post("/api/v1/pre-interview",async(req,res)=>{
    try {
        const {success,data}=InteviewPayParse.safeParse(req.body)
        if(!success){
            return res.status(401).json({
                message:"Url is not valid"
            })
        }  
        const githubFilter = data.github.endsWith("/")? data.github.slice(0,-1):data.github;
        
            const githubUsername = githubFilter.split("/").pop();
            
            const userRepos = await axios.get(`https://api.github.com/users/${githubUsername}/repos`)  
       
        const fliterDataRepos = userRepos.data.map((x:any)=>({
                description: x.description,
                name:x.name,
                fullName:x.full_name,
                startCount:x.stargazers_count
        }))
        
        res.send({github:fliterDataRepos})
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Down",
            erros:error
        })
    }
})
app.listen(3001,()=>{
    console.log("App is running..")
})