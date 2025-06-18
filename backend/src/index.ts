import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { AppContext, createAppContext } from './lib/ctx'
import { applyTrpcToExpressApp } from './lib/trpc'
import { applyOpenApiToExpressApp } from './openapi'
import { trpcRouter } from './router'

dotenv.config()

void (async () => {
  let ctx: AppContext | null = null

  try {
    ctx = createAppContext()
    const expressApp = express()
    expressApp.use(cors())

    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })

    applyTrpcToExpressApp(expressApp, trpcRouter)
    applyOpenApiToExpressApp(expressApp, trpcRouter)

    expressApp.listen(3000, () => {
      console.info('Listening at http://localhost:3000')
    })
  } catch (error) {
    console.error(error)
    await ctx?.stop()
  }
})()
