import React from 'react'

type CircularProgressBarProps = {
  strokeWidth?: number
  sqSize?: number
  percentage: number
}

const CircularProgressBar = ({ strokeWidth = 8, sqSize = 16, percentage }: CircularProgressBarProps) => {
  // const { strokeWidth = 8, sqSize = 160, percentage } = props
  const radius = (sqSize - strokeWidth) / 2
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  const dashArray = radius * Math.PI * 2
  const dashOffset = dashArray - (dashArray * (percentage || 0)) / 100

  return (
    <div className='flex items-center justify-center'>
      <svg width={sqSize} height={sqSize} viewBox={viewBox}>
        <circle
          className='fill-none stroke-gray-200'
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeWidth={`${strokeWidth}px`}
        />
        <circle
          className='fill-none stroke-[#73C4FF] transition-all ease-in'
          cx={sqSize / 2}
          cy={sqSize / 2}
          r={radius}
          strokeLinecap='round'
          strokeWidth={`${strokeWidth}px`}
          transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      <span className='absolute text-xl text-[#73C4FF]'>{percentage}%</span>
    </div>
  )
}

export default CircularProgressBar
