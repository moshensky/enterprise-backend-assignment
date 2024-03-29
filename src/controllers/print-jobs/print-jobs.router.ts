import express from 'express'
import { authenticate } from '../../request-handlers/authenticate'
import { deletePrintJobController } from './delete-print-job.controller'
import { getPrintJobController } from './get-print-job.controller'
import { getPrintJobsController } from './get-print-jobs.controller'
import { postPrintJobController } from './post-print-job.controller'
import { putPrintJobController } from './put-print-job.controller'

export const printJobsRoute = express
  .Router()
  .use(authenticate)
  .get('/:id', getPrintJobController)
  .get('', getPrintJobsController)
  .put('/:id/cancel', putPrintJobController)
  .delete('/:id', deletePrintJobController)
  .post('', postPrintJobController)
