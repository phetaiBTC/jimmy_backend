import { CronJob } from 'cron'
import fs from 'fs'

export const authClearTmp = new CronJob('00 00 00 * * *', () => {
  if (fs.existsSync('./tmp')) {
    fs.readdir('./tmp', (err, files) => {
      if (err) throw err
      for (const file of files) {
        fs.unlinkSync('./tmp/' + file)
      }
    })
  }
}, null, true, 'Asia/Bangkok')