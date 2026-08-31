
export function convertToISO8601(dateString : string): string {
    return (new Date(dateString)).toISOString()
}