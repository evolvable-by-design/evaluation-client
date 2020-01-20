import React from 'react'

import AnalyticCard from './AnalyticCard'

const DateAnalytic = ({ icon, iconColor, label, value }) => 
  <AnalyticCard value={new Date(value).toLocaleString('en-US')} icon={icon || 'time'} iconColor={ iconColor || '#99b2dd' } label={label} />

export default DateAnalytic