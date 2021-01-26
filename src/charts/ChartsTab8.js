import React from 'react'
//import PropTypes from 'prop-types'
import Welcome from '../alert/Welcome'
import { MainArea, Flex } from './Charts.style'
import StackedBarChartHistorical from './StackedBarChartHistorical'
import HistoricalData from "./../data/stackedBarTab8"
import {createIndicator1Data} from "./Tools"

const HistoricalCharts = props => {
  createIndicator1Data(HistoricalData)
  return (
    <MainArea>
      {props.scenarioSelection.showWelcome === true && (
        <Welcome closeWelcome={props.closeWelcome} />
      )}
      <Flex>
        {/* {HistoricalData.data.map((indicator)=>{
          console.log("H indicator: ", indicator)
        })} */}
        <StackedBarChartHistorical
          stackedBar={HistoricalData}
          selectedCountries={props.selectedCountries}
        ></StackedBarChartHistorical>
        
      </Flex>
    </MainArea>
  )
}

export default HistoricalCharts