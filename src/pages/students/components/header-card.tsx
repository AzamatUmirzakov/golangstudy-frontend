export type StudentsHeaderCardProps = {
  text: string
  subtext: string
  number: number
}


function StudentsHeaderCard(props: StudentsHeaderCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
      <h2 className="text-base font-semibold text-gray-900 mb-1">{props.text}</h2>
      <p className="text-sm text-gray-600 mb-4">{props.subtext}</p>
      <div className="text-3xl font-bold text-gray-900">{props.number}</div>
    </div>
  )
}

export default StudentsHeaderCard