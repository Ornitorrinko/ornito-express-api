const CronJob = require('cron').CronJob

module.exports = class Cron {
  constructor () {
    this._jobs = []
  }

  register () {
    this._jobs
      .filter(job => job.enabled)
      .forEach(job => {
        console.log(`Registering background job: ${job.name}`)
        new CronJob(job.schedule, () => {
          _run(job)
        }, null, true)
      })
  }
}

const _run = (task) => {
  return task.spec()
}
