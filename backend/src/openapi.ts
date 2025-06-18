import type { Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from 'trpc-openapi'
import { createContext } from './lib/ctx'
import { type TrpcRouter } from './router'

export const getOpenApiDocument = (router: TrpcRouter) =>
  generateOpenApiDocument(router, {
    title: 'TechnicalSupport API',
    version: '1.0.0',
    baseUrl: '',
  })

export const applyOpenApiToExpressApp = (expressApp: Express, router: TrpcRouter) => {
  const document = getOpenApiDocument(router)

  expressApp.use('/api', createOpenApiExpressMiddleware({ router, createContext }))
  expressApp.get('/swagger.json', (_req, res) => res.json(document))
  expressApp.use('/docs', swaggerUi.serve, swaggerUi.setup(document))
}
