/* eslint-disable no-useless-constructor */
import { Request, Response } from 'express'
import { CreateStadiumUseCase } from './CreateStadiumUseCase'
import { Location } from '../../../entities/Location'
import { Equal, getRepository } from 'typeorm'

export class CreateStadiumController {
  constructor (
   private createStadiumUseCase: CreateStadiumUseCase
  ) {}

  static async handle (request: Request, response: Response): Promise<Response> {
    console.log(request.body)
    const { name, description, locationName } = request.body

    const locationsRepository = getRepository(Location)
    const location = await locationsRepository.findOne({ name: Equal(locationName) })

    try {
      const results = await CreateStadiumUseCase.execute({
        name: name,
        description: description,
        location: location,
        stadiumImage: request.file.filename
      })

      return response.status(201).json({
        message: 'Stadium creation successfull',
        results: {
          name: results.name,
          description: results.description,
          location: results.location.name,
          stadiumImage: results.stadiumImage,
          request: {
            type: 'GET',
            url: 'http://localhost:8888/v1/stadium/' + results.id
          }
        }
      })
    } catch (err) {
      return response.status(400).json({
        message: err.message || 'Unexpected error.'
      })
    }
  }
}
