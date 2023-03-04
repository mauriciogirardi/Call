import { useState } from 'react'
import { CalendarStep } from './CalenderStep'
import { ConfirmStep } from './ConfirmStep'

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  const handleClearSelectedDateTime = () => {
    setSelectedDateTime(null)
  }

  if (selectedDateTime)
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
      />
    )

  return <CalendarStep onSelectedDateTime={setSelectedDateTime} />
}
