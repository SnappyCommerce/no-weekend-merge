import * as core from '@actions/core'
import {isInDowntime, getUTCAdjustments} from './check'

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

async function run(): Promise<void> {
  const currentDate = new Date()

  try {
    const tz = parseFloat(core.getInput('tz'))
    const utcAdjustments = getUTCAdjustments(tz)

    // Apply UTC adjustments to the current-time
    currentDate.setUTCHours(currentDate.getUTCHours() + utcAdjustments.hours)
    currentDate.setUTCMinutes(
      currentDate.getUTCMinutes() + utcAdjustments.minutes
    )

    core.info(`TZ: ${tz} - Day: ${currentDate.getUTCDay()}`)

    const downtimes = core.getInput(days[currentDate.getUTCDay()]) || ''
    core.info(`Downtimes: ${downtimes}`)

    for (const downtime of downtimes.split(',')) {
      if (isInDowntime(currentDate, utcAdjustments, downtime)) {
        core.info(`Failed downtime: ${downtime}`)
        core.info(`Current Date: ${currentDate}`)
        core.info(
          `Day: ${days[currentDate.getUTCDay()]} (${currentDate.getUTCDay()})`
        )
        core.setFailed(
          `The PR cannot be merged at this time (${currentDate}) with the current settings (${downtime}).`
        )
      }
    }
  } catch (error) {
    core.setFailed(`Error: ${error.message}. Run date: ${currentDate}.`)
  }
}

run()
