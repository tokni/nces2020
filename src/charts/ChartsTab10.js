import React from 'react'
import Welcome from '../alert/Welcome'
import { MainArea, Flex } from './Charts.style'

const RawHistoricalCharts = props => { 
  return (
    <MainArea>
        <Welcome 
          isOpen={props.scenarioSelection.showWelcome}
          closeWelcome={props.closeWelcome} 
          tab="tab-raw-history"/>
      <Flex>
      
      </Flex>
    </MainArea>
  )
}
export default RawHistoricalCharts