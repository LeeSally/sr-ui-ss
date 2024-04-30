import React from 'react'

import { clsPrefix } from '../vars'
import './style.less'

interface PlaceHolderCellProps {
  xIndex?: number
  yIndex?: number
}

const PlaceHolderCell: React.FC<PlaceHolderCellProps> = (props) => {
  const { xIndex, yIndex } = props
  return (
    <div className={`${clsPrefix}-canvas-flex-box-stage-place-holder`}>[{xIndex}, {yIndex}]</div>
  )
}

export default PlaceHolderCell


