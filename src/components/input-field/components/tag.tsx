export type TagType = {
  text: string
  backgroundColor: string
  textColor: string
}

const Tag = ({ text, backgroundColor, textColor }: TagType) => {
  return (
    <div
      style={{ backgroundColor: `${backgroundColor}` }}
      className='flex flex-row items-center justify-center rounded px-2 py-1'
    >
      <span style={{ color: `${textColor}` }} className='text-sm md:text-base font-medium capitalize tracking-[1px]'>
        {text}
      </span>
    </div>
  )
}

export default Tag
