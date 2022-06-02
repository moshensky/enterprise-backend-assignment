# Labeling printer

![Pull Request CI/CD](https://github.com/moshensky/enterprise-backend-assignment/workflows/Pull%20Request%20CI/CD/badge.svg?branch=main)

This service is responsible for printing custom labels from a LIMS on a specialized labeling printers.

A LIMS administrator via LIMS APIs can configure LIMS with known labeling-printer service IPs.

## User stories

- As a laboratory assistant I can print various labels with one click from LIMS using onsite printer.
- As a laboratory assistant I can observe my print job status.
- As a laboratory assistant I can cancel my print job, if it has not been started.
- As an administrator I can view all printing jobs.
- As an administrator I can delete a print job from the queue or history log.

## Constraints

- State of printing jobs should be persisted on system restart.
- Should be able to run on a Raspberry Pi 3 Model B.
- Supported printers: brother ql-570, brother ql-710w.
- Max 15 concurrent users per day.
- Max 250 labels printed per day.
- It is not expected the service to scale up in the next 1 year.
- The service is going to be deployed on a computer to which a supported printer is going to be attached physically.
- The service is going to be deployed in the same private network with other computers where LIMS clients are running.
- Technology stack: node.js (lts), typescript, openapi, plantuml
- For authorization a bearer token has to be used with according claims. LIMS is responsible for providing one.

## Architecture overview

![System context diagram](docs/diagrams/out/system_context/system_context.png)
![Labeling printer container diagram](docs/diagrams/out/labeling_printer_container_diagram/labeling_printer_container_diagram.png)
![Labeling printer component diagram](docs/diagrams/out/labeling_printer_component_diagram/labeling_printer_component_diagram.png)

## API Documentation

[openapi definition](docs/labeling-printer.0.0.oas.yaml)

## Back of the envelope calculations

TODO:

- System performance characteristics?
- Bottlenecks and resource estimations?

## Development

Make sure you have `nvm` installed. From the projects folder execute:

```sh
nvm use
npm install
```

A mock server using api definition can be started via:

```sh
npm run start:mock-api
```

To run tests:

```sh
npm test
```

## TODO

- [ ] Implement worker that will get waiting printer jobs and complete them one by one
- [ ] Generate openapi static website 
- [ ] Monitoring
- [ ] Metrics
- [ ] Potential improvements (add rate limiter, x docs to print per ip/user per y secs; should it be client side or server side; separate service or app code)
- [ ] Operation issues (CD? How to monitor metrics and error logs? How to roll out the system? How to updated it?)
- [ ] Create api design guidelines


## Developing

This projects uses [Knex.js](https://knexjs.org) to manage sqlite3 db.
In package.json there are scripts that help with database management:

```sh
    "db:migrate": "npx knex --knexfile ./src/db/knexfile.ts migrate:latest",
    "db:seed": "npx knex --knexfile ./src/db/knexfile.ts seed:run",
    # Will reset local database to initial state
    "db:reset": "npm run db:migrate && npm run db:seed"
```

Database files are not committed to git. Make sure to run `npm run db:reset`, if you don't have already a local database.

## Testing api with curl

Start server:

```sh
npm start
```

Make sure to export one of the sample tokens:

```sh
# "userId": "2e9e8c93-a29f-4f35-9cd1-d42489e1a016", "isAdmin": true
export TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTllOGM5My1hMjlmLTRmMzUtOWNkMS1kNDI0ODllMWEwMTYiLCJpc0FkbWluIjp0cnVlfQ.NzsZlvC1Lje9OWIkBhd227XOv6PZzFVaTScgDTGVa1w
# "userId": "62084f00-8fdd-410c-800c-d06ee3258894"
export TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjA4NGYwMC04ZmRkLTQxMGMtODAwYy1kMDZlZTMyNTg4OTQifQ.ay3PtKhDvNrTy_IQ35JQ0vcX5CWBD0GueaJ9IXluU_w
```

Seeded job ids:

```sh
# created by regular user from above token
export JOB_ID=cbf8847a-e70a-44ee-bac7-12f28430b81c
# created by regular user 2
export JOB_ID=ac09bffd-8fc7-4a07-91c5-4068f59d9fe7
# created by regular user from above token
export JOB_ID=f5dfe977-7d7a-4e85-baca-a8851e1ce798
```

Samples:

```sh
# Get empty response, make sure `isAdmin` token is defined
curl -X 'GET' -v \
  'http://localhost:5000/print-jobs' \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN" 

# Delete job with id
curl -X 'DELETE' -v \
  "http://localhost:5000/print-jobs/$JOB_ID" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN" 
```
