import express from 'express'
import { Server } from 'http'

describe('startServer', () => {
  it('should start', async () => {
    process.env.PORT = '5777'
    const listen = jest.spyOn(Server.prototype, 'listen')
    jest.mock('./config/express', () => ({
      createServer: jest.fn().mockReturnValue(express()),
    }))
    await import('./index')
    expect(listen).toBeCalled()
    const server = listen.mock.results[0].value as Server
    await new Promise<void>((res) =>
      setImmediate(() => {
        server.close()
        res()
      }),
    )
    listen.mockRestore()
  })
})
