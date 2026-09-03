import { type CreateVoyage } from "../../../../../../shared/types/voyage"

export function convertToISO8601(dateString : string): string {
    return (new Date(dateString)).toISOString()
}

 

export function genererPOSTBodyCreerVoyage(formValues : Partial<CreateVoyage>) : Object {

    const {titre, dateDebV:dateDeb, dateFinV:dateFin, dateDebE, dateFinE,...etapeSansDates} = formValues
    const voyage = {titre,dateDeb,dateFin}
    const etape = {
      dateDeb: dateDebE,
      dateFin: dateFinE,
      ...etapeSansDates
    }

    for (const [k,v] of Object.entries(voyage)) {
        if(k==='dateDeb' || k === 'dateFin') {
          voyage[k] = convertToISO8601(voyage[k] as string)
        }
    }

    for (const [k,v] of Object.entries(etape)) {
        if(k==='dateDeb' || k === 'dateFin') {
          etape[k] = convertToISO8601(etape[k] as string)
        }
    }

    return {
        voyage,
        etape
    }
}