export type UUID = string

export type RequestLabel = Readonly<{
  type: 'request-label'
  requestNumber: string
  requestCreatedAt: string
}>

export type RequestIndicatorLabel = Readonly<{
  type: 'request-indicator-label'
  requestIndicatorId: string
  requestNumber: string
  executorUser: string
  indicatorName: string
  indicatorMethod: string
}>

export type Label = RequestLabel | RequestIndicatorLabel

export type NewPrintJob = Readonly<{
  label: Label
  copies: number
}>

export type ExistingPrintJob = NewPrintJob &
  Readonly<{
    id: UUID
    createdByUserId: UUID
    createdAt: string
  }>

export type WaitingPrintJob = ExistingPrintJob &
  Readonly<{
    state: 'waiting'
  }>

export type StartedPrintJob = ExistingPrintJob &
  Readonly<{
    state: 'printing'
    startedAt: string
  }>

export type CompletedPrintJob = ExistingPrintJob &
  Readonly<{
    state: 'completed'
    startedAt: string
    completedAt: string
  }>

export type CanceledPrintJob = ExistingPrintJob &
  Readonly<{
    state: 'canceled'
    canceledAt: string
    canceledByUserId: string
  }>

export type PrintJob = WaitingPrintJob | StartedPrintJob | CompletedPrintJob | CanceledPrintJob
