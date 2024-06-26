import React from 'react'

import type { IPipelineWithRun } from '../types'

import PipelineCanvas from '../canvas'

import style from './style.less'

interface PipelineRunResultProps {
  pipelineDef?: IPipelineWithRun
  loading?: boolean
}

const PipelineRunResult: React.FC<PipelineRunResultProps> = (props) => {
  const { pipelineDef, loading = false } = props

  return (
    <main className={style.pipelineResult}>
      <section className={style.canvasBox}>
        <PipelineCanvas
          trigger={pipelineDef?.trigger} loading={loading}
        />
      </section>
    </main>
  )
}

export default PipelineRunResult
