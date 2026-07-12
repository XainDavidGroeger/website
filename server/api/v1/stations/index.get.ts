import { filterStations } from '../../../../shared/utils/voltgrid'

export default defineEventHandler((event) => {
  return filterStations(getQuery(event))
})
