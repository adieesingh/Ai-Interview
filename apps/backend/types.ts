import z from 'zod'
export const InteviewPayParse=z.object({
    github:z.string().min(3,"Invalid Link")
}) 