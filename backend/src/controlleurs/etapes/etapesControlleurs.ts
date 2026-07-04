import { type Request, type Response } from "express";
import prisma from '../../utils/prisma.js'
import { Prisma } from '../../../generated/prisma/client.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'


async function ajouterEtape(req:Request,res:Response) {

}

async function getEtapes(req:Request,res:Response) {

}

async function modifierEtape(req:Request, res:Response) {

}

async function supprimerEtape(req:Request,res:Response) {

}

export { ajouterEtape, getEtapes, modifierEtape, supprimerEtape }