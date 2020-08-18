import React, { forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux'
import { labelColors, nodeLabelSizes, edgeLabelSizes } from '../../../features/cypher/CypherUtil'
import CypherResultCytoscapeChart from './CypherResultCytoscapeChart'
import CypherResultCytoscapeLegend from './CypherResultCytoscapeLegend'
import CypherResultCytoscapeFooter from './CypherResultCytoscapeFooter'


const CypherResultCytoscape = forwardRef((props, ref) => {
  const [footerData, setFooterData] = useState({})
  const [legendData, setLegendData] = useState({ edgeLegend: {}, nodeLegend: {} })
  const [elements, setElements] = useState({ edges: [], nodes: [] })
  const [isReloading, setIsReloading] = useState(false)
  const dispatch = useDispatch()
  const chartRef = useRef()

  useEffect(() => {

    if (props.data['legend'] !== undefined && Object.keys(props.data['legend']['nodeLegend']).length > 0) {

      setIsReloading(false)

      setLegendData(props.data['legend'])

      setElements(props.data.elements)
    }
  })

  const getFooterData = (props) => {
    if (props.type === 'labels') {

      props.data['captions'] = ['gid', 'label'].concat(Array.from(chartRef.current.getCaptions(props.data.type, props.data.label)))

      if (props.data.type === 'node') {
        props.data['selectedCaption'] = legendData.nodeLegend[props.data.label].caption
      } else {
        props.data['selectedCaption'] = legendData.edgeLegend[props.data.label].caption
      }
    }

    setFooterData(props)
  }

  const addLegendData = (addedLegendData) => {
    setIsReloading(false)
    setLegendData(addedLegendData)
  }

  const colorChange = (elementType, label, color) => {
    let footerObj = footerData.data
    footerObj.backgroundColor = color.color
    footerObj.fontColor = color.fontColor
    setIsReloading(false)
    setFooterData(Object.assign({}, footerData, { data: footerObj }))

    if (elementType === 'node') {
      let nodeLegendObj = legendData.nodeLegend


      if (nodeLegendObj.hasOwnProperty(label)) {
        nodeLegendObj[label]['color'] = color.color
        nodeLegendObj[label]['borderColor'] = color.borderColor
        nodeLegendObj[label]['fontColor'] = color.fontColor
      }
      setLegendData(Object.assign({}, legendData, { nodeLegend: nodeLegendObj }))
      chartRef.current.colorChange(elementType, label, color);

    } else if (elementType === 'edge') {
      let edgeLegendObj = legendData.edgeLegend
      if (edgeLegendObj.hasOwnProperty(label)) {
        edgeLegendObj[label]['color'] = color.color
        edgeLegendObj[label]['borderColor'] = color.borderColor
        edgeLegendObj[label]['fontColor'] = color.fontColor
      }
      setLegendData(Object.assign({}, legendData, { edgeLegend: edgeLegendObj }))
      chartRef.current.colorChange(elementType, label, Object.assign(color, { fontColor: '#2A2C34' }));
    }

    dispatch(() => props.setLabels(elementType, label, { borderColor: color.borderColor, color: color.color, fontColor: color.fontColor }))
  }

  const sizeChange = (elementType, label, size) => {
    let footerObj = footerData.data
    footerObj.size = size
    setFooterData(Object.assign({}, footerData, { data: footerObj }))
    setIsReloading(false)
    chartRef.current.sizeChange(elementType, label, size);

    if (elementType === 'node') {
      let nodeLegendObj = legendData.nodeLegend
      if (nodeLegendObj.hasOwnProperty(label)) {
        nodeLegendObj[label].size = size
      }
      setLegendData(Object.assign({}, legendData, { nodeLegend: nodeLegendObj }))
    } else if (elementType === 'edge') {
      let edgeLegendObj = legendData.edgeLegend
      if (edgeLegendObj.hasOwnProperty(label)) {
        edgeLegendObj[label].size = size
      }
      setLegendData(Object.assign({}, legendData, { edgeLegend: edgeLegendObj }))
    }
    dispatch(() => props.setLabels(elementType, label, { size: size }))
  }

  const captionChange = (elementType, label, caption) => {
    chartRef.current.captionChange(elementType, label, caption);
    let footerObj = footerData.data
    footerObj.captions = ['gid', 'label'].concat(Array.from(chartRef.current.getCaptions(elementType, label)))
    footerObj.selectedCaption = caption
    setFooterData(Object.assign({}, footerData, { data: footerObj }))

    if (elementType === 'node') {
      let nodeLegendObj = legendData.nodeLegend
      if (nodeLegendObj.hasOwnProperty(label)) {
        nodeLegendObj[label].caption = caption
      }
      setLegendData(Object.assign({}, legendData, { nodeLegend: nodeLegendObj }))
    } else if (elementType === 'edge') {
      let edgeLegendObj = legendData.edgeLegend
      if (edgeLegendObj.hasOwnProperty(label)) {
        edgeLegendObj[label].caption = caption
      }
      setLegendData(Object.assign({}, legendData, { edgeLegend: edgeLegendObj }))
    }
    dispatch(() => props.setLabels(elementType, label, { caption: caption }))
  }


  useImperativeHandle(ref, () => ({

    getCy() {
      return chartRef.current.getCy();
    },

    resetChart() {
      return chartRef.current.resetChart();
    }
  }));

  return <div className="chart-frame-area">
    <CypherResultCytoscapeLegend onLabelClick={getFooterData} isReloading={isReloading} legendData={legendData} />
    <CypherResultCytoscapeChart onElementsMouseover={getFooterData} ref={chartRef} legendData={legendData} elements={elements} addLegendData={addLegendData} />
    <CypherResultCytoscapeFooter colorChange={colorChange} sizeChange={sizeChange} captionChange={captionChange} footerData={footerData} nodeLabelSizes={nodeLabelSizes} edgeLabelSizes={edgeLabelSizes} labelColors={labelColors} />
  </div>
})


export default CypherResultCytoscape