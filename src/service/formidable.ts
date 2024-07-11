import { IncomingForm } from 'formidable'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import sharp from 'sharp'

const uploadImage = (req: Request, res: Response) => {
  try {
    const form = new IncomingForm()
    form.encoding = 'utf-8'
    form.keepExtensions = true
    form.multiples = false
    form.maxFileSize = 5 * 1024 * 1024
    form.maxFieldsSize = 1

    let myFile: any = {}

    form.on('progress', (bytesReceived, bytesExpected) => { })
    form.on('field', (name, field) => { })
    form.on('fileBegin', (name, file) => {
      const fileType = file.type.split('/').pop()
      const fileName = uuidv4() + '.' + fileType
      // tslint:disable-next-line:prefer-switch
      if (fileType.toLowerCase() === 'jpg' || fileType.toLowerCase() === 'png' || fileType.toLowerCase() === 'jpeg') {
        if (!fs.existsSync('public')) fs.mkdirSync('public')
        if (!fs.existsSync('tmp')) fs.mkdirSync('tmp')
        if (!fs.existsSync('public/images')) fs.mkdirSync('public/images')

        const path = 'tmp/' + fileName
        file.path = path
        file.name = fileName
      } else {
        return res.status(400).end({ message: 'file type not matching' })
      }
    })

    form.on('file', async (name, file) => {
      const originalPath = 'tmp/' + file.name
      const mimeTypeAsJpeg = file.name.split('.')[0] + '.jpeg'
      const resizePath = 'public/images/' + mimeTypeAsJpeg
      // const awsPath = 'images/' + mimeTypeAsJpeg

      await sharp(originalPath)
        .toFormat('jpeg')
        .jpeg({ quality: 20, force: true })
        .toFile(resizePath)
      // const data: any = await uploadFileToS3(resizePath, awsPath)
      // if (data) {
      //   myFile = {
      //     link: data.Key,
      //     src: data.Location,
      //   }
      // } else {
      //   myFile = null
      // }
      return res.status(201).json({
        // name: mimeTypeAsJpeg,
        link: 'images/' + mimeTypeAsJpeg,
        // src: process.env.SERVER_NAME + 'images/' + mimeTypeAsJpeg,
      })
    })
    form.on('aborted', () => {
      return res.status(400).json({ message: 'Request aborted by the user' })
    })
    form.on('error', (e) => {
      // console.error(e)
      return res.status(400).json(e)
    })
    // form.on('end', () => {
    //     return res.status(201).json(
    //         myFile ?  { file: myFile } : { message: 'No file eiei' }
    //     )
    // })

    form.parse(req)
  } catch (e) {
    res.send(e)
  }
}

export default uploadImage