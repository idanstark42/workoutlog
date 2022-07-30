import { useState, useEffect } from 'react'
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { useNavigate } from 'react-router'
import { useLog, REQUIRES_LOGIN } from './log-context'

export default function Stats () {
  const { log } = useLog()
  const navigate = useNavigate()
  const [attendanceData, setAddendenceData] = useState()
  const [successesData, setSuccessesData] = useState()
  useEffect(() => {
    if (log === REQUIRES_LOGIN) return navigate('/')

    setAddendenceData(log.entries.map(entry => entry.date).filter(Boolean).reduce((months, date) => {
      const monthStr = date.substr(date.indexOf('.') + 1).split('.').map(str => String(Number(str))).join('.')
      let monthEntry = months.find(month => month.month === monthStr)
      if (!monthEntry) {
        monthEntry = { month: monthStr, attendance: 0 }
        months.push(monthEntry)
      }
      monthEntry.attendance = monthEntry.attendance + 1
      return months
    }, []))

    setSuccessesData(log.entries.filter(entry => Boolean(entry.date)).map(entry =>
      ({ date: entry.date, successes: entry.exerciseEntries.filter(exEntry => exEntry.success()).length })))

  }, [log, navigate, setAddendenceData, setSuccessesData])

  if (log === REQUIRES_LOGIN) {
    return <div className='loading' />
  }

  return <div className='stats'>
  <div className='title'>STATISTICS</div>
    <div className='card'>
      <div className='title'>Attendence/month</div>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -40, bottom: 80 }}>
          <Bar dataKey='attendance' fill='#663300' stroke='#663300' />
          <XAxis dataKey='month' angle={-45} textAnchor='end' stroke='#663300'/>
          <YAxis tickLine={false} stroke='#663300'/>
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className='card'>
      <div className='title'>Successes/workout</div>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={successesData} margin={{ top: 10, right: 10, left: -40, bottom: 80 }}>
          <Line dataKey='successes' dot={false} fill='#663300' stroke='#663300' />
          <XAxis dataKey='date' angle={-45} textAnchor='end' stroke='#663300' tickFormatter={value => value.split('.').splice(1, 2).join()} />
          <YAxis tickLine={false} stroke='#663300'/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
}
