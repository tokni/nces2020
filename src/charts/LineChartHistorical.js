import React from 'react'
import styled from 'styled-components'
import parseHtml from 'html-react-parser'
import mapRegionToDataRegions from "./../data/mapRegionToDataRegions"
import { colorNER } from "./chartColors"
import historicalYears from "./../data/historicalyears"
import { CSVLink } from 'react-csv'
import {
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryGroup,
  VictoryTheme,
  VictoryAxis,
  VictoryLine
} from 'victory'

const ChartContainer = styled.div`
  width: 550px;
  height: 650px;
  background: white;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`
const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 70px;
  margin-right: 30px;
  margin-top: 20px;
  margin-bottom: 10px;
`
const ChartTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
`
const getCSVData = (lineData) => {
  let ret = []
  Object.entries(lineData).forEach((indicatorGroup) => {
    indicatorGroup[1].forEach((item)=>{
      ret.push({indicatorGroup: indicatorGroup[0], year: item.x, value: item.y})
    })
  })
  return ret
}
const LineChartHistorical = ({
  chartName = "chart name",
  data = [],
  selectedCountries = [],
  xRange = historicalYears
}) => {
  let gutter, rowGutter
  if (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    gutter = 0
    rowGutter = 0
  } else {
    gutter = 0
    rowGutter = 0
  }

let selectedDataRegions = [] 
mapRegionToDataRegions.forEach((mapRegion) => {
  if(selectedCountries.includes(mapRegion.path_id)) {
  mapRegion.historical_data_regions.forEach((dataRegion) => {
    selectedDataRegions.push(dataRegion)
  })
}
})
const fixedcolorCountries = [ 'Sweden', 'Norway', 'Denmark', 'Finland', 'Iceland']
const countryColors = () => {
  let ret = colorNER.slice(0, 4)
  fixedcolorCountries.forEach((country, index)=>{
    ret[country] = colorNER[index]
  })
  ret['total'] = 'black'
  return ret
}
const renderLines = (lineData) => {
  let ret = []
  for (let line in lineData) {
    ret.push(<VictoryLine 
      key={"lini2"} 
      data={lineData[line]}
      style={{
        data: { stroke: countryColors(selectedDataRegions)[line] },
      }}>
    </VictoryLine>)
  }
  return ret
}
const legends = selectedDataRegions
legends.push("total")

return (
  <>
  <ChartContainer>
  <ChartHeader>
      <ChartTitle>{parseHtml(chartName.replaceAll("CO2", "CO<sub>2</sub>"))}</ChartTitle>
      <CSVLink 
        data={getCSVData(data)}
        filename={chartName + " " + selectedCountries + ".csv"}
      >
        Download as CSV</CSVLink>
    </ChartHeader>
  <div>
    {selectedCountries.length !== 0 && <VictoryChart domainPadding={20}
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
        style={{parent: { height: "550px" }}}
        theme={VictoryTheme.material}>
        <VictoryAxis 
          key={'lineAxis'} tickValues={xRange} />
          <VictoryAxis
            dependentAxis
            axisLabelComponent={<VictoryLabel dx={10} dy={-50}/>}
            key={2}
            offsetX={80}
            label={"Share"}
          />
          <VictoryLegend
        x={90}
        y={5}
        orientation="horizontal"
        gutter={gutter}
        rowGutter={rowGutter}
        symbolSpacer={4}
        itemsPerRow={4}
        style={{
          title: { fontSize: 14, leftPadding: -10 },
        }}
        data={Array.from(legends).map((legend, i) => ({
            name: legend
              .concat('        ')
              .substr(0, 16),
            symbol: {fill: countryColors(selectedDataRegions)[legend]},
          }))}
        labelComponent={<VictoryLabel style={{ fontSize: '12px' }} />}
      />
          <VictoryGroup>
            {renderLines(data)}
          </VictoryGroup>
    </VictoryChart>}
    </div>
  </ChartContainer>
  </>
)
}
export default LineChartHistorical