import React from 'react'
import type { DOMPosSize, FlowLine } from '../types'

import { clsPrefix } from '../vars'
import './style.less'

interface PipelineSvgLayerProps {
  flowLines: FlowLine.Matrix
  cellsSize: DOMPosSize[][]
  containerSize: [number, number]
}

const PipelineSvgLayer: React.FC<PipelineSvgLayerProps> = (props) => {
  const { flowLines, cellsSize, containerSize } = props

  return (
    <svg className={`${clsPrefix}-canvas-svg`}
      width={containerSize[0]} height={containerSize[1]}
      focusable={false}
    >
      {
        flowLines.map((stages, xIndex) => (
          stages.map((ends, yIndex) => {
            const startDomSize = cellsSize?.[xIndex]?.[yIndex]
            if (startDomSize === undefined) return null
            const startPt = [startDomSize.left + startDomSize.width, startDomSize.top + 26]
            return ends.map((end, endIndex) => {
              const endDomSize = cellsSize?.[end.pos[0]]?.[end.pos[1]]
              if (endDomSize === undefined) return null
              const endPt = [endDomSize.left, endDomSize.top + 26]

              let tagPos = [startPt[0] + (endPt[0] - startPt[0]) / 2, startPt[1] + (endPt[1] - startPt[1]) / 2]
              let tagTranslate: [string, string] = ['6px', '0px']
              const intPts: Array<[number, number]> = []
              let svgStr: string = `M${startPt[0]} ${startPt[1]} `

              if (endPt[0] - startPt[0] === 0 || endPt[1] - startPt[1] === 0) {
                svgStr += `L ${endPt[0]} ${endPt[1]}`

                if (endPt[0] - startPt[0] === 0) {
                  tagTranslate = ['6px', '8px']
                } else if (endPt[1] - startPt[1] === 0) {
                  tagTranslate = ['6px', '-5px']
                }
              } else {
                intPts.push([startPt[0] + (endPt[0] - startPt[0]) / 2, startPt[1]])
                intPts.push([startPt[0] + (endPt[0] - startPt[0]) / 2, endPt[1]])

                tagPos = [startPt[0] + (endPt[0] - startPt[0]) / 2, endPt[1]]
                tagTranslate = ['6px', '-5px']

                svgStr += `L ${intPts[0][0]} ${intPts[0][1]} L ${intPts[1][0]} ${intPts[1][1]} L ${endPt[0]} ${endPt[1]}`
              }

              return (
                <g key={`${xIndex}-${yIndex}-${endIndex}`}>
                  <path d={svgStr} fill={'transparent'}
                    stroke={end.lineStyle?.color ?? '#ccc'}
                    strokeWidth={end.lineStyle?.width ?? 2} 
                    strokeDasharray={end.lineStyle?.solid ? '0': '4,3'}
                  >
                  </path>
                  <circle cx={startPt[0]} cy={startPt[1]} r={5} fill={'#fff'} stroke={end.lineStyle?.color ?? '#999'} />
                  <circle cx={endPt[0]} cy={endPt[1]} r={3} fill={end.lineStyle?.color ?? '#666'} stroke={'transparent'} />
                  {
                    intPts.map(pt => (
                      <circle key={`${pt[0]}-${pt[1]}`}
                        cx={pt[0]} cy={pt[1]} r={3}
                        fill={'#fff'} stroke={end.lineStyle?.color ?? '#999'} />
                    ))
                  }
                  {
                    end.tag !== undefined
                      ? <text x={tagPos[0]} y={tagPos[1]}
                        dx={tagTranslate[0]} dy={tagTranslate[1]}
                        fill={end.tag.color ?? '#999'} fontSize={end.tag.size ?? 12}
                      >
                        {end.tag.text}
                      </text>
                      : null
                  }
                </g>
              )
            })
          })
        ))
      }
    </svg>
  )
}

PipelineSvgLayer.displayName = 'PipelineSvgLayer'
export default React.memo(PipelineSvgLayer)

