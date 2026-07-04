import { type Request, type Response } from 'express'
import prisma from '../../utils/prisma.js'
import { Prisma } from '../../../generated/prisma/client.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

async function creerVoyage(req:Request,res:Response) {

}

async function getVoyagesUtlisateur(req:Request, res:Response) {

}

async function modifierVoyage(req:Request,res:Response) {

}

async function supprimerVoyage(req:Request,res:Response) {

}

export { getVoyagesUtlisateur, creerVoyage, modifierVoyage, supprimerVoyage }