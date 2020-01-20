import React from 'react'
import { Heading, Pane, majorScale } from 'evergreen-ui'

import SemanticComponentBuilder from '../../library/services/SemanticComponentBuilder'

import { defaultSemanticComponentErrorHandler } from '../utils/Errors'
import Semantics from '../utils/semantics'
import DateAnalytic from './DateAnalytic'
import PercentageAnalytic from './PercentageAnalytic'

const Analytics = ({ creationDate, lastUpdate, updatesCount }) => {
  return <>
    <Heading size={600} marginBottom={majorScale(2)}>Analytics Overview</Heading>
    <Pane display="flex" flexWrap="wrap">
      <DateAnalytic value={creationDate} label='creation'/>
      <DateAnalytic value={lastUpdate} label='last update' iconColor='#f76c5e' />
      <PercentageAnalytic value={updatesCount*3} valueToDisplay={updatesCount} label='updates count' icon='edit' iconColor='#069e2d' />
    </Pane>
  </>
}

export const AnalyticsSemanticBuilder = new SemanticComponentBuilder(
  Semantics.vnd_jeera.terms.Analytics,
  Analytics,
  {
    id: Semantics.vnd_jeera.terms.resourceId,
  },
  {
    creationDate: Semantics.schema.terms.createdOn,
    lastUpdate: Semantics.schema.terms.lastUpdate,
    updatesCount: Semantics.vnd_jeera.terms.updatesCount
  },
  {},
  defaultSemanticComponentErrorHandler('analytics')
)

export const AnalyticsSemantic = AnalyticsSemanticBuilder.build()

export default Analytics
