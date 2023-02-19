export const getWeekDays = (week: number) => {
  return {
    0: 'Domingo',
    1: 'Segunda-feira',
    2: 'Terça-feita',
    3: 'Quarta-feita',
    4: 'Quinta-feira',
    5: 'Sexta-feita',
    6: 'Sábado',
  }[week]
}
