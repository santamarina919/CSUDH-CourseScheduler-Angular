

export function calcYear(planYear :number,semesterNumber: number) {
  return planYear + Math.floor(semesterNumber / 2)
}
