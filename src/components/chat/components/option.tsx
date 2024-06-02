const Option = ({
  boxShadow,
  content,
  textColor,
  backgroundColor,
  className,
}: {
  boxShadow: string
  content: string
  textColor: string
  backgroundColor: string
  className: string
}) => {
  return (
    <div
      className={`pt-1 flex items-center justify-center rounded-full px-6 pb-[6px] text-sm md:text-base ${className}`}
      style={{
        boxShadow: `${boxShadow}`,
        color: `${textColor}`,
        backgroundColor: `${backgroundColor}`,
      }}
    >
      {content}
    </div>
  )
}

export default Option
