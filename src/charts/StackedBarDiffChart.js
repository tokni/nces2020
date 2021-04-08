import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import years from "../data/years"
//import { useTranslation } from 'react-i18next'
import {
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryGroup,
  VictoryStack,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
} from 'victory'
import {createAccumulatedData} from './Tools'
import parseHtml from 'html-react-parser'

const ChartTitle = styled.div`
  margin-left: 70px;
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  font-family: Ropa Sans;
`
const ChartContainer = styled.div`
  width: 550px;
  background: white;
  margin-right: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
`

const StackedBarChart = props => {
  //const { t } = useTranslation()
  const stackedBar = props.stackedBar
  const scenario = props.selectedScenario
  const scenario2 = props.selectedScenario2
  const selectedCountries = props.selectedCountries
  const chartName = props.chartName
  //const chartTitle = t('chartTitle.' + props.chartTitle)
  const chartTitle = props.chartTitle
  const combinedChart = props.combinedChart
  const periods = years
  let gutter, rowGutter
  let minY = props.minY
  let maxY = props.maxY

  if (
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    gutter = 0
    rowGutter = 0
  } else {
    gutter = -40
    rowGutter = -5
  }

  let maxY2 = 1
  let minY2 = 0
  if (combinedChart === true) {
    maxY2 = props.maxY2
    minY2 = props.minY2
  }

  let yDomain = [0, 1]
  if (minY < 0 || minY2 < 0) {
    let stackedRatio = minY / maxY
    let lineRatio = minY2 / maxY2
    yDomain = stackedRatio < lineRatio ? [stackedRatio, 1] : [lineRatio, 1]
  }

  const dataScenario1 = createAccumulatedData(stackedBar.data, scenario, false, chartName, selectedCountries)
  const dataScenario2 = createAccumulatedData(stackedBar.data, scenario2, false, chartName, selectedCountries)
  const accumulatedDataScenario1 = dataScenario1[0]
  const accumulatedDataScenario2 = scenario2 ? dataScenario2[0] : undefined
  let diffData = JSON.parse(JSON.stringify(accumulatedDataScenario1))
  const unit = dataScenario1[3]
  Object.keys(accumulatedDataScenario2).forEach(indicatorName => {
    accumulatedDataScenario2[indicatorName].forEach((yearValue, index) => {
      diffData[indicatorName][index].total =  diffData[indicatorName][index].total - yearValue.total
    })
  }) 
  let maxValue = -Infinity
  let minValue = Infinity
  let base = 0

  let totalYearValuesPos = {}
  let totalYearValuesNeg = {}
  
  years.forEach(year => {
    totalYearValuesPos[year] = 0
    totalYearValuesNeg[year] = 0
  })
  Object.keys(diffData).forEach(indicatorName => {
    diffData[indicatorName].forEach(yearValue => {
      let value = yearValue.total
      if (value < 0) {
        totalYearValuesNeg[yearValue.year] += yearValue.total

      } else {
        totalYearValuesPos[yearValue.year] += yearValue.total

      }
    })
  })
  Object.keys(totalYearValuesPos).forEach(year => {
    /* console.log("maxValue: ", maxValue)
    console.log("minValue: ", minValue)
    console.log("totalYearValuesPos[year]: ", totalYearValuesPos[year])
    console.log("totalYearValuesNeg[year]: ", totalYearValuesNeg[year]) */
    maxValue = Math.round(Math.max(maxValue, totalYearValuesPos[year]))
    minValue = Math.round(Math.min(minValue, totalYearValuesNeg[year]))
  })
  let t = 1
  let i = 0
  let range = [2,4,6,8,10]
  while(t < maxValue) {
    /* console.log("t: ", t)
    console.log("maxValue: ", maxValue) */
    t = range[i%5]*Math.pow(range[4], Math.floor(i/5))
    i++
  }
  maxValue = t
  let u=1
  let j=0
  while(u > minValue && j < 20) {
    /* console.log("u: ", u)
    console.log("minValue: ", minValue) */
    u = -range[j%5]*Math.pow(range[4], Math.floor(j/5))
    j++
  }
  minValue = u

  //base is used in tickFormat
  if (maxValue < -minValue) 
    base = -minValue
  else 
    base = maxValue

  /* console.log("maxValue: ", maxValue)
  console.log("minValue: ", minValue)
  console.log("base: ", base) */
  const defTick = [0, 0.25, 0.5, 0.75]
  const getTickValues = () => {
      let ret = []
      if (-minValue > maxValue) {
        ret=[-0.75,-0.5, -0.25, 0]
        defTick.forEach((tick, i)=> {
          if (tick !== 0.75)
          if (-tick*minValue < maxValue)
          ret.push(defTick[i+1])
        })
      }
      else {
        ret=[0, 0.25, 0.5, 0.75]
        defTick.forEach((tick, i)=> {
          if (tick !== 0.75)
            if (tick*maxValue + maxValue*0.05 < -minValue)
              ret.unshift(-defTick[i+1])
        })
      }
      //console.log("ticks: ", ret)
      return ret
    }

  const colors = [
    '#5cbae6',
    '#b6d957',
    '#fac364',
    '#8cd3ff',
    '#d998cb',
    '#f2d249',
    '#93b9c6',
    '#ccc5a8',
    '#ffcc00',
    '#ff9900',
    '#ff6600',
    '#ff0000',
    '#990000',
    '#ff0099',
    '#cc3399',
    '#990066',
    '#660066',
    '#660099',
    '#3366cc',
    '#33ccff',
    '#99cc33',
    '#66cc00',
    '#aad199',
    '#45535c',
    '#471442',
    '#612e30',
    '#7a713c',
    '#09e682',
    '#160154',
    '#fc53ec',
    '#454023',
    '#4b7060',
    '#4221a6',
    '#f2aceb',
    '#ede095',
    '#0395f7',
    '#7346fa',
    '#82627f',
  ]
  const HTMLLabel = props => {
    const text = props.text.replaceAll('§', '')
  
    return (
      <foreignObject x={props.x+3} y={props.y-9} width={600} height={700}>
        <div style={{ fontSize: '12px', fontFamily: "Open Sans" }}>{parseHtml(text)}</div>
      </foreignObject>
    );
  };

  return (
    <ChartContainer>
      <ChartTitle>{chartTitle}</ChartTitle>
      <VictoryChart
        domainPadding={20}
        width={550}
        height={550}
        padding={{ left: 80, right: 50, top: 50, bottom: 50 }}
        theme={VictoryTheme.material}
        domain={{ y: yDomain }}
      >
        
        <VictoryAxis key={0} tickValues={periods} tickFormat={periods} />
        <VictoryAxis
          dependentAxis
          axisLabelComponent={<VictoryLabel dx={10} dy={-50} />}
          key={2}
          offsetX={80}
          tickFormat={tick => {
            if (isNaN(maxValue)) {
              return 0
            }
            if (props.YPercentage) {
              return (
                Math.round((tick * maxValue * 100) / props.divideValues, 0) +
                '%'
              )
            }
            return Math.round((tick * base) / props.divideValues, 0)
          }}
          tickValues={getTickValues()}
          label={unit}
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
          colorScale={colors}
          data={Object.keys(diffData).map((indicatorName, i) => ({
            name: indicatorName
              .concat('§§§§§§§§§§§§§§§§§§§§§')
              .substr(0, 16),
            fill: colors[i],
          }))}
          labelComponent={<HTMLLabel />}
        />
        <VictoryGroup offset={15} style={{ data: { width: 15 } }}>
          <VictoryStack>
            {Object.keys(diffData).map((indicatorName, i) => (
              <VictoryBar
                key={indicatorName}
                data={diffData[indicatorName].map(chartGroupValue => ({
                  ...chartGroupValue,
                  label:
                    'Difference: ' +
                    indicatorName +
                    ': ' +
                    (props.YPercentage
                      ? (
                          (chartGroupValue.total * 100) /
                          props.divideValues
                        ).toFixed(0) + '%'
                      : (chartGroupValue.total / props.divideValues).toFixed(
                          0
                        )),
                }))}
                x="year"
                y={datum => maxValue === 0 ? 0 : datum['total'] / base}
                labelComponent={<VictoryTooltip />}
                style={{
                  data: { fill: colors[i] },
                }}
              />
            ))}
          </VictoryStack>
        </VictoryGroup>
      </VictoryChart>
    </ChartContainer>
  )
}

StackedBarChart.defaultProps = {
  divideValues: 1,
  YPercentage: false,
}

StackedBarChart.propTypes = {
  stackedBar: PropTypes.object,
  line: PropTypes.object,
  selectedScenario: PropTypes.string.isRequired,
  selectedScenario2: PropTypes.string.isRequired,
  chartName: PropTypes.string.isRequired,
  chartTitle: PropTypes.string.isRequired,
  combinedChart: PropTypes.bool.isRequired,
  minY: PropTypes.number.isRequired,
  maxY: PropTypes.number.isRequired,
  minY2: PropTypes.number,
  maxY2: PropTypes.number,
  label: PropTypes.string.isRequired,
  divideValues: PropTypes.number,
  label2: PropTypes.string,
  YPercentage: PropTypes.bool,
  Y2Percentage: PropTypes.bool,
  selectedCountries: PropTypes.array.isRequired,
}

export default StackedBarChart
