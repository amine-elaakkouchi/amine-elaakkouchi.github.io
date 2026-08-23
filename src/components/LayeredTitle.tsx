export function LayeredTitle({ text }: { text: string }) {
  return (
    <span className="layered-title" aria-label={text}>
      <span className="layered-title-stage" aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => (
          <span className="layered-title-layer" data-text={text} key={index} />
        ))}
      </span>
    </span>
  )
}
